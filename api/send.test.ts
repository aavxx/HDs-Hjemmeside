import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resetRateLimit } from "./_spam";

const sendEmail = vi.fn(async () => ({ data: { id: "mail_1" }, error: null }));
const insertRow = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendEmail };
  },
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      insert: (row: unknown) => {
        insertRow(row);
        return { select: () => ({ single: async () => ({ data: { id: "row_1" }, error: null }) }) };
      },
      update: () => ({ eq: async () => ({ error: null }) }),
    }),
  }),
}));

const { default: handler } = await import("./send");

const VALID_BODY = {
  name: "Anne Nielsen",
  email: "anne@example.dk",
  subject: "Spørgsmål til bestilling",
  message: "Hej Henriette, jeg vil gerne høre om du laver specialbestillinger. Mvh Anne",
  elapsedMs: 30_000,
  turnstileToken: "0.gyldig-token",
};

function mockRes() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as VercelResponse & { statusCode: number; body: { ok: boolean; error?: string } };
}

function mockReq(body: Record<string, unknown>, ip = "203.0.113.9") {
  return { method: "POST", headers: { "x-forwarded-for": ip }, body } as unknown as VercelRequest;
}

/** Svar som Cloudflares siteverify. */
function stubSiteverify(success: boolean, errorCodes: string[] = []) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ success, "error-codes": errorCodes }),
    })) as unknown as typeof fetch,
  );
}

describe("POST /api/send – Turnstile", () => {
  beforeEach(() => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    resetRateLimit();
    sendEmail.mockClear();
    insertRow.mockClear();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    delete process.env.TURNSTILE_SECRET_KEY;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sender mails når Turnstile godkender", async () => {
    stubSiteverify(true);
    const res = mockRes();
    await handler(mockReq(VALID_BODY), res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(sendEmail).toHaveBeenCalled();
  });

  it("afviser med 400 og sender ingen mail, når Turnstile siger nej", async () => {
    stubSiteverify(false, ["invalid-input-response"]);
    const res = mockRes();
    await handler(mockReq({ ...VALID_BODY, turnstileToken: "0.forfalsket" }), res);

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(insertRow).not.toHaveBeenCalled();
  });

  it("afviser når token'en mangler helt, uden at spørge Cloudflare", async () => {
    stubSiteverify(true);
    const { turnstileToken: _omitted, ...withoutToken } = VALID_BODY;
    const res = mockRes();
    await handler(mockReq(withoutToken), res);

    expect(res.statusCode).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("svarer 500 når TURNSTILE_SECRET_KEY mangler på serveren", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    stubSiteverify(true);
    const res = mockRes();
    await handler(mockReq(VALID_BODY), res);

    expect(res.statusCode).toBe(500);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("afviser når Cloudflare ikke kan nås", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }) as unknown as typeof fetch,
    );
    const res = mockRes();
    await handler(mockReq(VALID_BODY), res);

    expect(res.statusCode).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("tjekker felterne før Turnstile", async () => {
    stubSiteverify(true);
    const res = mockRes();
    await handler(mockReq({ ...VALID_BODY, message: "" }), res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Manglende felter");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("lader stadig spamfilteret køre efter en godkendt Turnstile", async () => {
    stubSiteverify(true);
    const res = mockRes();
    await handler(
      mockReq({
        ...VALID_BODY,
        name: "uaLxiimtbpIcEdUmMurv",
        subject: "sYgiAsJSvyGrOmgVVyMhJkA",
        message: "ppFbodoVUmjcizfdttnvE",
      }),
      res,
    );

    // Spam får "ok" tilbage, men der sendes ingen mail – den ryger i papirkurven.
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(sendEmail).not.toHaveBeenCalled();
    expect(insertRow).toHaveBeenCalled();
  });
});
