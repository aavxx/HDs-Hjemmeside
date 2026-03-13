import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
    "w-full bg-card border border-border px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground transition-colors";
  const labelClass = "block text-sm font-body font-medium text-foreground mb-1.5";

  return (
    <section className="container py-16 md:py-24 max-w-2xl">
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-3">
          Bestilling
        </h1>
        <p className="text-muted-foreground font-body mb-10 leading-relaxed">
          Udfyld formularen herunder for at bestille dit eget unikke stykke keramik.
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
            <h2 className="font-display text-2xl font-light text-foreground">
              Produkter
            </h2>

            {products.map((product, index) => (
              <div
                key={product.id}
                className="border border-border p-6 space-y-4 bg-card relative"
              >
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Fjern produkt"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <p className="text-xs text-muted-foreground font-body tracking-wide uppercase">
                  Produkt {index + 1}
                </p>

                <div>
                  <label className={labelClass}>Form — Hvilken form skal det være?</label>
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
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus size={16} />
              Tilføj endnu et produkt
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-body tracking-wide hover:opacity-90 transition-opacity"
          >
            Send bestilling
          </button>
        </form>
      </div>
    </section>
  );
};

export default Bestilling;
