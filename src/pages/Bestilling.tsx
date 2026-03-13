import { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  form: string;
  udseende: string;
  kommentarer: string;
}

const Bestilling = () => {
  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [products, setProducts] = useState<Product[]>([
    { id: 1, form: "", udseende: "", kommentarer: "" },
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      { id: Date.now(), form: "", udseende: "", kommentarer: "" },
    ]);
  };

  const removeProduct = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tak for din bestilling! Vi vender tilbage hurtigst muligt.");
  };

  const inputClass =
    "w-full bg-card border border-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all duration-300";
  const labelClass = "block text-sm font-medium text-foreground mb-2";

  return (
    <section className="container py-20 md:py-28 max-w-2xl">
      <div className="stagger-children space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-3">
            Bestilling
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Bestil keramik
          </h1>
        </div>
        <div className="w-12 h-[2px] bg-foreground line-reveal" />
        <p className="text-muted-foreground leading-relaxed">
          Udfyld formularen herunder for at bestille dit eget unikke stykke
          keramik.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact info */}
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Fulde Navn</label>
              <input
                type="text"
                required
                value={navn}
                onChange={(e) => setNavn(e.target.value)}
                placeholder="Dit fulde navn"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.dk"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Telefonnummer</label>
              <input
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="+45 12 34 56 78"
                className={inputClass}
              />
            </div>
          </div>

          {/* Products */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Produkter
            </h2>

            {products.map((product, index) => (
              <div
                key={product.id}
                className="border border-border p-6 space-y-4 bg-card relative hover-lift animate-fade-in"
              >
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors duration-300"
                    aria-label="Fjern produkt"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase font-medium">
                  Produkt {index + 1}
                </p>

                <div>
                  <label className={labelClass}>
                    Form — Hvilken form skal det være?
                  </label>
                  <input
                    type="text"
                    required
                    value={product.form}
                    onChange={(e) =>
                      updateProduct(product.id, "form", e.target.value)
                    }
                    placeholder="F.eks. kop, skål, kande..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Udseende — Hvordan skal den se ud?
                  </label>
                  <textarea
                    required
                    value={product.udseende}
                    onChange={(e) =>
                      updateProduct(product.id, "udseende", e.target.value)
                    }
                    placeholder="Skriv farver, mønster, eller andet..."
                    rows={3}
                    className={inputClass + " resize-none"}
                  />
                </div>

                <div>
                  <label className={labelClass}>Andre kommentarer?</label>
                  <textarea
                    value={product.kommentarer}
                    onChange={(e) =>
                      updateProduct(product.id, "kommentarer", e.target.value)
                    }
                    placeholder="Eventuelle ønsker eller bemærkninger..."
                    rows={2}
                    className={inputClass + " resize-none"}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
            >
              <Plus
                size={16}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              Tilføj endnu et produkt
            </button>
          </div>

          <button
            type="submit"
            className="group w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide hover-lift inline-flex items-center justify-center gap-2"
          >
            Send bestilling
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Bestilling;
