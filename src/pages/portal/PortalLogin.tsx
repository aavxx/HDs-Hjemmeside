import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hdLogo from "@/assets/hd-logo.svg";

const PORTAL_PASSWORD =
  (import.meta.env.VITE_PORTAL_PASSWORD as string | undefined) ?? "keramik2024";

interface PortalLoginProps {
  onLogin: () => void;
}

const PortalLogin = ({ onLogin }: PortalLoginProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PORTAL_PASSWORD) {
      sessionStorage.setItem("portal_auth", "1");
      onLogin();
    } else {
      setError(true);
      setPassword("");
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
                setError(false);
              }}
              className="w-full"
              style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 mt-1">
                Forkert adgangskode. Prøv igen.
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            style={{
              backgroundColor: "#07113C",
              fontFamily: "'Bricolage Grotesque', Georgia, serif",
            }}
          >
            Log ind
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PortalLogin;
