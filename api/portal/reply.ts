import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Henriette Duckert Keramik <keramiker@henrietteduckert.dk>";

function replyHtml(bodyText: string): string {
  const safe = bodyText
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
  return `<!DOCTYPE html><html lang="da"><head><meta charset="UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600&display=swap" rel="stylesheet" />
  <style>@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600&display=swap');</style>
  </head><body style="margin:0;padding:0;background:#f9f9f9;font-family:'Bricolage Grotesque',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 16px;"><tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;"><tr>
  <td style="background:#ffffff;border-radius:40px;padding:48px;font-family:'Bricolage Grotesque',Helvetica,Arial,sans-serif;font-size:16px;color:#000000;line-height:1.7;">
  ${safe}
  <br /><br /><hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;" />
  <p style="margin:0 0 4px;font-size:18px;font-weight:600;color:#000000;">Henriette Duckert</p>
  <p style="margin:0;font-size:14px;color:#555555;">henrietteduckert.dk</p>
  </td></tr></table></td></tr></table></body></html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, subject, bodyText, threadId, inReplyToId, account } = req.body ?? {};
  if (!to || !subject || !bodyText) return res.status(400).json({ ok: false, error: "Manglende felter" });

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

  try {
    const html = replyHtml(bodyText as string);

    const { data, error: sendError } = await resend.emails.send({
      from: FROM,
      to: to as string,
      subject: subject as string,
      text: bodyText as string,
      html,
    });

    if (sendError) return res.status(500).json({ ok: false, error: sendError.message });

    if (supabaseUrl && supabaseKey) {
      const db = createClient(supabaseUrl, supabaseKey);
      await db.from("portal_emails").insert({
        resend_id: data?.id ?? null,
        account: account ?? "keramiker@henrietteduckert.dk",
        from_email: "keramiker@henrietteduckert.dk",
        from_name: "Henriette Duckert",
        subject: subject as string,
        body_text: bodyText as string,
        body_html: html,
        direction: "outbound",
        is_read: true,
        thread_id: threadId ?? null,
        in_reply_to: inReplyToId ?? null,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Fejl";
    return res.status(500).json({ ok: false, error: msg });
  }
}
