import { useEffect, useState } from "react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";

interface StatCardProps {
  label: string;
  value: number | null;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-2 shadow-sm border border-gray-100"
      style={{ backgroundColor: "white" }}
    >
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      {value === null ? (
        <div className="h-9 w-16 bg-gray-100 rounded animate-pulse" />
      ) : (
        <span
          className="text-4xl font-semibold"
          style={{ color, fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

interface PortalEmail {
  id: string;
  from_name: string | null;
  from_email: string | null;
  subject: string | null;
  body_text: string | null;
  received_at: string | null;
}

export default function PortalDashboard() {
  const [unreadMails, setUnreadMails] = useState<number | null>(null);
  const [afventerOrders, setAfventerOrders] = useState<number | null>(null);
  const [behandlerOrders, setBehandlerOrders] = useState<number | null>(null);
  const [fuldfoertOrders, setFuldfoertOrders] = useState<number | null>(null);
  const [recentEmails, setRecentEmails] = useState<PortalEmail[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unreadRes, afventerRes, behandlerRes, fuldfoertRes, emailsRes] =
          await Promise.all([
            supabase
              .from("portal_emails" as never)
              .select("*", { count: "exact", head: true })
              .eq("is_read", false)
              .eq("direction", "inbound")
              .is("deleted_at", null),
            supabase
              .from("portal_orders" as never)
              .select("*", { count: "exact", head: true })
              .eq("status", "Afventer"),
            supabase
              .from("portal_orders" as never)
              .select("*", { count: "exact", head: true })
              .eq("status", "Behandler"),
            supabase
              .from("portal_orders" as never)
              .select("*", { count: "exact", head: true })
              .eq("status", "Fuldført"),
            supabase
              .from("portal_emails" as never)
              .select("id, from_name, from_email, subject, body_text, received_at")
              .eq("is_read", false)
              .eq("direction", "inbound")
              .is("deleted_at", null)
              .order("received_at", { ascending: false })
              .limit(5),
          ]);

        setUnreadMails(unreadRes.count ?? 0);
        setAfventerOrders(afventerRes.count ?? 0);
        setBehandlerOrders(behandlerRes.count ?? 0);
        setFuldfoertOrders(fuldfoertRes.count ?? 0);
        setRecentEmails((emailsRes.data as PortalEmail[]) ?? []);
      } catch {
        setError("Der opstod en fejl ved indlæsning af data.");
      } finally {
        setLoadingEmails(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PortalLayout>
      <div className="p-8 max-w-5xl">
        <h1
          className="text-2xl font-semibold mb-8"
          style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", color: "#07113C" }}
        >
          Oversigt
        </h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Ulæste mails" value={unreadMails} color="#07113C" />
          <StatCard label="Afventer" value={afventerOrders} color="#B45309" />
          <StatCard label="Behandler" value={behandlerOrders} color="#1D4ED8" />
          <StatCard label="Fuldførte" value={fuldfoertOrders} color="#15803D" />
        </div>

        <div>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", color: "#07113C" }}
          >
            Seneste ulæste mails
          </h2>

          {loadingEmails ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : recentEmails.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center text-gray-400 text-sm">
              Ingen ulæste mails
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentEmails.map((email) => (
                <div
                  key={email.id}
                  className="rounded-xl border border-gray-100 bg-white px-5 py-4 flex items-start gap-4 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {email.from_name || email.from_email || "Ukendt"}
                      </span>
                      {email.from_name && (
                        <span className="text-xs text-gray-400 truncate">
                          {email.from_email}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium truncate">
                      {email.subject || "(Intet emne)"}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {email.body_text?.slice(0, 120) || ""}
                    </p>
                  </div>
                  {email.received_at && (
                    <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                      {format(new Date(email.received_at), "d. MMM HH:mm", { locale: da })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
