import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "hd_cookie_consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-border px-6 py-4"
      style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-foreground flex-1">
          Vi bruger cookies for at forbedre din oplevelse. Læs mere i vores{" "}
          <Link
            to="/privatlivspolitik"
            className="underline hover:text-muted-foreground transition-colors"
          >
            Privatlivspolitik
          </Link>
          .
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={accept}
            style={{
              backgroundColor: "#07113C",
              fontFamily: "'Bricolage Grotesque', Georgia, serif",
            }}
            size="sm"
          >
            Acceptér alle
          </Button>
          <Button
            onClick={reject}
            variant="outline"
            size="sm"
            style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
          >
            Kun nødvendige
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
