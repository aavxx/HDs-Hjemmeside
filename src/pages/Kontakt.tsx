import { useState } from "react";
import { ArrowRight, Loader2, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase.functions.invoke("send", {
        body: {
          name: formData.navn.trim(),
          email: formData.email.trim(),
          subject: formData.emne.trim(),
          message: formData.besked.trim(),
        },
      });

      if (error) throw error;
      if (data && !data.success) throw new Error(data.error || "Ukendt fejl");

      toast.success("Tak for din besked. Jeg vender tilbage hurtigst muligt.");
      setFormData({ navn: "", email: "", emne: "", besked: "" });
      setErrors({});
    } catch {
      toast.error("Noget gik galt. Prøv venligst igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-card border border-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all duration-300";
  const labelClass = "block text-sm font-medium text-foreground mb-2";
  const errorClass = "text-xs text-destructive mt-1.5";

  const fields: { key: keyof typeof formData; label: string; placeholder: string; type?: string }[] = [
    { key: "navn", label: "Navn", placeholder: "Dit fulde navn" },
    { key: "email", label: "E-mail", placeholder: "din@email.dk", type: "email" },
    { key: "emne", label: "Emne", placeholder: "Hvad handler din henvendelse om?" },
  ];

  return (
    <section className="container py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-16">
        {/* Left: Contact info + map */}
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

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 text-foreground/70 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Adresse</p>
                <p className="text-sm text-muted-foreground">Fuglslev Bygade 5</p>
                <p className="text-sm text-muted-foreground">8400 Ebeltoft</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="shrink-0 text-foreground/70 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Telefon</p>
                <a
                  href="tel:+4520456637"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +45 20 45 66 37
                </a>
              </div>
            </div>
          </div>

          <div className="w-full aspect-[4/3] border border-border overflow-hidden">
            <iframe
              title="Kort over Fuglslev Bygade 5, 8400 Ebeltoft"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2222.5!2d10.635!3d56.34!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464dd7c0a5e3f3f1%3A0x0!2sFuglslev+Bygade+5%2C+8400+Ebeltoft!5e0!3m2!1sda!2sdk!4v1700000000000"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Right: Form */}
        <div className="stagger-children space-y-10">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {fields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  type={type || "text"}
                  value={formData[key]}
                  onChange={(e) => {
                    setFormData({ ...formData, [key]: e.target.value });
                    if (errors[key]) setErrors({ ...errors, [key]: undefined });
                  }}
                  placeholder={placeholder}
                  className={`${inputClass}${errors[key] ? " border-destructive" : ""}`}
                />
                {errors[key] && <p className={errorClass}>{errors[key]}</p>}
              </div>
            ))}

            <div>
              <label className={labelClass}>Besked</label>
              <textarea
                value={formData.besked}
                onChange={(e) => {
                  setFormData({ ...formData, besked: e.target.value });
                  if (errors.besked) setErrors({ ...errors, besked: undefined });
                }}
                placeholder="Skriv din besked her..."
                rows={5}
                className={`${inputClass} resize-none${errors.besked ? " border-destructive" : ""}`}
              />
              {errors.besked && <p className={errorClass}>{errors.besked}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide hover-lift inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  Sender...
                  <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  Send besked
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
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
