import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { Trash2, CornerUpLeft, Send, ChevronDown, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";

const ACCOUNTS = [
  "keramiker@henrietteduckert.dk",
  "henriette@henrietteduckert.dk",
  "data@henrietteduckert.dk",
];

type TabType = "indbakke" | "sendt" | "papirkurv";

interface PortalEmail {
  id: string;
  thread_id: string | null;
  account: string | null;
  direction: string | null;
  from_name: string | null;
  from_email: string | null;
  to_email: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  is_read: boolean;
  received_at: string | null;
  deleted_at: string | null;
}

interface Thread {
  thread_id: string;
  subject: string;
  latestDate: string | null;
  senderName: string;
  senderEmail: string;
  preview: string;
  hasUnread: boolean;
  emails: PortalEmail[];
}

function groupIntoThreads(emails: PortalEmail[]): Thread[] {
  const threadMap = new Map<string, PortalEmail[]>();

  for (const email of emails) {
    const key = email.thread_id || email.id;
    if (!threadMap.has(key)) threadMap.set(key, []);
    threadMap.get(key)!.push(email);
  }

  const threads: Thread[] = [];
  for (const [thread_id, msgs] of threadMap.entries()) {
    msgs.sort((a, b) => {
      const ta = a.received_at ? new Date(a.received_at).getTime() : 0;
      const tb = b.received_at ? new Date(b.received_at).getTime() : 0;
      return ta - tb;
    });

    const inbound = msgs.filter((m) => m.direction === "inbound");
    const first = inbound[0] || msgs[0];
    const last = msgs[msgs.length - 1];

    const rawSubject = first.subject || "(Intet emne)";
    const subject = rawSubject.replace(/^(re:\s*)+/i, "").trim();
    const hasUnread = msgs.some((m) => !m.is_read && m.direction === "inbound");

    threads.push({
      thread_id,
      subject,
      latestDate: last.received_at,
      senderName: first.from_name || first.from_email || "Ukendt",
      senderEmail: first.from_email || "",
      preview: last.body_text?.slice(0, 120) || "",
      hasUnread,
      emails: msgs,
    });
  }

  threads.sort((a, b) => {
    const ta = a.latestDate ? new Date(a.latestDate).getTime() : 0;
    const tb = b.latestDate ? new Date(b.latestDate).getTime() : 0;
    return tb - ta;
  });

  return threads;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
      style={{ backgroundColor: "#07113C" }}
    >
      {initials}
    </div>
  );
}

