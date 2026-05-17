import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    "";

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = req.body ?? {};

    // Resend inbound email payload fields
    const fromRaw: string = body.from ?? "";
    const subject: string = body.subject ?? "(ingen emne)";
    const bodyHtml: string = body.html ?? "";
    const bodyText: string = body.text ?? "";
    const headers: Record<string, string> = body.headers ?? {};
    const resendId: string = body.email_id ?? body.id ?? "";

    // Parse from name/email
    const fromMatch = fromRaw.match(/^(.*?)\s*<(.+?)>$/);
    const fromName = fromMatch ? fromMatch[1].trim() : "";
    const fromEmail = fromMatch ? fromMatch[2].trim() : fromRaw.trim();

    // Extract in-reply-to from headers
    const inReplyTo: string =
      headers["in-reply-to"] ?? headers["In-Reply-To"] ?? "";

    const { error } = await supabase.from("portal_emails").insert({
      resend_id: resendId,
      from_email: fromEmail,
      from_name: fromName,
      subject,
      body_html: bodyHtml,
      body_text: bodyText,
      is_read: false,
      in_reply_to: inReplyTo,
      direction: "inbound",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Ukendt fejl";
    console.error("Inbound webhook error:", msg);
    return res.status(500).json({ ok: false, error: msg });
  }
}
