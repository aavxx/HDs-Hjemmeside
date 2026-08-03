import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarClock, LayoutGrid, List, Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ORDER_STATUSES } from "../data";
import type { Order, OrderStatus } from "../data";
import { useDemo } from "../store";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Afventer: "border-amber-600/30 bg-amber-50 text-amber-900",
  Behandler: "border-sky-600/30 bg-sky-50 text-sky-900",
  Fuldført: "border-emerald-600/30 bg-emerald-50 text-emerald-900",
  Annulleret: "border-border bg-muted text-muted-foreground",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" });
}

export default function DemoPortalOrders() {
  const { orders, setOrderStatus } = useDemo();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [visning, setVisning] = useState<"tavle" | "liste">("tavle");

  const valgtId = params.get("id");
  const valgt = orders.find((o) => o.id === valgtId) ?? null;

  const synlige = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => `${o.kunde} ${o.email} ${o.beskrivelse} ${o.noter ?? ""}`.toLowerCase().includes(q));
  }, [orders, query]);

  const vaelg = (id: string | null) => {
    if (id) params.set("id", id);
    else params.delete("id");
    setParams(params, { replace: true });
  };

  const skiftStatus = (order: Order, status: OrderStatus) => {
    setOrderStatus(order.id, status);
    toast.success(`${order.kunde}: ${status.toLowerCase()}`);
  };

  const total = synlige
    .filter((o) => o.status !== "Annulleret")
    .reduce((sum, o) => sum + o.beloeb, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Ordrer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {synlige.length} ordrer · {total.toLocaleString("da-DK")} kr. i alt
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søg i ordrer"
              aria-label="Søg i ordrer"
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-foreground sm:w-64"
            />
          </div>
          <div className="flex rounded-xl border border-border bg-background p-1">
            <button
              onClick={() => setVisning("tavle")}
              aria-label="Tavlevisning"
              aria-pressed={visning === "tavle"}
              className={`rounded-lg p-1.5 ${visning === "tavle" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setVisning("liste")}
              aria-label="Listevisning"
              aria-pressed={visning === "liste"}
              className={`rounded-lg p-1.5 ${visning === "liste" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </header>

      {visning === "tavle" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ORDER_STATUSES.map((status) => {
            const iKolonne = synlige.filter((o) => o.status === status);
            return (
              <section key={status} className="rounded-2xl border border-border bg-background p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <StatusBadge status={status} />
                  <span className="text-xs text-muted-foreground">{iKolonne.length}</span>
                </div>
                <ul className="space-y-2">
                  {iKolonne.length === 0 && (
                    <li className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                      Tom
                    </li>
                  )}
                  {iKolonne.map((o) => (
                    <li key={o.id}>
                      <button
                        onClick={() => vaelg(o.id)}
                        className="w-full rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted/60"
                      >
                        <p className="truncate text-sm font-medium">{o.kunde}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{o.beskrivelse}</p>
                        <p className="mt-2 text-sm font-medium">{o.beloeb.toLocaleString("da-DK")} kr.</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Kunde</th>
                <th className="px-4 py-3 font-medium">Beskrivelse</th>
                <th className="px-4 py-3 font-medium">Oprettet</th>
                <th className="px-4 py-3 font-medium">Beløb</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {synlige.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => vaelg(o.id)}
                  className="cursor-pointer transition-colors hover:bg-muted/60"
                >
                  <td className="px-4 py-3 font-medium">{o.kunde}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{o.beskrivelse}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(o.oprettet)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{o.beloeb.toLocaleString("da-DK")} kr.</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {synlige.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">Ingen ordrer matcher søgningen.</p>
          )}
        </div>
      )}

      {/* Detaljepanel */}
      <Sheet open={!!valgt} onOpenChange={(open) => !open && vaelg(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {valgt && (
            <div>
              <SheetHeader className="mb-6 text-left">
                <StatusBadge status={valgt.status} />
                <SheetTitle className="mt-2 text-2xl">{valgt.kunde}</SheetTitle>
                <SheetDescription className="leading-relaxed">{valgt.beskrivelse}</SheetDescription>
              </SheetHeader>

              <div className="mb-6 space-y-3 text-sm">
                <a href={`mailto:${valgt.email}`} className="flex items-center gap-3 hover:underline">
                  <Mail size={15} className="text-muted-foreground" />
                  {valgt.email}
                </a>
                {valgt.telefon && (
                  <a href={`tel:${valgt.telefon.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:underline">
                    <Phone size={15} className="text-muted-foreground" />
                    {valgt.telefon}
                  </a>
                )}
                <p className="flex items-center gap-3 text-muted-foreground">
                  <CalendarClock size={15} />
                  Oprettet {formatDate(valgt.oprettet)}
                  {valgt.frist && ` · frist ${formatDate(valgt.frist)}`}
                </p>
              </div>

              <dl className="mb-6 divide-y divide-border border-y border-border">
                <div className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-muted-foreground">Beløb</dt>
                  <dd className="font-medium">{valgt.beloeb.toLocaleString("da-DK")} kr.</dd>
                </div>
                {valgt.noter && (
                  <div className="py-3 text-sm">
                    <dt className="mb-1 text-muted-foreground">Noter</dt>
                    <dd className="leading-relaxed">{valgt.noter}</dd>
                  </div>
                )}
              </dl>

              <p className="mb-2 text-sm font-medium">Skift status</p>
              <div className="grid grid-cols-2 gap-2">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => skiftStatus(valgt, s)}
                    disabled={valgt.status === s}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      valgt.status === s
                        ? "border-foreground bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
