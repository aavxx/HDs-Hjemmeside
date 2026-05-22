import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Henriette Duckert Keramik <keramiker@henrietteduckert.dk>";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, subject, bodyText, threadId, inReplyToId, account } = req.body ?? {};
  if (!to || !subject || !bodyText) return res.status(400).json({ ok: false, error: "Manglende felter" });

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const supabaseKey = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

  try {
    const { data, error: sendError } = await resend.emails.send({
      from: FROM,
      to: to as string,
      subject: subject as string,
      text: bodyText as string,
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
