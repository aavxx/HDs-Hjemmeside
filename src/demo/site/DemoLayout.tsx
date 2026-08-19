import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import hdLogo from "@/assets/hd-logo.svg";
import DemoBadge, { useNoIndex } from "../DemoBadge";

const navItems = [
  { path: "/demo", label: "Hjem", end: true },
  { path: "/demo/galleri", label: "Galleri", end: false },
  { path: "/demo/om-mig", label: "Om mig", end: false },
  { path: "/demo/kontakt", label: "Kontakt", end: false },
];

const NAVY_FILTER = "invert(6%) sepia(50%) saturate(6000%) hue-rotate(220deg) brightness(20%) contrast(95%)";
const LIGHT_FILTER = "invert(96%) sepia(6%) saturate(200%) hue-rotate(190deg) brightness(105%)";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("demo-theme") === "dark");
  useNoIndex();

  useEffect(() => {
    localStorage.setItem("demo-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className={dark ? "dark" : undefined}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <nav className="container flex h-16 items-center justify-between md:h-20">
            <Link to="/demo" className="group flex items-center gap-3">
              <img
                src={hdLogo}
                alt=""
                className="h-8 transition-transform duration-300 group-hover:scale-105 md:h-9"
                style={{ filter: dark ? LIGHT_FILTER : NAVY_FILTER }}
              />
              <span className="text-base font-semibold tracking-tight md:text-lg">Henriette Duckert</span>
            </Link>

            <div className="flex items-center gap-2 md:gap-6">
              <ul className="hidden items-center gap-7 md:flex">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        `link-underline text-sm tracking-wide transition-colors ${
                          isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setDark((v) => !v)}
                aria-label={dark ? "Skift til lyst tema" : "Skift til mørkt tema"}
                className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                className="p-2 md:hidden"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </nav>

          {menuOpen && (
            <ul className="container flex flex-col gap-1 border-t border-border py-3 md:hidden">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `block py-3 text-base ${isActive ? "font-medium text-foreground" : "text-muted-foreground"}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </header>

        <main className="flex-1">
          <div key={location.pathname} className="page-transition">
            {children}
          </div>
        </main>

        <footer className="mt-20 border-t border-border py-10">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Henriette Duckert Keramik · Fuglslev Bygade 5, 8400 Ebeltoft
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <a href="tel:+4520456637" className="link-underline hover:text-foreground">
                +45 20 45 66 37
              </a>
              <Link to="/privatlivspolitik" className="link-underline hover:text-foreground">
                Privatlivspolitik
              </Link>
            </div>
          </div>
        </footer>

        <DemoBadge />
      </div>
    </div>
  );
}
