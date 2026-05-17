import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PortalLayout from "@/components/portal/PortalLayout";

interface Email {
  id: string;
  from_name: string;
  from_email: string;
  subject: string;
  body_html: string | null;
  body_text: string | null;
  received_at: string;
  is_read: boolean;
  direction: string;
}

const PortalInbox = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Email | null>(null);
  const [replying, setReplying] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    const { data, error } = await supabase
      .from("portal_emails")
      .select("*")
      .order("received_at", { ascending: false });
    if (error) console.error("[inbox] fetch failed:", error.message, error.code);
    setEmails((data as Email[]) ?? []);
    setLoading(false);
  };

  const selectEmail = async (email: Email) => {
    setSelected(email);
    setReplying(false);
    setReplyBody("");
    setReplySubject(`Re: ${email.subject}`);

    if (!email.is_read) {
      await supabase
        .from("portal_emails")
        .update({ is_read: true })
        .eq("id", email.id);
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, is_read: true } : e))
      );
    }
  };

  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const handleSendReply = async () => {
    if (!selected || !replyBody.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/portal/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selected.from_email,
          subject: replySubject,
          bodyText: replyBody,
          inReplyToId: selected.id,
        }),
      });
      if (res.ok) {
        setReplying(false);
        setReplyBody("");
        fetchEmails();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <PortalLayout>
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: "#07113C", fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
      >
        Indbakke
      </h1>

      <div className="flex gap-6">
        {/* Email list */}
        <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-border overflow-hidden">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground">Indlæser...</p>
          ) : emails.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Ingen beskeder endnu.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {emails.map((email) => (
                <li key={email.id}>
                  <button
                    onClick={() => selectEmail(email)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${
                      selected?.id === email.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        className={`text-sm truncate ${
                          !email.is_read ? "font-bold" : "font-medium"
                        }`}
                      >
                        {email.from_name || email.from_email}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {format(new Date(email.received_at), "d. MMM", {
                          locale: da,
                        })}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${
                        !email.is_read
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {email.direction === "outbound" && (
                        <span className="mr-1 text-blue-500">↑</span>
                      )}
                      {email.subject}
                    </p>
                    {!email.is_read && (
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Email detail */}
        {selected ? (
          <div className="flex-1 bg-white rounded-xl border border-border overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold mb-1">{selected.subject}</h2>
              <p className="text-sm text-muted-foreground">
                Fra:{" "}
                <span className="text-foreground">
                  {selected.from_name
                    ? `${selected.from_name} <${selected.from_email}>`
                    : selected.from_email}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {format(new Date(selected.received_at), "d. MMMM yyyy 'kl.' HH:mm", {
                  locale: da,
                })}
              </p>
            </div>

            {/* Email body */}
            <div className="flex-1 px-6 py-4 overflow-auto">
              {selected.body_html ? (
                <div
                  className="prose prose-sm max-w-none"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: selected.body_html }}
                />
              ) : (
                <pre
                  className="text-sm whitespace-pre-wrap"
                  style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
                >
                  {selected.body_text}
                </pre>
              )}
            </div>

            {/* Actions */}
            {selected.direction === "inbound" && !replying && (
              <div className="px-6 py-4 border-t border-border">
                <Button
                  onClick={() => setReplying(true)}
                  style={{
                    backgroundColor: "#07113C",
                    fontFamily: "'Bricolage Grotesque', Georgia, serif",
                  }}
                >
                  Svar
                </Button>
              </div>
            )}

            {/* Reply compose */}
            {replying && (
              <div className="px-6 py-4 border-t border-border space-y-3">
                <h3 className="text-sm font-semibold" style={{ color: "#07113C" }}>
                  Skriv svar
                </h3>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Til
                  </label>
                  <Input
                    value={selected.from_email}
                    readOnly
                    className="bg-muted"
                    style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Emne
                  </label>
                  <Input
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Besked
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    onInput={autoResizeTextarea}
                    placeholder="Skriv din besked her..."
                    className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none overflow-hidden"
                    style={{
                      fontFamily: "'Bricolage Grotesque', Georgia, serif",
                      minHeight: "120px",
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSendReply}
                    disabled={sending || !replyBody.trim()}
                    style={{
                      backgroundColor: "#07113C",
                      fontFamily: "'Bricolage Grotesque', Georgia, serif",
                    }}
                  >
                    {sending ? "Sender..." : "Send svar"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReplying(false);
                      setReplyBody("");
                    }}
                    style={{
                      fontFamily: "'Bricolage Grotesque', Georgia, serif",
                    }}
                  >
                    Annuller
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-xl border border-border flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Vælg en besked for at se den
            </p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default PortalInbox;
