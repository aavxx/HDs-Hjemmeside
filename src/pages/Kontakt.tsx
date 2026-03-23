import { useState } from "react";
import { ArrowRight, Loader2, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

const Kontakt = () => {
  const [formData, setFormData] = useState({
    navn: "",
    email: "",
    emne: "",
    besked: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "aee0fc08-8ca2-4624-bb97-c1817216ca1d",
          name: formData.navn.trim(),
          email: formData.email.trim(),
          subject: formData.emne.trim(),
          message: formData.besked.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Tak for din besked. Henriette vender tilbage hurtigst muligt.");
        setFormData({ navn: "", email: "", emne: "", besked: "" });
      } else {
        toast.error("Der opstod en fejl. Prøv igen senere.");
      }
    } catch {
      toast.error("Der opstod en fejl. Prøv igen senere.");
    } finally {
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
            <button
              type="submit"
              disabled={isSubmitting}
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
