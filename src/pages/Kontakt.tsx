import { useRef, useState } from "react";
import { ArrowRight, Loader2, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import Turnstile, { type TurnstileHandle } from "@/components/Turnstile";

const Kontakt = () => {
  const [formData, setFormData] = useState({
    navn: "",
    email: "",
    emne: "",
    besked: "",
  });
  // Skjult felt, som kun bots udfylder – se api/_spam.ts.
  const [honeypot, setHoneypot] = useState("");
  const openedAt = useRef(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Engangs-token fra Cloudflare Turnstile. Verificeres server-side.
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      toast.error("Bekræft venligst, at du ikke er en robot.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.navn.trim(),
          email: formData.email.trim(),
          subject: formData.emne.trim(),
          message: formData.besked.trim(),
          honeypot,
          elapsedMs: Date.now() - openedAt.current,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        toast.success("Tak for din besked. Henriette vender tilbage hurtigst muligt.");
        setFormData({ navn: "", email: "", emne: "", besked: "" });
      } else {
        toast.error("Der opstod en fejl. Prøv igen senere.");
      }
    } catch {
      toast.error("Der opstod en fejl. Prøv igen senere.");
    } finally {
      // Token'en kan kun bruges én gang – hent en ny til næste forsøg.
      turnstileRef.current?.reset();
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Kontakt</p>
            <h1 className="text-4xl md:text-5xl font-bold">Skriv til os</h1>
          </div>

          <div className="w-12 h-[2px] bg-foreground" />

          <p className="text-muted-foreground">
            Har du spørgsmål om keramik eller bestillinger? Send en besked, så vender vi tilbage hurtigst muligt.
          </p>

          <div className="space-y-6">
            <div className="flex gap-3">
              <MapPin size={18} />
              <div>
                <p>Fuglslev Bygade 5</p>
                <p>8400 Ebeltoft</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone size={18} />
              <a href="tel:+4520456637">+45 20 45 66 37</a>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              value={formData.navn}
              onChange={(e) => setFormData({ ...formData, navn: e.target.value })}
              placeholder="Navn"
              className="w-full border border-border bg-background text-foreground p-3"
              required
            />
            {/* Honningkrukke: usynlig for besøgende, men bots udfylder den. */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="hjemmeside">Lad dette felt stå tomt</label>
              <input
                id="hjemmeside"
                name="hjemmeside"
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              className="w-full border border-border bg-background text-foreground p-3"
              required
            />
            <input
              value={formData.emne}
              onChange={(e) => setFormData({ ...formData, emne: e.target.value })}
              placeholder="Emne"
              className="w-full border border-border bg-background text-foreground p-3"
              required
            />
            <textarea
              value={formData.besked}
              onChange={(e) => setFormData({ ...formData, besked: e.target.value })}
              placeholder="Besked"
              rows={5}
              className="w-full border border-border bg-background text-foreground p-3"
              required
            />
            <Turnstile ref={turnstileRef} onToken={setTurnstileToken} />
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="w-full bg-foreground text-background p-3 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  Sender...
                  <Loader2 size={16} className="animate-spin" />
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Send besked
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Kontakt;
