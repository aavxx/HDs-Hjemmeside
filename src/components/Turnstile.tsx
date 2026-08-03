// Cloudflare Turnstile-widget til kontaktformularen.
//
// Widgetten giver en engangs-token, som sendes med formularen og verificeres
// server-side i api/send.ts. Uden en gyldig token afvises henvendelsen.

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

/** Site key'en er offentlig – den står i HTML'en hos alle besøgende. */
const TURNSTILE_SITE_KEY =
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ?? "0x4AAAAAAEFRsVvtWBDRJCBl";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

/** Henter Cloudflares script én gang, uanset hvor mange widgets der vises. */
function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Turnstile kunne ikke indlæses"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export interface TurnstileHandle {
  /** Nulstiller widgetten, så der kan hentes en ny token efter en indsendelse. */
  reset: () => void;
}

interface TurnstileProps {
  /** Kaldes med token'en, eller null når den udløber eller fejler. */
  onToken: (token: string | null) => void;
  className?: string;
}

const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(({ onToken, className }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  // Blokerer en udvidelse eller et netværk challenges.cloudflare.com, kommer
  // widgetten aldrig frem. Sig det, i stedet for at efterlade en død knap.
  const [loadFailed, setLoadFailed] = useState(false);
  // Holder den seneste callback, så widgetten ikke skal gengives ved hver render.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        if (widgetIdRef.current === null) return;
        window.turnstile?.reset(widgetIdRef.current);
        onTokenRef.current(null);
      },
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "timeout-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => {
        if (cancelled) return;
        setLoadFailed(true);
        onTokenRef.current(null);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  return (
    <div className={className}>
      <div ref={containerRef} />
      {loadFailed && (
        <p role="alert" className="text-sm text-muted-foreground">
          Sikkerhedstjekket kunne ikke indlæses. Slå eventuelle blokeringer fra og genindlæs siden, eller ring på{" "}
          <a href="tel:+4520456637" className="underline">
            +45 20 45 66 37
          </a>
          .
        </p>
      )}
    </div>
  );
});

Turnstile.displayName = "Turnstile";

export default Turnstile;
