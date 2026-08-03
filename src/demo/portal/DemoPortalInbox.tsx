import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Package, RotateCcw, Search, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "../store";
import type { Inquiry } from "../data";

type Filter = "alle" | "ulaeste" | "papirkurv";

const FILTER_LABELS: Record<Filter, string> = {
  alle: "Indbakke",
  ulaeste: "Ulæste",
  papirkurv: "Papirkurv",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const idag = new Date().toDateString() === date.toDateString();
  return idag
    ? date.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("da-DK", { day: "numeric", month: "short" });
}

export default function DemoPortalInbox() {
  const { inquiries, orders, markRead, setTrashed, convertToOrder } = useDemo();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("alle");
  const [query, setQuery] = useState("");
  const [svar, setSvar] = useState("");

  const valgtId = params.get("id");
  const valgt = inquiries.find((i) => i.id === valgtId) ?? null;

  const synlige = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries
      .filter((i) => {
        if (filter === "papirkurv") return i.papirkurv;
        if (i.papirkurv) return false;
        if (filter === "ulaeste") return !i.laest;
        return true;
      })
      .filter((i) => !q || `${i.navn} ${i.email} ${i.emne} ${i.besked}`.toLowerCase().includes(q))
      .sort((a, b) => +new Date(b.modtaget) - +new Date(a.modtaget));
  }, [inquiries, filter, query]);

  // Markér som læst når en henvendelse åbnes.
  useEffect(() => {
    if (valgt && !valgt.laest) markRead(valgt.id);
  }, [valgt, markRead]);

  useEffect(() => {
    setSvar("");
  }, [valgtId]);

  const vaelg = (id: string | null) => {
    if (id) params.set("id", id);
    else params.delete("id");
    setParams(params, { replace: true });
  };

  const handleConvert = (inquiry: Inquiry) => {
    const order = convertToOrder(inquiry.id);
    if (order) toast.success(`Ordre oprettet for ${order.kunde}`);
    else toast.info("Der findes allerede en ordre på denne henvendelse");
  };

  const antalUlaeste = inquiries.filter((i) => !i.laest && !i.papirkurv).length;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Indbakke</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {antalUlaeste === 0
            ? "Alle henvendelser er læst"
            : antalUlaeste === 1
              ? "1 ulæst henvendelse"
              : `${antalUlaeste} ulæste henvendelser`}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Liste */}
        <div className={`space-y-3 ${valgt ? "hidden lg:block" : ""}`}>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søg i henvendelser"
              aria-label="Søg i henvendelser"
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-foreground"
            />
          </div>

          <div className="flex gap-1 rounded-xl border border-border bg-background p-1">
            {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          <ul className="space-y-2">
            {synlige.length === 0 && (
              <li className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                Ingen henvendelser her.
              </li>
            )}
            {synlige.map((i) => (
              <li key={i.id}>
                <button
                  onClick={() => vaelg(i.id)}
                  className={`w-full rounded-xl border p-3.5 text-left transition-colors ${
                    valgtId === i.id
                      ? "border-foreground bg-background"
                      : "border-border bg-background hover:bg-muted/60"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    {!i.laest && <span className="h-2 w-2 shrink-0 rounded-full bg-destructive" />}
                    <span className={`truncate text-sm ${i.laest ? "font-medium" : "font-semibold"}`}>{i.navn}</span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">{formatDate(i.modtaget)}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{i.emne}</p>
                  {i.ordreId && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <Package size={11} />
                      Ordre oprettet
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Detalje */}
        <div className={valgt ? "" : "hidden lg:block"}>
          {!valgt ? (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground">Vælg en henvendelse for at læse den.</p>
            </div>
          ) : (
            <article className="rounded-2xl border border-border bg-background">
              <div className="flex items-start gap-3 border-b border-border p-5">
                <button
                  onClick={() => vaelg(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
                  aria-label="Tilbage til listen"
                >
                  <ArrowLeft size={17} />
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold leading-snug">{valgt.emne}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {valgt.navn} ·{" "}
                    <a href={`mailto:${valgt.email}`} className="underline underline-offset-2">
                      {valgt.email}
                    </a>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(valgt.modtaget).toLocaleString("da-DK", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="whitespace-pre-line p-5 leading-relaxed">{valgt.besked}</div>

              {/* Handlinger */}
              <div className="flex flex-wrap gap-2 border-t border-border p-5">
                {valgt.ordreId ? (
                  <Link
                    to={`/demo/portal/ordrer?id=${valgt.ordreId}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Check size={15} />
                    Se ordren
                    {orders.find((o) => o.id === valgt.ordreId)?.status && (
                      <span className="text-muted-foreground">
                        ({orders.find((o) => o.id === valgt.ordreId)?.status})
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleConvert(valgt)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Package size={15} />
                    Opret ordre
                  </button>
                )}

                <button
                  onClick={() => {
                    setTrashed(valgt.id, !valgt.papirkurv);
                    toast.success(valgt.papirkurv ? "Gendannet til indbakken" : "Flyttet til papirkurven");
                    if (!valgt.papirkurv) vaelg(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {valgt.papirkurv ? <RotateCcw size={15} /> : <Trash2 size={15} />}
                  {valgt.papirkurv ? "Gendan" : "Papirkurv"}
                </button>

                <button
                  onClick={() => markRead(valgt.id, false)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  Markér som ulæst
                </button>
              </div>

              {/* Svar */}
              <div className="border-t border-border p-5">
                <label htmlFor="svar" className="mb-2 block text-sm font-medium">
                  Svar til {valgt.navn.split(" ")[0]}
                </label>
                <textarea
                  id="svar"
                  value={svar}
                  onChange={(e) => setSvar(e.target.value)}
                  rows={4}
                  placeholder="Skriv dit svar…"
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-foreground"
                />
                <div className="mt-3 flex items-center gap-3">
                  <button
                    disabled={!svar.trim()}
                    onClick={() => {
                      toast.success("Svar sendt (demo — der sendes ingen mail)");
                      setSvar("");
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    <Send size={15} />
                    Send svar
                  </button>
                  <span className="text-xs text-muted-foreground">Demo: der afsendes ingen mail.</span>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
