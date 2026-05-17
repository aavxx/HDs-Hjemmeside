import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, createHmac, randomBytes } from "crypto";

const PASSWORD_HASH =
  process.env.PORTAL_PASSWORD_HASH ??
  "bf6bffb8b647cfb2a5cf5be9d6bc9e0a76b5b7bc696e4ce243c1303052e70a18";

const JWT_SECRET =
  process.env.PORTAL_JWT_SECRET ?? randomBytes(32).toString("hex");

function base64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function signToken(): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(
    JSON.stringify({ sub: "henriette", iat: now, exp: now + 86400 })
  );
  const sig = createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${sig}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { password } = req.body ?? {};
  if (typeof password !== "string") {
    return res.status(400).json({ ok: false, error: "Manglende adgangskode" });
  }

  const hash = createHash("sha256").update(password).digest("hex");

  if (hash !== PASSWORD_HASH) {
    await new Promise((r) => setTimeout(r, 400)); // slow brute-force
    return res.status(401).json({ ok: false, error: "Forkert adgangskode" });
  }

  const token = signToken();
  return res.status(200).json({ ok: true, token });
}
