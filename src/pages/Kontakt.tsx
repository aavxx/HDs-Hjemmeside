import { useState } from "react";
import { ArrowRight, Loader2, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

interface FormErrors {
  navn?: string;
  email?: string;
  emne?: string;
  besked?: string;
}

const Kontakt = () => {
  const [formData, setFormData] = useState({
    navn: "",
    email: "",
    emne: "",
    besked: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.navn.trim()) e.navn = "Indtast venligst dit navn";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      e.email = "Indtast en gyldig email";
    if (!formData.emne.trim()) e.emne = "Indtast et emne";
    if (!formData.besked.trim()) e.besked = "Skriv venligst en besked";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

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
        setErrors({});
      } else {
        throw new Error("API fejl");
      }
    } catch (error) {
      toast.error("Der opstod en fejl. Prøv igen senere.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-card border border-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all duration-300";

  const labelClass = "block text-sm font-medium text-foreground mb-2";
  const errorClass = "text-xs text-destructive mt-1.5";

  return (
    <section className="container py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-3">
              Kontakt
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Skriv til os
            </h1>
          </div>

          <div className="w-12 h-[2px] bg-foreground" />

          <p className="text-muted-foreground leading-relaxed">
            Har du spørgsmål om keramik, bestillinger eller andet? Send en besked
            herunder, så vender vi tilbage hurtigst muligt.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-foreground/70 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Adresse</p>
                <p className="text-sm text-muted-foreground">Fuglslev Bygade 5</p>
                <p className="text-sm text-muted-foreground">8400 Ebeltoft</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="text-foreground/70 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Telefon</p>
                <a href="tel:+4520456637" className="text-sm text-muted-foreground hover:text-foreground">
                  +45 20 45 66 37
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Navn</label>
              <input
                type="text"
                value={formData.navn}
                onChange={(e) => setFormData({ ...formData, navn: e.target.value })}
                className={inputClass}
              />
              {errors.navn && <p className={errorClass}>{errors.navn}</p>}
            </div>

            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            <div>
              <label className={labelClass}>Emne</label>
              <input
                type="text"
                value={formData.emne}
                onChange={(e) => setFormData({ ...formData, emne: e.target.value })}
                className={inputClass}
              />
              {errors.emne && <p className={errorClass}>{errors.emne}</p>}
            </div>

            <div>
              <label className={labelClass}>Besked</label>
              <textarea
                value={formData.besked}
                onChange={(e) => setFormData({ ...formData, besked: e.target.value })}
                rows={5}
                className={`${inputClass} resize-none`}
              />
              {errors.besked && <p className={errorClass}>{errors.besked}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium"
            >
              {isSubmitting ? (
                <>
                  Sender... <Loader2 className="inline animate-spin ml-2" size={16} />
                </>
              ) : (
                <>
                  Send besked <ArrowRight className="inline ml-2" size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Kontakt;
