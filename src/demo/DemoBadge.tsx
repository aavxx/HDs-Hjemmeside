// Fast markering, så demoen aldrig forveksles med det rigtige site.
// Indeholder også et link tilbage til den nuværende side.

import { useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Holder demoen ude af søgemaskinerne. Kører som effekt, fordi appen er en
 * SPA uden server-side rendering af <head>.
 */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
}

export default function DemoBadge({ portal = false }: { portal?: boolean }) {
  // I portalen sidder sidebarens knapper nederst til venstre, så mærket
  // flyttes til højre side for ikke at dække dem.
  const placering = portal ? "bottom-4 right-4" : "bottom-4 left-4";
  return (
    <div
      className={`fixed ${placering} z-[70] flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-50/95 px-3 py-1.5 text-xs font-medium text-amber-900 shadow-sm backdrop-blur dark:border-amber-400/30 dark:bg-amber-950/90 dark:text-amber-200`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
      </span>
      <span>Demo{portal ? " · opdigtede data" : ""}</span>
      <Link to={portal ? "/demo" : "/"} className="underline underline-offset-2 hover:no-underline">
        {portal ? "Til demosite" : "Til det rigtige site"}
      </Link>
    </div>
  );
}