function EmailMessage({
  email,
  onTrash,
  defaultExpanded,
}: {
  email: PortalEmail;
  onTrash: (id: string) => Promise<void>;
  defaultExpanded: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [trashing, setTrashing] = useState(false);

  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [defaultExpanded]);

  useEffect(() => {
    if (!expanded || !iframeRef.current || !email.body_html) return;
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(email.body_html);
    doc.close();
    // Set height after write since onLoad doesn't fire for doc.write()
    requestAnimationFrame(() => {
      const h = iframe.contentDocument?.body?.scrollHeight;
      if (h) iframe.style.height = h + 24 + "px";
    });
  }, [expanded, email.body_html]);

  const isOutbound = email.direction === "outbound";
  const senderName = isOutbound
    ? "Dig (Henriette Duckert Keramik)"
    : email.from_name || email.from_email || "Ukendt";
  const senderEmail = isOutbound ? email.account || "" : email.from_email || "";
  const dateStr = email.received_at
    ? format(new Date(email.received_at), "d. MMMM yyyy 'kl.' HH:mm", { locale: da })
    : "";

  const handleTrash = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setTrashing(true);
    await onTrash(email.id);
    setTrashing(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
      >
        <Avatar name={senderName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">{senderName}</span>
            {senderEmail && (
              <span className="text-xs text-gray-400">&lt;{senderEmail}&gt;</span>
            )}
          </div>
          {!expanded && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {email.body_text?.slice(0, 80) || ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400 whitespace-nowrap">{dateStr}</span>
          <button
            onClick={handleTrash}
            disabled={trashing}
            title="Slet"
            className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          {email.body_html ? (
            <iframe
              ref={iframeRef}
              className="w-full border-0"
              style={{ minHeight: 80 }}
              sandbox="allow-same-origin"
              title="email-body"
            />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
              {email.body_text || ""}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function ReplyForm({ thread, onSent }: { thread: Thread; onSent: () => void }) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const lastInbound = [...thread.emails]
    .reverse()
    .find((e) => e.direction === "inbound");

  const handleSend = async () => {
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    const token = sessionStorage.getItem("portal_token");
    try {
      const res = await fetch("/api/portal/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: lastInbound?.from_email,
          subject: "Re: " + thread.subject,
          bodyText: body,
          threadId: thread.thread_id,
          inReplyToId: lastInbound?.id,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Der opstod en fejl ved afsendelse.");
        return;
      }
      setBody("");
      onSent();
    } catch {
      setError("Der opstod en fejl ved afsendelse. Prøv igen.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
        <CornerUpLeft size={14} className="text-gray-400" />
        <span className="text-sm text-gray-500">
          Svar til <span className="font-medium text-gray-700">{lastInbound?.from_email || thread.senderEmail}</span>
        </span>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            resizeTextarea();
          }}
          onInput={resizeTextarea}
          rows={4}
          placeholder="Skriv dit svar…"
          className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] transition overflow-hidden"
          style={{ minHeight: 100 }}
        />
        {error && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleSend}
            disabled={sending || !body.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#07113C" }}
          >
            <Send size={14} />
            {sending ? "Sender…" : "Send svar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortalInbox() {
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNTS[0]);
  const [tab, setTab] = useState<TabType>("indbakke");
  const [emails, setEmails] = useState<PortalEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("portal_emails" as never)
      .select("*")
      .eq("account", selectedAccount);

    if (tab === "indbakke") {
      query = query.eq("direction", "inbound").is("deleted_at", null);
    } else if (tab === "sendt") {
      query = query.eq("direction", "outbound").is("deleted_at", null);
    } else {
      query = query.not("deleted_at", "is", null);
    }

    query = query.order("received_at", { ascending: false });

    const { data, error: err } = await query;

    if (err) {
      console.error("[inbox] fetch error:", err.message, err.code, err.details);
      setError(`Fejl: ${err.message}`);
    } else {
      setEmails((data as PortalEmail[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmails();
    setSelectedThreadId(null);
  }, [selectedAccount, tab]);

  const threads = groupIntoThreads(emails);
  const selectedThread = threads.find((t) => t.thread_id === selectedThreadId) || null;

  const handleSelectThread = async (thread: Thread) => {
    setSelectedThreadId(thread.thread_id);
    const unreadIds = thread.emails.filter((e) => !e.is_read).map((e) => e.id);
    if (unreadIds.length > 0) {
      await supabase
        .from("portal_emails" as never)
        .update({ is_read: true } as never)
        .in("id", unreadIds);
      setEmails((prev) =>
        prev.map((e) => (unreadIds.includes(e.id) ? { ...e, is_read: true } : e))
      );
    }
  };

  const handleTrash = async (emailId: string) => {
    const token = sessionStorage.getItem("portal_token");
    try {
      await fetch("/api/portal/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: emailId }),
      });
      await fetchEmails();
    } catch {
      // silently fail
    }
  };

  const tabBtnClass = (t: TabType) =>
    `px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
      tab === t ? "text-white" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
    }`;

  return (
    <PortalLayout>
      <div className="flex h-screen">
        {/* Thread list */}
        <div className="w-[340px] shrink-0 flex flex-col border-r border-gray-200 bg-white">
          {/* Toolbar */}
          <div className="px-4 pt-5 pb-3 border-b border-gray-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="relative flex-1">
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="appearance-none w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-7 text-xs font-medium outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] cursor-pointer truncate"
                  style={{ color: "#07113C" }}
                >
                  {ACCOUNTS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={fetchEmails}
                title="Opdater"
                className="ml-2 p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              {(["indbakke", "sendt", "papirkurv"] as TabType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={tabBtnClass(t)}
                  style={tab === t ? { backgroundColor: "#07113C" } : {}}
                >
                  {t === "indbakke" ? "Indbakke" : t === "sendt" ? "Sendt" : "Papirkurv"}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-0">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="px-4 py-4 border-b border-gray-50">
                    <div className="h-3.5 w-2/3 bg-gray-100 rounded animate-pulse mb-2" />
                    <div className="h-3 w-full bg-gray-100 rounded animate-pulse mb-1" />
                    <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-red-600 bg-red-50 m-4 rounded-lg">{error}</div>
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                <span>Ingen mails</span>
              </div>
            ) : (
              threads.map((thread) => {
                const isSelected = selectedThreadId === thread.thread_id;
                return (
                  <button
                    key={thread.thread_id}
                    onClick={() => handleSelectThread(thread)}
                    className={`w-full text-left px-4 py-3.5 border-b border-gray-100 transition-colors flex flex-col gap-0.5 ${
                      isSelected
                        ? "bg-[#07113C]/5 border-l-2 border-l-[#07113C]"
                        : "hover:bg-gray-50 border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm truncate ${
                          thread.hasUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"
                        }`}
                      >
                        {thread.senderName}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {thread.latestDate
                          ? format(new Date(thread.latestDate), "d. MMM", { locale: da })
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {thread.hasUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                      <p className={`text-sm truncate ${thread.hasUnread ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                        {thread.subject}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{thread.preview}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Reading pane */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F5F5F5]">
          {!selectedThread ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
              <span className="text-4xl">✉️</span>
              <span className="text-sm">Vælg en mail for at læse</span>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Subject header */}
              <div className="px-8 py-5 bg-white border-b border-gray-200 shrink-0">
                <h2
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", color: "#07113C" }}
                >
                  {selectedThread.subject}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedThread.emails.length}{" "}
                  {selectedThread.emails.length === 1 ? "besked" : "beskeder"}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 flex flex-col gap-3 px-8 py-6">
                {selectedThread.emails.map((email, idx) => (
                  <EmailMessage
                    key={email.id}
                    email={email}
                    onTrash={handleTrash}
                    defaultExpanded={idx === selectedThread.emails.length - 1}
                  />
                ))}

                {tab === "indbakke" && (
                  <ReplyForm
                    thread={selectedThread}
                    onSent={fetchEmails}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
