import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const KNOWN_ACCOUNTS = [
  "keramiker@henrietteduckert.dk",
  "henriette@henrietteduckert.dk",
  "data@henrietteduckert.dk",
];

function extractEmail(raw: string): string {
  // Handles "Name <email@domain>" or plain "email@domain"
  const m = raw.match(/<([^>]+)>/);
  return (m ? m[1] : raw).trim().toLowerCase();
}

function resolveAccount(toField: string | string[]): string {
  const recipients = Array.isArray(toField) ? toField : [toField];
  for (const r of recipients) {
    const addr = extractEmail(r);
    if (KNOWN_ACCOUNTS.includes(addr)) return addr;
  }
  return "keramiker@henrietteduckert.dk";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const body = req.body ?? {};

  // Resend inbound format: body fields directly or nested under data
  const payload = body.data ?? body;

  const from: string = payload.from ?? "";
  const to: string | string[] = payload.to ?? "";
  const subject: string = payload.subject ?? "(Intet emne)";
  const bodyHtml: string | null = payload.html ?? null;
  const bodyText: string | null = payload.text ?? null;
  const messageId: string | null =
    payload.headers?.["message-id"] ?? payload.messageId ?? null;
  const inReplyTo: string | null =
    payload.headers?.["in-reply-to"] ?? payload.inReplyTo ?? null;

  const fromEmail = extractEmail(from);
  const fromName = from.replace(/<[^>]+>/, "").trim().replace(/^["']|["']$/g, "") || fromEmail;
  const account = resolveAccount(to);

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    "";

  if (!supabaseUrl || !supabaseKey) {
    console.error("[inbound] missing Supabase env vars");
    return res.status(500).json({ ok: false });
  }

  const db = createClient(supabaseUrl, supabaseKey);

  // Deduplicate by resend_id / message-id
  if (messageId) {
    const { data: existing } = await db
      .from("portal_emails")
      .select("id")
      .eq("resend_id", messageId)
      .maybeSingle();
    if (existing) {
      console.log("[inbound] duplicate, skipping:", messageId);
      return res.status(200).json({ ok: true, duplicate: true });
    }
  }

  // Find thread: match by in-reply-to or by from+account combo
  let threadId: string | null = null;
  if (inReplyTo) {
    const { data: parent } = await db
      .from("portal_emails")
      .select("thread_id, id")
      .eq("resend_id", inReplyTo)
      .maybeSingle();
    if (parent) threadId = parent.thread_id ?? parent.id;
  }
  if (!threadId) {
    // Check if there's an existing thread with this sender on this account
    const { data: prior } = await db
      .from("portal_emails")
      .select("thread_id, id")
      .eq("account", account)
      .eq("from_email", fromEmail)
      .is("deleted_at", null)
      .order("received_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (prior) threadId = prior.thread_id ?? prior.id;
  }

  const { data: row, error } = await db
    .from("portal_emails")
    .insert({
      resend_id: messageId,
      account,
      from_email: fromEmail,
      from_name: fromName,
      subject,
      body_html: bodyHtml,
      body_text: bodyText,
      direction: "inbound",
      is_read: false,
      in_reply_to: inReplyTo,
      thread_id: threadId,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[inbound] insert error:", error.message);
    return res.status(500).json({ ok: false });
  }

  // If no thread yet, set thread_id = own id (new thread)
  if (!threadId && row?.id) {
    await db.from("portal_emails").update({ thread_id: row.id }).eq("id", row.id);
  }

  console.log("[inbound] saved email for", account, "id:", row?.id);
  return res.status(200).json({ ok: true });
}
