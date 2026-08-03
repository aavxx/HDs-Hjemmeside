// Spam-filter til kontaktformularen.
//
// Filen hedder "_spam.ts" med underscore, så Vercel ikke gør den til en
// serverless function – den er kun et hjælpemodul for api/send.ts.
//
// Filteret er bevidst uden eksterne tjenester (ingen captcha, ingen konto):
// en honningkrukke, en tidsmåling og et pointsystem for indhold, der ligner
// bot-generet volapyk.

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Skjult felt i formularen. Kun bots udfylder det. */
  honeypot?: string;
  /** Millisekunder fra formularen blev vist til den blev sendt. */
  elapsedMs?: number;
}

export interface SpamVerdict {
  spam: boolean;
  score: number;
  reasons: string[];
}

/** Hurtigste realistiske udfyldning af fire felter. Alt under er en bot. */
export const MIN_FILL_MS = 2500;

/** Samlet point før en henvendelse regnes som spam. */
export const SPAM_THRESHOLD = 4;

const VOWELS = new Set(["a", "e", "i", "o", "u", "y", "æ", "ø", "å"]);

const SPAM_KEYWORDS = [
  "seo",
  "backlink",
  "casino",
  "viagra",
  "cialis",
  "porn",
  "crypto",
  "bitcoin",
  "forex",
  "binary option",
  "loan offer",
  "make money",
  "work from home",
  "increase your traffic",
  "rank your website",
  "web design services",
  "guest post",
  "click here to",
  "unsubscribe here",
  "kindly reply",
];

const URL_PATTERN = /(https?:\/\/|www\.)\S+|\b[a-z0-9-]+\.(com|net|ru|cn|xyz|top|info|biz|online|shop|club|site)\b/gi;
const TAG_PATTERN = /<\s*(a|script|img|iframe|b|u)\b|\[url[=\]]|\[\/url\]|\[link\b/i;

function countMatches(text: string, pattern: RegExp): number {
  return (text.match(pattern) ?? []).length;
}

/**
 * Point for hvor tilfældigt et enkelt ord ser ud.
 *
 * Tæller kun signaler, som rigtige navne og danske sammensatte ord ikke
 * rammer: store bogstaver midt i ordet ("uaLxiimtbpIcEdUmMurv"), lange
 * konsonantstrenge og skæve vokalforhold.
 */
export function tokenRandomness(token: string): number {
  const letters = token.replace(/[^\p{L}]/gu, "");
  if (letters.length < 8) return 0;

  let points = 0;

  // Skift fra lille til stort bogstav inde i ordet. "McDonald" og "DiCaprio"
  // har ét – tilfældige strenge har mange.
  let internalCaps = 0;
  for (let i = 1; i < letters.length; i++) {
    const prev = letters[i - 1];
    const cur = letters[i];
    if (prev === prev.toLowerCase() && cur !== cur.toLowerCase()) internalCaps++;
  }
  if (internalCaps >= 3) points += 2;
  else if (internalCaps === 2 && letters.length < 12) points += 1;

  const lower = letters.toLowerCase();
  let vowels = 0;
  let run = 0;
  let maxRun = 0;
  for (const ch of lower) {
    if (VOWELS.has(ch)) {
      vowels++;
      run = 0;
    } else {
      run++;
      if (run > maxRun) maxRun = run;
    }
  }
  const vowelRatio = vowels / lower.length;
  if (vowelRatio < 0.22 || vowelRatio > 0.7) points += 1;
  if (maxRun >= 5) points += 1;

  return points;
}

/** Ser feltet ud som bot-genereret volapyk? */
export function looksRandom(text: string): boolean {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .some((token) => tokenRandomness(token) >= 2);
}

/**
 * Gmail ignorerer punktummer i adressen, så spammere bruger dem til at lave
 * "nye" adresser ud af den samme konto: jo.h.n.de.capu.a2.3@gmail.com
 */
function isDottedGmail(email: string): boolean {
  const [local, domain] = email.toLowerCase().split("@");
  if (!domain || !/^(gmail|googlemail)\.com$/.test(domain)) return false;
  return countMatches(local, /\./g) >= 4;
}

export function classifySubmission(submission: ContactSubmission): SpamVerdict {
  const name = (submission.name ?? "").trim();
  const email = (submission.email ?? "").trim();
  const subject = (submission.subject ?? "").trim();
  const message = (submission.message ?? "").trim();
  const reasons: string[] = [];

  // Honningkrukke: feltet er skjult for mennesker, så alt indhold er en bot.
  if ((submission.honeypot ?? "").trim() !== "") {
    return { spam: true, score: 99, reasons: ["honeypot"] };
  }

  // Udfyldt hurtigere end noget menneske kan nå.
  if (typeof submission.elapsedMs === "number" && submission.elapsedMs >= 0 && submission.elapsedMs < MIN_FILL_MS) {
    return { spam: true, score: 99, reasons: ["too-fast"] };
  }

  let score = 0;
  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(reason);
  };

  // Ingen tidsmåling betyder som regel et direkte POST udenom formularen.
  // Det alene er ikke nok til at blokere – en gammel cachet frontend ville
  // også mangle feltet – men det tæller med.
  if (typeof submission.elapsedMs !== "number" || Number.isNaN(submission.elapsedMs)) {
    add(2, "no-timing");
  }

  if (looksRandom(name)) add(3, "random-name");
  if (looksRandom(subject)) add(3, "random-subject");
  if (looksRandom(message)) add(3, "random-message");

  // En rigtig besked er en sætning og har mellemrum.
  if (message.length >= 12 && !/\s/.test(message)) add(2, "message-single-token");

  const linksInMessage = countMatches(message, URL_PATTERN);
  if (linksInMessage >= 2) add(3, "many-links");
  else if (linksInMessage === 1) add(1, "link");

  if (countMatches(`${name} ${subject}`, URL_PATTERN) > 0) add(3, "link-in-name-or-subject");

  if (TAG_PATTERN.test(`${subject} ${message}`)) add(2, "markup");

  const haystack = `${name} ${subject} ${message}`.toLowerCase();
  const keywordHits = SPAM_KEYWORDS.filter((word) =>
    new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(haystack),
  ).length;
  if (keywordHits > 0) add(Math.min(3 + 2 * (keywordHits - 1), 6), `keyword x${keywordHits}`);

  if (isDottedGmail(email)) add(2, "dotted-gmail");

  return { spam: score >= SPAM_THRESHOLD, score, reasons };
}

// --- Simpel hastighedsbegrænsning pr. IP -----------------------------------
// Serverless-instanser genbruges typisk mellem kald, så en Map i hukommelsen
// fanger det meste af den samme bots gentagne forsøg. Den er "best effort" –
// pointsystemet ovenfor er den egentlige beskyttelse.

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function rateLimit(ip: string, now: number = Date.now()): boolean {
  if (!ip) return true;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

/** Kun til test. */
export function resetRateLimit(): void {
  hits.clear();
}

export function clientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (raw ?? "").split(",")[0].trim();
}
