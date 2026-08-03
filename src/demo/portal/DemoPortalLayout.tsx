import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Inbox, LayoutDashboard, Package, RotateCcw, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import hdLogo from "@/assets/hd-logo.svg";
import DemoBadge, { useNoIndex } from "../DemoBadge";
import { useDemo } from "../store";

const NAVY_FILTER = "invert(6%) sepia(50%) saturate(6000%) hue-rotate(220deg) brightness(20%) contrast(95%)";

const navItems = [
  { path: "/demo/portal", label: "Overblik", icon: LayoutDashboard, end: true },
  { path: "/demo/portal/indbakke", label: "Indbakke", icon: Inbox, end: false },
  { path: "/demo/portal/ordrer", label: "Ordrer", icon: Package, end: false },
];

export default function DemoPortalLayout({ children }: { children: React.ReactNode }) {
  const { inquiries, orders, reset } = useDemo();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useNoIndex();

  const unread = inquiries.filter((i) => !i.laest && !i.papirkurv).length;

  // ⌘K / Ctrl+K åbner kommandopaletten.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setPaletteOpen(false);
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-muted/50">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-background md:flex">
        <Link to="/demo/portal" className="flex items-center gap-3 border-b border-border px-6 py-5">
          <img src={hdLogo} alt="" className="h-8" style={{ filter: NAVY_FILTER }} />
          <div>
            <p className="text-sm font-semibold leading-tight">Portal</p>
            <p className="text-xs text-muted-foreground">Henriette Duckert</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon size={17} />
              {label}
              {label === "Indbakke" && unread > 0 && (
                <span className="ml-auto rounded-full bg-destructive px-1.5 py-0.5 text-xs font-semibold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Search size={14} />
            Søg
            <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 font-sans text-[10px]">⌘K</kbd>
          </button>
          <button
            onClick={reset}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw size={14} />
            Nulstil demodata
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobilnavigation */}
        <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-border bg-background px-4 py-3 md:hidden">
          <img src={hdLogo} alt="" className="h-7" style={{ filter: NAVY_FILTER }} />
          <nav className="ml-2 flex flex-1 gap-1 overflow-x-auto">
            {navItems.map(({ path, label, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`
                }
              >
                {label}
                {label === "Indbakke" && unread > 0 && ` (${unread})`}
              </NavLink>
            ))}
          </nav>
          <button onClick={() => setPaletteOpen(true)} aria-label="Søg" className="p-2 text-muted-foreground">
            <Search size={18} />
          </button>
        </header>

        <main key={location.pathname} className="page-transition flex-1 p-4 md:p-8">{children}</main>
      </div>

      {/* Kommandopalette */}
      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="Søg efter side, henvendelse eller ordre…" />
        <CommandList>
          <CommandEmpty>Ingen resultater.</CommandEmpty>

          <CommandGroup heading="Gå til">
            {navItems.map(({ path, label, icon: Icon }) => (
              <CommandItem key={path} value={label} onSelect={() => go(path)}>
                <Icon size={15} className="mr-2" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Henvendelser">
            {inquiries
              .filter((i) => !i.papirkurv)
              .slice(0, 6)
              .map((i) => (
                <CommandItem
                  key={i.id}
                  value={`${i.navn} ${i.emne}`}
                  onSelect={() => go(`/demo/portal/indbakke?id=${i.id}`)}
                >
                  <Inbox size={15} className="mr-2 shrink-0" />
                  <span className="truncate">
                    {i.navn} — <span className="text-muted-foreground">{i.emne}</span>
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandGroup heading="Ordrer">
            {orders.slice(0, 6).map((o) => (
              <CommandItem
                key={o.id}
                value={`${o.kunde} ${o.beskrivelse}`}
                onSelect={() => go(`/demo/portal/ordrer?id=${o.id}`)}
              >
                <Package size={15} className="mr-2 shrink-0" />
                <span className="truncate">
                  {o.kunde} — <span className="text-muted-foreground">{o.beskrivelse}</span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <DemoBadge portal />
    </div>
  );
}
