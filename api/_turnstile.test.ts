import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { SITEVERIFY_URL, isConfigError, verifyTurnstile } from "./_turnstile";

const TOKEN = "0.abcdef-turnstile-token";

/** En fetch der svarer som Cloudflare og husker, hvad den blev kaldt med. */
function fakeFetch(payload: unknown, init: { status?: number } = {}) {
  return vi.fn(async (_url: string | URL | Request, options?: RequestInit) => {
    void options;
    return {
      ok: (init.status ?? 200) < 400,
      status: init.status ?? 200,
      json: async () => payload,
    } as Response;
  });
}

describe("verifyTurnstile", () => {
  beforeEach(() => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    delete process.env.TURNSTILE_SECRET_KEY;
    vi.restoreAllMocks();
  });

  it("godkender en gyldig token", async () => {
    const fetchImpl = fakeFetch({ success: true, "error-codes": [] });
    const result = await verifyTurnstile(TOKEN, "203.0.113.4", fetchImpl as unknown as typeof fetch);

    expect(result.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledOnce();

    const [url, options] = fetchImpl.mock.calls[0];
    expect(url).toBe(SITEVERIFY_URL);
    const sent = new URLSearchParams(options?.body as string);
    expect(sent.get("secret")).toBe("test-secret");
    expect(sent.get("response")).toBe(TOKEN);
    expect(sent.get("remoteip")).toBe("203.0.113.4");
  });

  it("afviser når Cloudflare siger nej", async () => {
    const fetchImpl = fakeFetch({ success: false, "error-codes": ["invalid-input-response"] });
    const result = await verifyTurnstile(TOKEN, undefined, fetchImpl as unknown as typeof fetch);

    expect(result).toEqual({ ok: false, errorCodes: ["invalid-input-response"] });
    expect(isConfigError(result.errorCodes)).toBe(false);
  });

  it("afviser en brugt token", async () => {
    const fetchImpl = fakeFetch({ success: false, "error-codes": ["timeout-or-duplicate"] });
    const result = await verifyTurnstile(TOKEN, undefined, fetchImpl as unknown as typeof fetch);

    expect(result.ok).toBe(false);
    expect(result.errorCodes).toContain("timeout-or-duplicate");
  });

  it("afviser uden at kalde Cloudflare, når token mangler", async () => {
    const fetchImpl = fakeFetch({ success: true });
    for (const missing of [undefined, null, "", "   ", 42]) {
      const result = await verifyTurnstile(missing, undefined, fetchImpl as unknown as typeof fetch);
      expect(result).toEqual({ ok: false, errorCodes: ["missing-input-response"] });
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("fejler lukket og markerer opsætningsfejl, når hemmeligheden mangler", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const fetchImpl = fakeFetch({ success: true });
    const result = await verifyTurnstile(TOKEN, undefined, fetchImpl as unknown as typeof fetch);

    expect(result.ok).toBe(false);
    expect(isConfigError(result.errorCodes)).toBe(true);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("fejler lukket når Cloudflare svarer med en fejlkode", async () => {
    const fetchImpl = fakeFetch({}, { status: 503 });
    const result = await verifyTurnstile(TOKEN, undefined, fetchImpl as unknown as typeof fetch);

    expect(result).toEqual({ ok: false, errorCodes: ["http-503"] });
  });

  it("fejler lukket når Cloudflare ikke kan nås", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network down");
    });
    const result = await verifyTurnstile(TOKEN, undefined, fetchImpl as unknown as typeof fetch);

    expect(result).toEqual({ ok: false, errorCodes: ["verification-unavailable"] });
  });

  it("udelader remoteip når IP'en er ukendt", async () => {
    const fetchImpl = fakeFetch({ success: true });
    await verifyTurnstile(TOKEN, "", fetchImpl as unknown as typeof fetch);

    const sent = new URLSearchParams(fetchImpl.mock.calls[0][1]?.body as string);
    expect(sent.has("remoteip")).toBe(false);
  });
});

describe("isConfigError", () => {
  it("skelner opsætningsfejl fra afviste besøgende", () => {
    expect(isConfigError(["invalid-input-secret"])).toBe(true);
    expect(isConfigError(["missing-secret"])).toBe(true);
    expect(isConfigError(["invalid-input-response"])).toBe(false);
    expect(isConfigError([])).toBe(false);
  });
});
