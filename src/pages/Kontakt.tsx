import { useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Kontakt = () => {
  const [formData, setFormData] = useState({
    navn: "",
    email: "",
    besked: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tak for din besked! Vi vender tilbage hurtigst muligt.");
    setFormData({ navn: "", email: "", besked: "" });
  };

  const inputClass =
    "w-full bg-card border border-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all duration-300";
  const labelClass = "block text-sm font-medium text-foreground mb-2";

  return (
    <section className="container py-20 md:py-28 max-w-2xl">
      <div className="stagger-children space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-3">
            Kontakt
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Skriv til os
          </h1>
        </div>
        <div className="w-12 h-[2px] bg-foreground line-reveal" />
        <p className="text-muted-foreground leading-relaxed">
          Har du spørgsmål om keramik, bestillinger eller andet? Send en besked
          herunder, så vender vi tilbage hurtigst muligt.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Navn</label>
            <input
              type="text"
              required
              value={formData.navn}
              onChange={(e) =>
                setFormData({ ...formData, navn: e.target.value })
              }
              placeholder="Dit navn"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>E-mail</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="din@email.dk"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Besked</label>
            <textarea
              required
              value={formData.besked}
              onChange={(e) =>
                setFormData({ ...formData, besked: e.target.value })
              }
              placeholder="Skriv din besked her..."
              rows={5}
              className={inputClass + " resize-none"}
            />
          </div>
          <button
            type="submit"
            className="group w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide hover-lift inline-flex items-center justify-center gap-2"
          >
            Send besked
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </form>

        {/* AI assistant note */}
        <div className="border border-border bg-card p-6 flex items-start gap-4 hover-lift">
          <div className="p-2.5 bg-muted rounded-full shrink-0">
            <MessageCircle size={18} className="text-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm mb-1">
              Brug for hurtigt svar?
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Du kan også stille spørgsmål til vores AI-assistent — du finder
              den i nederste højre hjørne af siden.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Kontakt;
