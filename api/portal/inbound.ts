import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const KNOWN_ACCOUNTS = [
  "keramiker@henrietteduckert.dk",
  "henriette@henrietteduckert.dk",
  "data@henrietteduckert.dk",
];

function extractEmail(raw: string): string {
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

  // Only handle email.received events
  if (body.type !== "email.received") {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const emailId: string | undefined = body.data?.email_id;
  if (!emailId) {
    console.error("[inbound] missing email_id in payload");
    return res.status(400).json({ ok: false, error: "missing email_id" });
  }

  // Fetch full email content via resend.emails.receiving.get()
  const { data: email, error: fetchError } = await resend.emails.receiving.get(emailId);
  if (fetchError || !email) {
    console.error("[inbound] fetch failed:", fetchError);
    return res.status(500).json({ ok: false, error: "fetch failed" });
  }

  const e = email as Record<string, unknown>;
  const from: string = e.from as string ?? "";
  const to: string | string[] = e.to as string | string[] ?? "";
  const subject: string = e.subject as string ?? "(Intet emne)";
  const bodyHtml: string | null = (e.html ?? e.body_html) as string ?? null;
  const bodyText: string | null = (e.text ?? e.body_text) as string ?? null;
  const headers = (e.headers ?? {}) as Record<string, string>;
  const messageId: string | null = headers["message-id"] ?? emailId;
  const inReplyTo: string | null = headers["in-reply-to"] ?? null;

  const fromEmail = extractEmail(from);
  const fromName = from.replace(/<[^>]+>/, "").trim().replace(/^["']|["']$/g, "") || fromEmail;
  const account = resolveAccount(to);

  console.log(`[inbound] email_id=${emailId} from=${fromEmail} account=${account}`);

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

  // Deduplicate by email_id
  const { data: existing } = await db
    .from("portal_emails")
    .select("id")
    .eq("resend_id", emailId)
    .maybeSingle();
  if (existing) {
    console.log("[inbound] duplicate, skipping:", emailId);
    return res.status(200).json({ ok: true, duplicate: true });
  }

  // Find thread via In-Reply-To, then fall back to sender+account match
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

  const { data: row, error: insertError } = await db
    .from("portal_emails")
    .insert({
      resend_id: emailId,
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

  if (insertError) {
    console.error("[inbound] insert error:", insertError.message);
    return res.status(500).json({ ok: false });
  }

  if (!threadId && row?.id) {
    await db.from("portal_emails").update({ thread_id: row.id }).eq("id", row.id);
  }

  console.log("[inbound] saved for", account, "id:", row?.id);
  return res.status(200).json({ ok: true });
}
