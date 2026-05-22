import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Inbox, ShoppingBag, LogOut } from "lucide-react";
import hdLogo from "@/assets/hd-logo.svg";
import { supabase } from "@/integrations/supabase/client";
import PortalLogin from "@/pages/portal/PortalLogin";

const NAVY = "#07113C";
const NAVY_FILTER =
  "invert(6%) sepia(50%) saturate(6000%) hue-rotate(220deg) brightness(20%) contrast(95%)";

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return true;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem("portal_token");
  const [authenticated, setAuthenticated] = useState(isTokenValid(token));
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    const { count } = await supabase
      .from("portal_emails" as never)
      .select("*", { count: "exact", head: true })
      .eq("is_read", false)
      .eq("direction", "inbound")
      .is("deleted_at", null);
    setUnreadCount(count ?? 0);
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchUnread();
    const interval = setInterval(fetchUnread, 30_000);
    return () => clearInterval(interval);
  }, [authenticated]);

  if (!authenticated) {
    return <PortalLogin onLogin={() => setAuthenticated(true)} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("portal_token");
    window.location.reload();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "text-white"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
    }`;

  const activeStyle = { backgroundColor: NAVY, color: "white" };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F9F9F9" }}>
      <aside
        className="w-64 flex flex-col shrink-0 border-r border-gray-200"
        style={{ backgroundColor: "white" }}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <img
            src={hdLogo}
            alt="HD Logo"
            className="h-9"
            style={{ filter: NAVY_FILTER }}
          />
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          <NavLink
            to="/portal"
            end
            className={navLinkClass}
            style={({ isActive }) => (isActive ? activeStyle : {})}
          >
            <LayoutDashboard size={18} />
            Oversigt
          </NavLink>

          <NavLink
            to="/portal/inbox"
            className={navLinkClass}
            style={({ isActive }) => (isActive ? activeStyle : {})}
          >
            <Inbox size={18} />
            <span className="flex-1">Indbakke</span>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center h-5 min-w-5 rounded-full bg-red-500 text-white text-xs font-semibold px-1.5">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/portal/orders"
            className={navLinkClass}
            style={({ isActive }) => (isActive ? activeStyle : {})}
          >
            <ShoppingBag size={18} />
            Ordrer
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200 flex flex-col gap-3">
          <p
            className="text-xs font-medium px-4"
            style={{ color: NAVY }}
          >
            Henriette Duckert Keramik
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut size={18} />
            Log ud
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
