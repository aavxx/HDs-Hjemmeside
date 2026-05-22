import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { Trash2, Reply, Send, ChevronDown } from "lucide-react";
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
    const hasUnread = msgs.some((m) => !m.is_read);

    threads.push({
      thread_id,
      subject,
      latestDate: last.received_at,
      senderName: first.from_name || first.from_email || "Ukendt",
      senderEmail: first.from_email || "",
      preview: last.body_text?.slice(0, 100) || "",
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

function EmailBubble({
  email,
  onTrash,
}: {
  email: PortalEmail;
  onTrash: (id: string) => Promise<void>;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [trashing, setTrashing] = useState(false);

  const handleTrash = async () => {
    setTrashing(true);
    await onTrash(email.id);
    setTrashing(false);
  };

  useEffect(() => {
    if (iframeRef.current && email.body_html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(email.body_html);
        doc.close();
      }
    }
  }, [email.body_html]);

  const isOutbound = email.direction === "outbound";
  const sender = isOutbound ? "Dig" : email.from_name || email.from_email || "Ukendt";
  const dateStr = email.received_at
    ? format(new Date(email.received_at), "d. MMM yyyy 'kl.' HH:mm", { locale: da })
    : "";

  return (
    <div className={`flex flex-col gap-1 ${isOutbound ? "items-end" : "items-start"}`}>
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-semibold text-gray-700">{sender}</span>
        {!isOutbound && email.from_email && (
          <span className="text-xs text-gray-400">&lt;{email.from_email}&gt;</span>
        )}
        <span className="text-xs text-gray-400">{dateStr}</span>
        <button
          onClick={handleTrash}
          disabled={trashing}
          title="Slet"
          className="text-gray-300 hover:text-red-500 transition-colors ml-1 disabled:opacity-50"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div
        className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-sm border ${
          isOutbound
            ? "bg-[#07113C] text-white border-transparent"
            : "bg-white border-gray-100 text-gray-800"
        }`}
      >
        {email.body_html ? (
          <iframe
            ref={iframeRef}
            className="w-full border-0"
            style={{ minHeight: 80 }}
            sandbox="allow-same-origin"
            title="email-body"
            onLoad={() => {
              if (iframeRef.current) {
                const h = iframeRef.current.contentDocument?.body?.scrollHeight;
                if (h) iframeRef.current.style.height = h + 16 + "px";
              }
            }}
          />
        ) : (
          <pre className="whitespace-pre-wrap font-sans">{email.body_text || ""}</pre>
        )}
      </div>
    </div>
  );
}

function ReplyForm({
  thread,
  onSent,
}: {
  thread: Thread;
  onSent: () => void;
}) {
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
    <div className="border-t border-gray-100 pt-4 mt-4">
      <div className="flex items-start gap-2">
        <Reply size={16} className="text-gray-400 mt-3 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              resizeTextarea();
            }}
            onInput={resizeTextarea}
            rows={3}
            placeholder="Skriv dit svar…"
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] transition overflow-hidden"
            style={{ minHeight: 80 }}
          />
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={sending || !body.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#07113C" }}
            >
              <Send size={14} />
              {sending ? "Sender…" : "Send"}
            </button>
          </div>
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
      .select(
        "id, thread_id, account, direction, from_name, from_email, to_email, subject, body_text, body_html, is_read, received_at, deleted_at"
      )
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
      setError("Der opstod en fejl ved indlæsning af mails.");
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

    const unreadIds = thread.emails
      .filter((e) => !e.is_read)
      .map((e) => e.id);

    if (unreadIds.length > 0) {
      await supabase
        .from("portal_emails" as never)
        .update({ is_read: true } as never)
        .in("id", unreadIds);

      setEmails((prev) =>
        prev.map((e) =>
          unreadIds.includes(e.id) ? { ...e, is_read: true } : e
        )
      );
    }
  };

  const handleTrash = async (emailId: string) => {
    const token = sessionStorage.getItem("portal_token");
    try {
      await fetch("/api/portal/trash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: emailId }),
      });
      await fetchEmails();
    } catch {
      // silently fail
    }
  };

  const tabBtnClass = (t: TabType) =>
    `px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
      tab === t
        ? "text-white"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
    }`;

  return (
    <PortalLayout>
      <div className="flex h-screen flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white flex flex-col gap-3">
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", color: "#07113C" }}
          >
            Indbakke
          </h1>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-sm font-medium outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] cursor-pointer"
                style={{ color: "#07113C" }}
              >
                {ACCOUNTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
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
        </div>

        <div className="flex flex-1 min-h-0">
          <div
            className="w-80 shrink-0 border-r border-gray-100 flex flex-col overflow-y-auto"
            style={{ backgroundColor: "#F9F9F9" }}
          >
            {loading ? (
              <div className="flex flex-col gap-2 p-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-red-600 bg-red-50 m-4 rounded-lg">
                {error}
              </div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                Ingen mails her
              </div>
            ) : (
              threads.map((thread) => {
                const isSelected = selectedThreadId === thread.thread_id;
                return (
                  <button
                    key={thread.thread_id}
                    onClick={() => handleSelectThread(thread)}
                    className={`w-full text-left px-4 py-3.5 border-b border-gray-100 transition-colors flex flex-col gap-1 ${
                      isSelected ? "bg-white shadow-sm" : "hover:bg-white"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`text-sm truncate ${
                          thread.hasUnread ? "font-semibold text-gray-900" : "font-medium text-gray-700"
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
                    <p
                      className={`text-sm truncate ${
                        thread.hasUnread ? "font-medium text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {thread.subject}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{thread.preview}</p>
                    {thread.hasUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mt-0.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F9F9F9]">
            {!selectedThread ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Vælg en tråd for at læse
              </div>
            ) : (
              <div className="flex flex-col gap-6 p-6 max-w-3xl w-full mx-auto">
                <div>
                  <h2
                    className="text-lg font-semibold"
                    style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", color: "#07113C" }}
                  >
                    {selectedThread.subject}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedThread.emails.length}{" "}
                    {selectedThread.emails.length === 1 ? "besked" : "beskeder"}
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  {selectedThread.emails.map((email) => (
                    <EmailBubble
                      key={email.id}
                      email={email}
                      onTrash={handleTrash}
                    />
                  ))}
                </div>

                {tab === "indbakke" && (
                  <ReplyForm
                    thread={selectedThread}
                    onSent={() => {
                      fetchEmails();
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
