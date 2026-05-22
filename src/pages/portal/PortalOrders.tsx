import { useEffect, useState } from "react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";

type OrderStatus = "Afventer" | "Behandler" | "Fuldført" | "Annulleret";

interface PortalOrder {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  description: string;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
}

const STATUS_OPTIONS: OrderStatus[] = ["Afventer", "Behandler", "Fuldført", "Annulleret"];
const ALL_FILTER = "Alle";

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  Afventer: { bg: "#FEF3C7", text: "#92400E" },
  Behandler: { bg: "#DBEAFE", text: "#1E40AF" },
  Fuldført: { bg: "#D1FAE5", text: "#065F46" },
  Annulleret: { bg: "#F3F4F6", text: "#6B7280" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const colors = STATUS_COLORS[status] || { bg: "#F3F4F6", text: "#6B7280" };
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {status}
    </span>
  );
}

function OrderCard({
  order,
  onStatusChange,
  onDelete,
}: {
  order: PortalOrder;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdating(true);
    await onStatusChange(order.id, e.target.value as OrderStatus);
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Er du sikker på, at du vil slette ordren fra ${order.customer_name}?`)) {
      return;
    }
    setDeleting(true);
    await onDelete(order.id);
    setDeleting(false);
  };

  const colors = STATUS_COLORS[order.status] || STATUS_COLORS["Annulleret"];

  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
    >
      <div
        className="h-1"
        style={{ backgroundColor: colors.text }}
      />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">{order.customer_name}</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
              {order.customer_email && (
                <span className="text-xs text-gray-500">{order.customer_email}</span>
              )}
              {order.customer_phone && (
                <span className="text-xs text-gray-500">{order.customer_phone}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={order.status} />
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Slet ordre"
              className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Beskrivelse</p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{order.description}</p>
        </div>

        {order.notes && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Noter</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-xs text-gray-400">
            {format(new Date(order.created_at), "d. MMM yyyy 'kl.' HH:mm", { locale: da })}
          </span>
          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updating}
            className="text-xs rounded-lg border border-gray-200 px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] cursor-pointer transition disabled:opacity-50"
            style={{ color: "#07113C" }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function PortalOrders() {
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>(ALL_FILTER);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    description: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("portal_orders" as never)
      .select("id, customer_name, customer_email, customer_phone, description, notes, status, created_at")
      .order("created_at", { ascending: false });

    if (err) {
      setError("Der opstod en fejl ved indlæsning af ordrer.");
    } else {
      setOrders((data as PortalOrder[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name.trim() || !formData.description.trim()) return;

    setSubmitting(true);

    const { error: insertError } = await supabase
      .from("portal_orders" as never)
      .insert({
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim() || null,
        customer_phone: formData.customer_phone.trim() || null,
        description: formData.description.trim(),
        notes: formData.notes.trim() || null,
        status: "Afventer",
      } as never);

    if (insertError) {
      toast.error("Der opstod en fejl. Ordren blev ikke oprettet.");
    } else {
      toast.success("Ordre oprettet!");
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        description: "",
        notes: "",
      });
      await fetchOrders();
    }

    setSubmitting(false);
  };

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const { error: updateError } = await supabase
      .from("portal_orders" as never)
      .update({ status } as never)
      .eq("id", id);

    if (updateError) {
      toast.error("Status kunne ikke opdateres.");
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from("portal_orders" as never)
      .delete()
      .eq("id", id);

    if (deleteError) {
      toast.error("Ordren kunne ikke slettes.");
    } else {
      toast.success("Ordre slettet.");
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const filteredOrders =
    filterStatus === ALL_FILTER
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const filterOptions = [ALL_FILTER, ...STATUS_OPTIONS];

  const filterBtnClass = (f: string) =>
    `px-3.5 py-1.5 text-sm rounded-full font-medium transition-colors ${
      filterStatus === f
        ? "text-white"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
    }`;

  return (
    <PortalLayout>
      <div className="p-8 w-full max-w-7xl">
        <h1
          className="text-2xl font-semibold mb-8"
          style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", color: "#07113C" }}
        >
          Ordrer
        </h1>

        <div
          className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 mb-10"
        >
          <h2
            className="text-base font-semibold mb-5"
            style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", color: "#07113C" }}
          >
            Opret ny ordre
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Kundenavn <span className="text-red-500">*</span>
                </label>
                <input
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInput}
                  required
                  placeholder="Navn"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Kundeemail</label>
                <input
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleInput}
                  placeholder="email@eksempel.dk"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">Telefon</label>
                <input
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInput}
                  placeholder="+45 00 00 00 00"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                Beskrivelse <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInput}
                required
                rows={3}
                placeholder="Beskriv ordren…"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] transition resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">Noter</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInput}
                rows={2}
                placeholder="Interne noter…"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#07113C]/20 focus:border-[#07113C] transition resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#07113C" }}
              >
                {submitting ? "Opretter…" : "Opret ordre"}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", color: "#07113C" }}
            >
              Alle ordrer
              {!loading && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({filteredOrders.length})
                </span>
              )}
            </h2>
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              {filterOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={filterBtnClass(f)}
                  style={filterStatus === f ? { backgroundColor: "#07113C" } : {}}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-400 text-sm">
              Ingen ordrer her
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
