import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Inbox, ShoppingBag } from "lucide-react";
import hdLogo from "@/assets/hd-logo.svg";
import PortalLogin from "@/pages/portal/PortalLogin";

const navItems = [
  { path: "/portal", label: "Oversigt", icon: LayoutDashboard, exact: true },
  { path: "/portal/inbox", label: "Indbakke", icon: Inbox, exact: false },
  { path: "/portal/orders", label: "Ordrer", icon: ShoppingBag, exact: false },
];

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
  const [isAuthed, setIsAuthed] = useState(
    () => sessionStorage.getItem("portal_auth") === "1"
  );
  const location = useLocation();

  if (!isAuthed) {
    return <PortalLogin onLogin={() => setIsAuthed(true)} />;
  }

  return (
    <div
      className="min-h-screen flex bg-[#F9F9F9]"
      style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col border-r border-border bg-white"
        style={{ minHeight: "100vh" }}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <img
            src={hdLogo}
            alt="HD Logo"
            className="h-7"
            style={{
              filter:
                "invert(6%) sepia(50%) saturate(6000%) hue-rotate(220deg) brightness(20%) contrast(95%)",
            }}
          />
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={() =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
                style={({ isActive: navActive }) =>
                  navActive
                    ? {
                        backgroundColor: "#07113C",
                        color: "white",
                      }
                    : {}
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="px-6 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Henriette Duckert Keramik
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
};

export default PortalLayout;
