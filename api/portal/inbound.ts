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

  console.log("[inbound] raw body:", JSON.stringify(req.body ?? {}));

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const raw = req.body ?? {};
    // Resend may wrap payload under a `data` key — handle both shapes
    const body: Record<string, unknown> =
      raw.data && typeof raw.data === "object"
        ? (raw.data as Record<string, unknown>)
        : raw;

    const fromRaw: string =
      (body.from as string) ?? (body.sender as string) ?? "";
    const subject: string =
      (body.subject as string) || "(ingen emne)";
    const bodyHtml: string = (body.html as string) ?? "";
    const bodyText: string =
      (body.text as string) ?? (body.plain_text as string) ?? "";
    const headers = (body.headers as Record<string, string>) ?? {};
    const resendId: string =
      (body.email_id as string) ?? (body.id as string) ?? "";

    const fromMatch = fromRaw.match(/^(.*?)\s*<(.+?)>$/);
    const fromName = fromMatch ? fromMatch[1].trim() : "";
    const fromEmail = fromMatch
      ? fromMatch[2].trim()
      : fromRaw.trim() || "unknown@unknown.com";

    const inReplyTo: string =
      headers["in-reply-to"] ?? headers["In-Reply-To"] ?? "";

    console.log("[inbound] parsed:", { fromEmail, fromName, subject, resendId });

    const { error } = await supabase.from("portal_emails").insert({
      resend_id: resendId || null,
      from_email: fromEmail,
      from_name: fromName || null,
      subject,
      body_html: bodyHtml || null,
      body_text: bodyText || null,
      is_read: false,
      in_reply_to: inReplyTo || null,
      direction: "inbound",
    });

    if (error) {
      console.error("[inbound] Supabase error:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Ukendt fejl";
    console.error("[inbound] error:", msg);
    return res.status(500).json({ ok: false, error: msg });
  }
}
