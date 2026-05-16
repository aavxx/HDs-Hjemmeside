import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO = "keramiker@henrietteduckert.dk";
const FROM = "Henriette Duckert Keramik <kontakt@henrietteduckert.dk>";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body ?? {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, error: "Manglende felter" });
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Kontaktformular – ${name} – ${subject}`,
      text: `Navn: ${name}\nEmail: ${email}\nEmne: ${subject}\n\nBesked:\n${message}`,
    });

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Tak for din besked",
      text: `Hej ${name},\n\nTak for din besked. Jeg vender tilbage hurtigst muligt.\n\nVenlig hilsen\nHenriette Duckert\nkeramiker@henrietteduckert.dk`,
    });

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ukendt fejl";
    return res.status(500).json({ ok: false, error: message });
  }
}
