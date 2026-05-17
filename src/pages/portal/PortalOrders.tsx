import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import PortalLayout from "@/components/portal/PortalLayout";

type StatusKey = "Afventer" | "Behandler" | "Fuldført" | "Annulleret";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  description: string;
  status: StatusKey;
  notes: string | null;
  created_at: string;
  updated_at: string;
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

const emptyForm = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  description: "",
  notes: "",
  status: "Afventer" as StatusKey,
};

const PortalOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("portal_orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const handleStatusChange = async (id: string, status: StatusKey) => {
    await supabase
      .from("portal_orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på, at du vil slette denne ordre?")) return;
    await supabase.from("portal_orders").delete().eq("id", id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.description.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from("portal_orders")
      .insert({
        customer_name: form.customer_name.trim(),
        customer_email: form.customer_email.trim() || null,
        customer_phone: form.customer_phone.trim() || null,
        description: form.description.trim(),
        notes: form.notes.trim() || null,
        status: form.status,
      })
      .select()
      .single();

    if (!error && data) {
      setOrders((prev) => [data as Order, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
    }
    setSubmitting(false);
  };

  // Sort: active first, then completed/cancelled
  const activeOrders = orders.filter(
    (o) => o.status === "Afventer" || o.status === "Behandler"
  );
  const inactiveOrders = orders.filter(
    (o) => o.status === "Fuldført" || o.status === "Annulleret"
  );
  const sortedOrders = [...activeOrders, ...inactiveOrders];

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm">{order.customer_name}</h3>
          {(order.customer_email || order.customer_phone) && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {[order.customer_email, order.customer_phone]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              color: STATUS_COLORS[order.status],
              backgroundColor: STATUS_BG[order.status],
            }}
          >
            {order.status}
          </span>
          <button
            onClick={() => handleDelete(order.id)}
            className="text-muted-foreground hover:text-red-600 transition-colors"
            title="Slet ordre"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {order.description}
      </p>
      {order.notes && (
        <p className="text-xs text-muted-foreground border-t border-border pt-2 mb-3">
          {order.notes}
        </p>
      )}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {format(new Date(order.created_at), "d. MMM yyyy", { locale: da })}
        </p>
        <select
          value={order.status}
          onChange={(e) =>
            handleStatusChange(order.id, e.target.value as StatusKey)
          }
          className="text-xs border border-input rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <PortalLayout>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "#07113C", fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
        >
          Ordrer
        </h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: "#07113C",
            fontFamily: "'Bricolage Grotesque', Georgia, serif",
          }}
        >
          <Plus size={16} className="mr-1" />
          Ny ordre
        </Button>
      </div>

      {/* New order form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2
            className="text-base font-semibold mb-4"
            style={{ color: "#07113C" }}
          >
            Opret ny ordre
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Kundenavn *
                </label>
                <Input
                  required
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customer_name: e.target.value }))
                  }
                  style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customer_email: e.target.value }))
                  }
                  style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Telefon
                </label>
                <Input
                  value={form.customer_phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customer_phone: e.target.value }))
                  }
                  style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as StatusKey,
                    }))
                  }
                  className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Beskrivelse *
              </label>
              <textarea
                ref={descRef}
                required
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                onInput={() => autoResize(descRef.current)}
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none overflow-hidden"
                style={{
                  fontFamily: "'Bricolage Grotesque', Georgia, serif",
                  minHeight: "80px",
                }}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Notater
              </label>
              <textarea
                ref={notesRef}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                onInput={() => autoResize(notesRef.current)}
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none overflow-hidden"
                style={{
                  fontFamily: "'Bricolage Grotesque', Georgia, serif",
                  minHeight: "60px",
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: "#07113C",
                  fontFamily: "'Bricolage Grotesque', Georgia, serif",
                }}
              >
                {submitting ? "Opretter..." : "Opret ordre"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setForm(emptyForm);
                }}
                style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
              >
                Annuller
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Indlæser...</p>
      ) : sortedOrders.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ingen ordrer endnu.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </PortalLayout>
  );
};

export default PortalOrders;
