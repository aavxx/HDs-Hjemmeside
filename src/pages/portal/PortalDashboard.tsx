import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import PortalLayout from "@/components/portal/PortalLayout";

type StatusKey = "Afventer" | "Behandler" | "Fuldført" | "Annulleret";

interface Order {
  id: string;
  customer_name: string;
  description: string;
  status: StatusKey;
  created_at: string;
}

interface Email {
  id: string;
  from_name: string;
  from_email: string;
  subject: string;
  received_at: string;
  is_read: boolean;
}

const STATUS_COLORS: Record<StatusKey, string> = {
  Afventer: "#B45309",
  Behandler: "#1D4ED8",
  Fuldført: "#15803D",
  Annulleret: "#6B7280",
};

const STATUS_BG: Record<StatusKey, string> = {
  Afventer: "#FEF3C7",
  Behandler: "#DBEAFE",
  Fuldført: "#DCFCE7",
  Annulleret: "#F3F4F6",
};

const STATUSES: StatusKey[] = ["Afventer", "Behandler", "Fuldført", "Annulleret"];

const PortalDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, emailsRes] = await Promise.all([
        supabase
          .from("portal_orders")
          .select("id, customer_name, description, status, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("portal_emails")
          .select("id, from_name, from_email, subject, received_at, is_read")
          .eq("direction", "inbound")
          .eq("is_read", false)
          .order("received_at", { ascending: false })
          .limit(5),
      ]);
      setOrders((ordersRes.data as Order[]) ?? []);
      setEmails((emailsRes.data as Email[]) ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const statusCounts = STATUSES.reduce(
    (acc, s) => {
      acc[s] = orders.filter((o) => o.status === s).length;
      return acc;
    },
    {} as Record<StatusKey, number>
  );

  const recentOrders = orders.slice(0, 5);

  return (
    <PortalLayout>
      <h1
        className="text-2xl font-bold mb-8"
        style={{ color: "#07113C", fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
      >
        Oversigt
      </h1>

      {loading ? (
        <p className="text-muted-foreground text-sm">Indlæser...</p>
      ) : (
        <div className="space-y-8">
          {/* Status cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATUSES.map((status) => (
              <div
                key={status}
                className="bg-white rounded-xl border border-border p-5"
              >
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {status}
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: STATUS_COLORS[status] }}
                >
                  {statusCounts[status]}
                </p>
              </div>
            ))}
          </div>

          {/* Unread emails */}
          <div>
            <h2
              className="text-base font-semibold mb-3"
              style={{ color: "#07113C" }}
            >
              Ulæste beskeder
            </h2>
            {emails.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ingen ulæste beskeder.
              </p>
            ) : (
              <div className="bg-white rounded-xl border border-border divide-y divide-border">
                {emails.map((email) => (
                  <div key={email.id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {email.from_name || email.from_email}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {email.subject}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {format(new Date(email.received_at), "d. MMM", {
                          locale: da,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent orders */}
          <div>
            <h2
              className="text-base font-semibold mb-3"
              style={{ color: "#07113C" }}
            >
              Seneste ordrer
            </h2>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ingen ordrer endnu.</p>
            ) : (
              <div className="bg-white rounded-xl border border-border divide-y divide-border">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="px-5 py-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {order.customer_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          color: STATUS_COLORS[order.status],
                          backgroundColor: STATUS_BG[order.status],
                        }}
                      >
                        {order.status}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "d. MMM", {
                          locale: da,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default PortalDashboard;
