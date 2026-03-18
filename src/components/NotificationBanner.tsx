import { useState, useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  message: string;
  expires_at: string | null;
}

interface NotificationBannerProps {
  onHeightChange?: (height: number) => void;
}

const NotificationBanner = ({ onHeightChange }: NotificationBannerProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("dismissed-notifications");
    if (stored) setDismissed(new Set(JSON.parse(stored)));

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("site_notifications")
        .select("id, message, expires_at")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (data) setNotifications(data as Notification[]);
    };

    fetchNotifications();
  }, []);

  const now = new Date();
  const visible = notifications.filter(
    (n) =>
      !dismissed.has(n.id) &&
      (!n.expires_at || new Date(n.expires_at) > now)
  );

  useEffect(() => {
    onHeightChange?.(visible.length > 0 ? (ref.current?.offsetHeight ?? 0) : 0);
  }, [visible.length, onHeightChange]);

  const dismiss = (id: string) => {
    const next = new Set(dismissed).add(id);
    setDismissed(next);
    localStorage.setItem("dismissed-notifications", JSON.stringify([...next]));
  };

  if (visible.length === 0) return null;

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 right-0 w-full z-[9999]"
      style={{ backgroundColor: "#ffffb3" }}
    >
      {visible.map((n) => (
        <div
          key={n.id}
          className="container flex items-center gap-3 py-2.5 text-sm"
        >
          <AlertTriangle size={16} className="shrink-0 text-foreground/70" />
          <p className="flex-1 text-foreground/80 font-medium">{n.message}</p>
          <button
            onClick={() => dismiss(n.id)}
            className="shrink-0 p-1 text-foreground/50 hover:text-foreground transition-colors"
            aria-label="Luk notifikation"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;
