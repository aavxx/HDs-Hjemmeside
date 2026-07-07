import { useState } from "react";
import { Loader2 } from "lucide-react";
import hdLogo from "@/assets/hd-logo.svg";

const NAVY_FILTER =
  "invert(6%) sepia(50%) saturate(6000%) hue-rotate(220deg) brightness(20%) contrast(95%)";

export default function PortalLogin({ onLogin }: { onLogin?: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Forkert adgangskode. Prøv igen.");
        return;
      }

      const data = await res.json();
      sessionStorage.setItem("portal_token", data.token);
      onLogin?.();
      window.location.reload();
    } catch {
      setError("Der opstod en fejl. Prøv igen senere.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#F9F9F9" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-lg p-6 sm:p-10"
        style={{ backgroundColor: "white" }}
      >
        <div className="flex flex-col items-center gap-6 mb-8">
          <img
            src={hdLogo}
            alt="HD Logo"
            className="h-14"
            style={{ filter: NAVY_FILTER }}
          />
          <div className="text-center">
            <h1
              className="text-2xl font-semibold tracking-tight"
              style={{
                fontFamily: "'Bricolage Grotesque', Georgia, serif",
                color: "#07113C",
              }}
            >
              Portal
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Henriette Duckert Keramik
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: "#07113C" }}
            >
              Adgangskode
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:ring-2"
              style={
                {
                  "--tw-ring-color": "#07113C",
                } as React.CSSProperties
              }
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 rounded-lg bg-red-50 px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#07113C" }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Logger ind…" : "Log ind"}
          </button>
        </form>
      </div>
    </div>
  );
}
