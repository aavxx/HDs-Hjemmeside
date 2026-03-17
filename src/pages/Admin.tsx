import { useState, useEffect } from "react";
import { Trash2, Plus, Loader2, Mail, Clock, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface SiteNotification {
  id: string;
  message: string;
  active: boolean;
  created_at: string;
  expires_at: string | null;
}

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [notifications, setNotifications] = useState<SiteNotification[]>([]);
  const [newNotification, setNewNotification] = useState("");
  const [expiryHours, setExpiryHours] = useState("24");
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const ADMIN_PASSWORD = "henriette2024";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin-auth", "true");
    } else {
      toast.error("Forkert adgangskode");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin-auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchData();
  }, [authenticated]);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: subs }, { data: notifs }] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("site_notifications").select("*").order("created_at", { ascending: false }),
    ]);
    if (subs) setSubmissions(subs as ContactSubmission[]);
    if (notifs) setNotifications(notifs as SiteNotification[]);
    setLoading(false);
  };

  const addNotification = async () => {
    if (!newNotification.trim()) return;
    const hours = parseInt(expiryHours, 10);
    const expiresAt = !isNaN(hours) && hours > 0
      ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
      : null;

    const { error } = await supabase.from("site_notifications").insert({
      message: newNotification.trim(),
      expires_at: expiresAt,
    } as any);
    if (error) {
      toast.error("Kunne ikke oprette notifikation");
      return;
    }
    toast.success("Notifikation oprettet");
    setNewNotification("");
    setExpiryHours("24");
    fetchData();
  };

  const toggleNotification = async (id: string, active: boolean) => {
    await supabase.from("site_notifications").update({ active: !active }).eq("id", id);
    fetchData();
  };

  const deleteNotification = async (id: string) => {
    await supabase.from("site_notifications").delete().eq("id", id);
    fetchData();
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleString("da-DK", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const isExpired = (n: SiteNotification) =>
    n.expires_at ? new Date(n.expires_at) < new Date() : false;

  if (!authenticated) {
    return (
      <section className="container py-20 max-w-sm">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Adgangskode"
            className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium">
            Log ind
          </button>
        </form>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="container py-20 flex justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </section>
    );
  }

  return (
    <section className="container py-12 md:py-20 max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <button
          onClick={() => { sessionStorage.removeItem("admin-auth"); setAuthenticated(false); }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Log ud
        </button>
      </div>

      {/* Notifications section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">Notifikationer</h2>
        <div className="space-y-3 mb-4">
          <input
            value={newNotification}
            onChange={(e) => setNewNotification(e.target.value)}
            placeholder="Skriv en ny notifikation..."
            className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
          <div className="flex gap-3 items-center">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Udløber efter:</label>
            <select
              value={expiryHours}
              onChange={(e) => setExpiryHours(e.target.value)}
              className="bg-card border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
            >
              <option value="1">1 time</option>
              <option value="6">6 timer</option>
              <option value="12">12 timer</option>
              <option value="24">1 dag</option>
              <option value="48">2 dage</option>
              <option value="72">3 dage</option>
              <option value="168">1 uge</option>
              <option value="0">Aldrig</option>
            </select>
            <button
              onClick={addNotification}
              className="bg-primary text-primary-foreground px-5 py-2 text-sm font-medium inline-flex items-center gap-2"
            >
              <Plus size={14} /> Tilføj
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ingen notifikationer endnu.</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className={`flex items-center gap-3 border border-border bg-card p-3 ${isExpired(n) ? "opacity-50" : ""}`}>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{n.message}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>Oprettet: {formatDate(n.created_at)}</span>
                    {n.expires_at && (
                      <span className={isExpired(n) ? "text-destructive" : ""}>
                        {isExpired(n) ? "Udløbet" : `Udløber: ${formatDate(n.expires_at)}`}
                      </span>
                    )}
                    {!n.expires_at && <span>Udløber aldrig</span>}
                  </div>
                </div>
                <button
                  onClick={() => toggleNotification(n.id, n.active)}
                  className={`text-xs px-3 py-1 border ${n.active && !isExpired(n) ? "border-green-300 text-green-700 bg-green-50" : "border-border text-muted-foreground"}`}
                >
                  {isExpired(n) ? "Udløbet" : n.active ? "Aktiv" : "Inaktiv"}
                </button>
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact submissions */}
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Kontakt-henvendelser ({submissions.length})
      </h2>

      {submissions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ingen henvendelser endnu.</p>
      ) : (
        <div className="grid gap-3">
          {submissions.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSubmission(selectedSubmission?.id === s.id ? null : s)}
              className="border border-border bg-card p-4 cursor-pointer hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-foreground truncate">{s.name}</p>
                    <span className="text-xs text-muted-foreground">—</span>
                    <p className="text-sm text-foreground truncate">{s.subject}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Mail size={12} /> {s.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {formatDate(s.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedSubmission?.id === s.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{s.message}</p>
                  <a
                    href={`mailto:${s.email}?subject=Re: ${s.subject}`}
                    className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
                  >
                    <Send size={14} /> Svar via e-mail
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Admin;
