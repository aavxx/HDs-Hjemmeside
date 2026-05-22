import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, randomBytes, createHmac } from "crypto";

const PASSWORD_HASH =
  process.env.PORTAL_PASSWORD_HASH ??
  "bf6bffb8b647cfb2a5cf5be9d6bc9e0a76b5b7bc696e4ce243c1303052e70a18";
const JWT_SECRET =
  process.env.PORTAL_JWT_SECRET ?? randomBytes(32).toString("hex");

function sign(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { password } = req.body ?? {};
  if (!password) return res.status(400).json({ ok: false });

  const hash = createHash("sha256").update(password).digest("hex");
  if (hash !== PASSWORD_HASH) {
    await new Promise((r) => setTimeout(r, 400));
    return res.status(401).json({ ok: false });
  }

  const token = sign({ exp: Math.floor(Date.now() / 1000) + 86400 });
  return res.status(200).json({ ok: true, token });
}
