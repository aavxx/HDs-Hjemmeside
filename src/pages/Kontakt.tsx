import { MapPin, Phone } from "lucide-react";

const Kontakt = () => {
  return (
    <section className="container py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-16">

        {/* LEFT SIDE */}
        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Kontakt
            </p>
            <h1 className="text-4xl md:text-5xl font-bold">
              Skriv til os
            </h1>
          </div>

          <div className="w-12 h-[2px] bg-black" />

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

        {/* FORM */}
        <div>
          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            className="space-y-5"
          >
            <input
              type="hidden"
              name="access_key"
              value="aee0fc08-8ca2-4624-bb97-c1817216ca1d"
            />

            <input
              name="name"
              placeholder="Navn"
              required
              className="w-full border p-3"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full border p-3"
            />

            <input
              name="subject"
              placeholder="Emne"
              required
              className="w-full border p-3"
            />

            <textarea
              name="message"
              placeholder="Besked"
              required
              rows={5}
              className="w-full border p-3"
            />

            <button
              type="submit"
              className="w-full bg-black text-white p-3"
            >
              Send besked
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Kontakt;
