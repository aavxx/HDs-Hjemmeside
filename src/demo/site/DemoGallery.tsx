import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import PieceImage from "../PieceImage";
import { PIECE_CATEGORIES, pieces } from "../data";
import type { Piece, PieceCategory, PieceStatus } from "../data";

type SortKey = "nyeste" | "pris-op" | "pris-ned" | "navn";

const SORT_LABELS: Record<SortKey, string> = {
  nyeste: "Nyeste først",
  "pris-op": "Pris, lav til høj",
  "pris-ned": "Pris, høj til lav",
  navn: "Navn A–Å",
};

const STATUS_STYLES: Record<PieceStatus, string> = {
  "Til salg": "border-emerald-600/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  Solgt: "border-border bg-muted text-muted-foreground",
  "På bestilling": "border-amber-600/30 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
};

function StatusPill({ status }: { status: PieceStatus }) {
  return (
    <span className={`inline-block border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>{status}</span>
  );
}

export default function DemoGallery() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState<PieceCategory | "Alle">("Alle");
  const [kunLedige, setKunLedige] = useState(false);
  const [sort, setSort] = useState<SortKey>("nyeste");

  // Dybt link: /demo/galleri?stykke=<id> åbner stykket direkte.
  const aktivId = params.get("stykke");
  const aktiv = useMemo(() => pieces.find((p) => p.id === aktivId) ?? null, [aktivId]);

  const openPiece = (piece: Piece) => {
    params.set("stykke", piece.id);
    setParams(params, { replace: false });
  };

  const closePiece = () => {
    params.delete("stykke");
    setParams(params, { replace: true });
  };

  const synlige = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtreret = pieces.filter((p) => {
      if (kategori !== "Alle" && p.kategori !== kategori) return false;
      if (kunLedige && p.status === "Solgt") return false;
      if (!q) return true;
      return `${p.navn} ${p.kategori} ${p.glasur} ${p.beskrivelse}`.toLowerCase().includes(q);
    });

    const sorteret = [...filtreret];
    switch (sort) {
      case "pris-op":
        sorteret.sort((a, b) => a.pris - b.pris);
        break;
      case "pris-ned":
        sorteret.sort((a, b) => b.pris - a.pris);
        break;
      case "navn":
        sorteret.sort((a, b) => a.navn.localeCompare(b.navn, "da"));
        break;
      default:
        sorteret.sort((a, b) => b.aar - a.aar);
    }
    return sorteret;
  }, [query, kategori, kunLedige, sort]);

  return (
    <div className="container py-14 md:py-20">
      <header className="mb-10 space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Galleri</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Værkerne</h1>
        <div className="h-[2px] w-12 bg-foreground" />
        <p className="max-w-xl leading-relaxed text-muted-foreground">
          Alt hvad der står i værkstedet lige nu. Er et stykke solgt, kan et lignende næsten altid laves på
          bestilling — skriv endelig.
        </p>
      </header>

      {/* Filtre */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søg i navn, glasur eller beskrivelse"
              aria-label="Søg i galleriet"
              className="w-full border border-border bg-background py-2.5 pl-9 pr-9 text-sm outline-none transition focus:border-foreground"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Ryd søgning"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sortering"
              className="appearance-none border border-border bg-background py-2.5 pl-9 pr-8 text-sm outline-none transition focus:border-foreground"
            >
              {Object.entries(SORT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["Alle", ...PIECE_CATEGORIES] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKategori(k)}
              aria-pressed={kategori === k}
              className={`border px-3.5 py-1.5 text-sm transition-colors ${
                kategori === k
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
          <label className="ml-auto flex cursor-pointer select-none items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={kunLedige}
              onChange={(e) => setKunLedige(e.target.checked)}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            Skjul solgte
          </label>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
        {synlige.length} {synlige.length === 1 ? "stykke" : "stykker"}
      </p>

      {/* Gitteret */}
      {synlige.length === 0 ? (
        <div className="border border-dashed border-border py-20 text-center">
          <p className="mb-2 font-medium">Ingen stykker matcher</p>
          <p className="text-sm text-muted-foreground">Prøv en anden kategori, eller ryd søgningen.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {synlige.map((piece) => (
            <button
              key={piece.id}
              onClick={() => openPiece(piece)}
              className="group border border-border bg-card p-5 text-left hover-lift"
            >
              <PieceImage
                kategori={piece.kategori}
                hue={piece.hue}
                className={`mx-auto h-40 w-full transition-transform duration-500 group-hover:scale-105 ${
                  piece.status === "Solgt" ? "opacity-45 saturate-50" : ""
                }`}
              />
              <div className="mt-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold leading-tight">{piece.navn}</h2>
                  <p className="whitespace-nowrap text-sm font-medium">{piece.pris.toLocaleString("da-DK")} kr.</p>
                </div>
                <p className="text-sm text-muted-foreground">{piece.maal}</p>
                <StatusPill status={piece.status} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detaljepanel */}
      <Sheet open={!!aktiv} onOpenChange={(open) => !open && closePiece()}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {aktiv && <PieceDetails piece={aktiv} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PieceDetails({ piece }: { piece: Piece }) {
  // Nulstil scroll når man skifter stykke uden at lukke panelet.
  useEffect(() => {
    document.querySelector("[data-piece-top]")?.scrollIntoView({ block: "start" });
  }, [piece.id]);

  const detaljer: Array<[string, string]> = [
    ["Kategori", piece.kategori],
    ["Mål", piece.maal],
    ["Glasur", piece.glasur],
    ["Årgang", String(piece.aar)],
  ];

  return (
    <div data-piece-top>
      <div className="mb-6 flex items-center justify-center border border-border bg-muted/40 py-8">
        <PieceImage kategori={piece.kategori} hue={piece.hue} className="h-56 w-full" />
      </div>

      <SheetHeader className="mb-5 text-left">
        <div className="mb-2 flex items-center gap-3">
          <StatusPill status={piece.status} />
          <span className="text-sm font-medium">{piece.pris.toLocaleString("da-DK")} kr.</span>
        </div>
        <SheetTitle className="text-2xl">{piece.navn}</SheetTitle>
        <SheetDescription className="leading-relaxed">{piece.beskrivelse}</SheetDescription>
      </SheetHeader>

      <dl className="mb-7 divide-y divide-border border-y border-border">
        {detaljer.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-3 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <Link
        to={`/demo/kontakt?stykke=${encodeURIComponent(piece.navn)}`}
        className="group inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {piece.status === "Solgt" ? "Bestil et lignende stykke" : "Forespørg om dette stykke"}
        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Emnefeltet udfyldes automatisk med stykkets navn.
      </p>
    </div>
  );
}
