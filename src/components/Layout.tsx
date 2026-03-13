import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import hdLogo from "@/assets/hd-logo.svg";

const navItems = [
  { path: "/", label: "Hjem" },
  { path: "/om-mig", label: "Om Mig" },
  { path: "/bestilling", label: "Bestilling" },
  { path: "/kontakt", label: "Kontakt" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-card/90 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="container flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={hdLogo}
              alt="HD Logo"
              className="h-8 md:h-10 transition-transform duration-300 group-hover:scale-105"
              style={{ filter: "invert(6%) sepia(50%) saturate(6000%) hue-rotate(220deg) brightness(20%) contrast(95%)" }}
            />
            <span className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
              Henriette Duckert
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`text-sm tracking-wide transition-colors link-underline ${
                    location.pathname === item.path
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${
                  menuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                }`}
              />
              <X
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${
                  menuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                }`}
              />
            </div>
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="container flex flex-col gap-1 py-4 bg-card/95 backdrop-blur-xl border-t border-border">
            {navItems.map((item, i) => (
              <li
                key={item.path}
                style={{
                  animation: menuOpen ? `staggerIn 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.05}s forwards` : "none",
                  opacity: menuOpen ? undefined : 0,
                }}
              >
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-3 text-base tracking-wide transition-colors ${
                    location.pathname === item.path
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="flex-1">
        <div key={location.pathname} className="page-transition">
          {children}
        </div>
      </main>

      <footer className="border-t border-border py-10 mt-16">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Henriette Duckert Keramik
          </p>
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
