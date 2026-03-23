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
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      e.email = "Indtast en gyldig email";
    }
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
        setFormData({
          navn: "",
          email: "",
          emne: "",
          besked: "",
        });
        setErrors({});
      } else {
        toast.error("Der opstod en fejl. Prøv igen senere.");
      }
    } catch {
      toast.error("Der opstod en fejl. Prøv igen senere.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-border bg-background text-foreground p-3 placeholder:text-muted-foreground";
  const labelClass = "block text-sm font-medium text-foreground mb-2";
  const errorClass = "text-xs text-destructive mt-1.5";

  return (
    <section className="container py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Kontakt
            </p>
            <h1 className="text-4xl md:text-5xl font-bold">Skriv til os</h1>
          </div>

          <div className="w-12 h-[2px] bg-foreground" />

          <p className="text-muted-foreground">
            Har du spørgsmål om keramik eller bestillinger? Send en besked,
            så vender vi tilbage hurtigst muligt.
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
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className={labelClass}>Navn</label>
              <input
                type="text"
                value={formData.navn}
                onChange={(e) =>
                  setFormData({ ...formData, navn: e.target.value })
                }
                className={inputClass}
                placeholder="Navn"
              />
              {errors.navn && <p className={errorClass}>{errors.navn}</p>}
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={inputClass}
                placeholder="Email"
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            <div>
              <label className={labelClass}>Emne</label>
              <input
                type="text"
                value={formData.emne}
                onChange={(e) =>
                  setFormData({ ...formData, emne: e.target.value })
                }
                className={inputClass}
                placeholder="Emne"
              />
              {errors.emne && <p className={errorClass}>{errors.emne}</p>}
            </div>

            <div>
              <label className={labelClass}>Besked</label>
              <textarea
                value={formData.besked}
                onChange={(e) =>
                  setFormData({ ...formData, besked: e.target.value })
                }
                rows={5}
                className={inputClass}
                placeholder="Besked"
              />
              {errors.besked && <p className={errorClass}>{errors.besked}</p>}
            </div>

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
