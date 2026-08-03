// Cloudflare Turnstile-verifikation til kontaktformularen.
//
// Filen hedder "_turnstile.ts" med underscore, så Vercel ikke gør den til en
// serverless function – den er kun et hjælpemodul for api/send.ts.
//
// Frontenden viser Turnstile-widgetten og sender en engangs-token med i
// formularen. Her byttes den token til et ja/nej hos Cloudflare, før der
// sendes mails. En token kan kun bruges én gang.

export const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Hvor længe vi venter på Cloudflare, før vi giver op. */
export const VERIFY_TIMEOUT_MS = 8000;

export interface TurnstileResult {
  ok: boolean;
  /** Fejlkoder fra Cloudflare, eller vores egne ved manglende token/opsætning. */
  errorCodes: string[];
}

/**
 * Fejlkoder der betyder "serveren er sat forkert op" – ikke "besøgende er en
 * bot". De skal give en 500'er, så fejlen bliver opdaget i stedet for at ligne
 * en afvist bruger.
 */
export const CONFIG_ERROR_CODES = ["missing-secret", "invalid-input-secret", "missing-input-secret"];

export function isConfigError(errorCodes: string[]): boolean {
  return errorCodes.some((code) => CONFIG_ERROR_CODES.includes(code));
}

/** Hemmeligheden ligger kun i miljøvariabler – aldrig i repoet. */
function secretKey(): string {
  return (process.env.TURNSTILE_SECRET_KEY ?? "").trim();
}

/**
 * Spørger Cloudflare, om token'en er gyldig.
 *
 * Fejler lukket: mangler token, mangler hemmelighed, eller kan Cloudflare ikke
 * nås, er svaret nej. Så er formularen hellere midlertidigt utilgængelig end
 * åben for bots.
 */
export async function verifyTurnstile(
  token: unknown,
  remoteIp?: string,
  fetchImpl: typeof fetch = fetch,
): Promise<TurnstileResult> {
  if (typeof token !== "string" || token.trim() === "") {
    return { ok: false, errorCodes: ["missing-input-response"] };
  }

  const secret = secretKey();
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY mangler i miljøet");
    return { ok: false, errorCodes: ["missing-secret"] };
  }

  const body = new URLSearchParams({ secret, response: token.trim() });
  if (remoteIp) body.set("remoteip", remoteIp);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

  try {
    const res = await fetchImpl(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error("[turnstile] siteverify svarede", res.status);
      return { ok: false, errorCodes: [`http-${res.status}`] };
    }

    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    const errorCodes = Array.isArray(data["error-codes"]) ? data["error-codes"] : [];
    return { ok: data.success === true, errorCodes };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[turnstile] siteverify fejlede:", msg);
    return { ok: false, errorCodes: ["verification-unavailable"] };
  } finally {
    clearTimeout(timer);
  }
}
