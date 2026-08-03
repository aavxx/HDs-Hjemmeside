import { describe, expect, it, beforeEach } from "vitest";
import { classifySubmission, clientIp, rateLimit, resetRateLimit, looksRandom } from "./_spam";

const HUMAN_TIMING = 30_000;

function submission(overrides: Partial<Parameters<typeof classifySubmission>[0]> = {}) {
  return classifySubmission({
    name: "Anne Nielsen",
    email: "anne@example.dk",
    subject: "Spørgsmål til bestilling",
    message: "Hej Henriette, jeg vil gerne høre om du laver specialbestillinger til bryllup. Mvh Anne",
    elapsedMs: HUMAN_TIMING,
    ...overrides,
  });
}

describe("classifySubmission", () => {
  it("lader en almindelig dansk henvendelse igennem", () => {
    expect(submission().spam).toBe(false);
  });

  it("lader en kort henvendelse uden tidsmåling igennem", () => {
    const verdict = submission({ elapsedMs: undefined, message: "Hvornår har du åbent?" });
    expect(verdict.spam).toBe(false);
  });

  it("blokerer den spam Henriette får hver dag", () => {
    const verdict = classifySubmission({
      name: "uaLxiimtbpIcEdUmMurv",
      email: "jo.h.n.de.capu.a2.3@gmail.com",
      subject: "sYgiAsJSvyGrOmgVVyMhJkA",
      message: "ppFbodoVUmjcizfdttnvE",
    });
    expect(verdict.spam).toBe(true);
    expect(verdict.reasons).toContain("random-name");
  });

  it("blokerer når honningkrukken er udfyldt", () => {
    const verdict = submission({ honeypot: "https://spam.example" });
    expect(verdict).toMatchObject({ spam: true, reasons: ["honeypot"] });
  });

  it("blokerer når formularen sendes hurtigere end et menneske kan skrive", () => {
    const verdict = submission({ elapsedMs: 400 });
    expect(verdict).toMatchObject({ spam: true, reasons: ["too-fast"] });
  });

  it("blokerer beskeder fulde af links", () => {
    const verdict = submission({
      message: "Check http://cheap-seo.xyz and www.backlinks.top for the best offer",
    });
    expect(verdict.spam).toBe(true);
  });

  it("blokerer SEO-henvendelser på engelsk", () => {
    const verdict = submission({
      subject: "Web design services",
      message: "We can rank your website on page one of Google. Kindly reply for our price list.",
    });
    expect(verdict.spam).toBe(true);
  });

  it("accepterer et enkelt link fra en rigtig kunde", () => {
    const verdict = submission({
      message: "Hej, jeg så din udstilling. Her er billedet jeg nævnte: https://instagram.com/p/abc – kan du lave noget lignende?",
    });
    expect(verdict.spam).toBe(false);
  });

  it("accepterer lange danske sammensatte ord", () => {
    const verdict = submission({
      subject: "Bestillingsforespørgsel",
      message: "Jeg er interesseret i en specialfremstillet keramikvase til stuen. Hvad koster det?",
      elapsedMs: undefined,
    });
    expect(verdict.spam).toBe(false);
  });

  it("accepterer navne med stort bogstav inde i ordet", () => {
    expect(looksRandom("McDonald")).toBe(false);
    expect(looksRandom("DiCaprio")).toBe(false);
    expect(looksRandom("Henriette Duckert")).toBe(false);
  });

  it("genkender volapyk", () => {
    expect(looksRandom("uaLxiimtbpIcEdUmMurv")).toBe(true);
    expect(looksRandom("ppFbodoVUmjcizfdttnvE")).toBe(true);
  });
});

describe("rateLimit", () => {
  beforeEach(() => resetRateLimit());

  it("tillader de første fem henvendelser og blokerer den sjette", () => {
    for (let i = 0; i < 5; i++) expect(rateLimit("1.2.3.4")).toBe(true);
    expect(rateLimit("1.2.3.4")).toBe(false);
  });

  it("holder styr på IP-adresser hver for sig", () => {
    for (let i = 0; i < 5; i++) rateLimit("1.2.3.4");
    expect(rateLimit("5.6.7.8")).toBe(true);
  });

  it("åbner igen efter en time", () => {
    const start = Date.now();
    for (let i = 0; i < 5; i++) rateLimit("1.2.3.4", start);
    expect(rateLimit("1.2.3.4", start + 60 * 60 * 1000 + 1)).toBe(true);
  });
});

describe("clientIp", () => {
  it("tager den første adresse i x-forwarded-for", () => {
    expect(clientIp({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" })).toBe("9.9.9.9");
  });

  it("klarer en manglende header", () => {
    expect(clientIp({})).toBe("");
  });
});
