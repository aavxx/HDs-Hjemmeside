import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, randomBytes, createHmac } from "crypto";

const PASSWORD_HASH =
  process.env.PORTAL_PASSWORD_HASH ??
  "f7d04c875e910837e27f7fdc7574050de7c24d92ac99e1f9d6b1883c4b8cd291";
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
