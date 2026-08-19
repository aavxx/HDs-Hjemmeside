import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Check, Loader2, Mail, MapPin, Phone } from "lucide-react";
import Turnstile, { type TurnstileHandle } from "@/components/Turnstile";

/**
 * Demoens kontaktformular.
 *
 * Turnstile-widgetten er den rigtige, så bot-beskyttelsen kan ses i praksis,
 * men indsendelsen kalder ikke /api/send. Ellers ville hver, der klikker rundt
 * i demoen, lande som en mail i Henriettes indbakke.
 */
export default function DemoContact() {
  const [params] = useSearchParams();
  const [formData, setFormData] = useState({ navn: "", email: "", emne: "", besked: "" });
  const [honeypot, setHoneypot] = useState("");
  const openedAt = useRef(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  // Forudfyld emnet, hvis det følger med i linket.
  useEffect(() => {
    const emne = params.get("emne");
    if (emne) setFormData((f) => ({ ...f, emne }));
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) return;

    setIsSubmitting(true);
    // Demoen sender ikke — vi viser kvitteringen, som den ville se ud.
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    setSent(true);
    turnstileRef.current?.reset();
  };

  return (
    <div className="container py-14 md:py-20">
      <div className="grid gap-14 md:grid-cols-2 md:gap-16">
        <div className="space-y-9">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Kontakt</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Skriv til Henriette</h1>
            <div className="h-[2px] w-12 bg-foreground" />
          </div>

          <p className="max-w-md leading-relaxed text-muted-foreground">
            Du er velkommen til at skrive, hvis du har spørgsmål til et værk, gerne vil bestille noget, eller
            vil høre om en udstilling. Jeg svarer, så snart jeg kan.
          </p>

          <div className="space-y-5 text-sm">
            <div className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <p>Fuglslev Bygade 5</p>
                <p className="text-muted-foreground">8400 Ebeltoft</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone size={18} className="shrink-0 text-muted-foreground" />
              <a href="tel:+4520456637" className="link-underline">
                +45 20 45 66 37
              </a>
            </div>
            <div className="flex gap-3">
              <Mail size={18} className="shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">keramiker@henrietteduckert.dk</span>
            </div>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check size={22} />
              </div>
              <h2 className="mb-2 text-xl font-semibold">Tak for din besked</h2>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                Henriette vender tilbage hurtigst muligt.
              </p>
              <p className="mb-6 border border-amber-500/30 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                Demo: der blev ikke sendt nogen mail.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setFormData({ navn: "", email: "", emne: "", besked: "" });
                  openedAt.current = Date.now();
                }}
                className="link-underline text-sm font-medium"
              >
                Skriv en til
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="navn" className="text-sm font-medium">
                  Navn
                </label>
                <input
                  id="navn"
                  value={formData.navn}
                  onChange={(e) => setFormData({ ...formData, navn: e.target.value })}
                  className="w-full border border-border bg-background p-3 text-sm outline-none transition focus:border-foreground"
                  required
                />
              </div>

              {/* Honningkrukke: usynlig for besøgende, men bots udfylder den. */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="demo-hjemmeside">Lad dette felt stå tomt</label>
                <input
                  id="demo-hjemmeside"
                  name="hjemmeside"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-border bg-background p-3 text-sm outline-none transition focus:border-foreground"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="emne" className="text-sm font-medium">
                  Emne
                </label>
                <input
                  id="emne"
                  value={formData.emne}
                  onChange={(e) => setFormData({ ...formData, emne: e.target.value })}
                  className="w-full border border-border bg-background p-3 text-sm outline-none transition focus:border-foreground"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="besked" className="text-sm font-medium">
                  Besked
                </label>
                <textarea
                  id="besked"
                  value={formData.besked}
                  onChange={(e) => setFormData({ ...formData, besked: e.target.value })}
                  rows={6}
                  className="w-full border border-border bg-background p-3 text-sm outline-none transition focus:border-foreground"
                  required
                />
              </div>

              <Turnstile ref={turnstileRef} onToken={setTurnstileToken} className="space-y-2" />

              <button
                type="submit"
                disabled={isSubmitting || !turnstileToken}
                className="group inline-flex w-full items-center justify-center gap-2 bg-primary p-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    Sender…
                    <Loader2 size={16} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Send besked
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {!turnstileToken && (
                <p className="text-center text-xs text-muted-foreground">
                  Knappen låses op, når sikkerhedstjekket er gennemført.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
