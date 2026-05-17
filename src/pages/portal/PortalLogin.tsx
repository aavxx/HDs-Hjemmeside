import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import hdLogo from "@/assets/hd-logo.svg";

interface PortalLoginProps {
  onLogin: () => void;
}

const PortalLogin = ({ onLogin }: PortalLoginProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        sessionStorage.setItem("portal_token", data.token);
        onLogin();
      } else {
        setError("Forkert adgangskode. Prøv igen.");
        setPassword("");
      }
    } catch {
      setError("Kunne ikke forbinde til serveren. Prøv igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#F9F9F9]"
      style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
    >
      <div className="w-full max-w-sm px-6">
        <div className="flex justify-center mb-8">
          <img
            src={hdLogo}
            alt="HD Logo"
            className="h-10"
            style={{
              filter:
                "invert(6%) sepia(50%) saturate(6000%) hue-rotate(220deg) brightness(20%) contrast(95%)",
            }}
          />
        </div>
        <h1
          className="text-2xl font-semibold text-center mb-2"
          style={{ color: "#07113C" }}
        >
          Portal
        </h1>
        <p className="text-sm text-center text-muted-foreground mb-8">
          Henriette Duckert Keramik
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Adgangskode"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full"
              style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !password}
            style={{
              backgroundColor: "#07113C",
              fontFamily: "'Bricolage Grotesque', Georgia, serif",
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={15} className="animate-spin" />
                Logger ind...
              </span>
            ) : (
              "Log ind"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PortalLogin;
