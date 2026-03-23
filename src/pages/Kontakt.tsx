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

          <div className="w-full aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2222.0!2d10.6068!3d56.3568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464dd7e3c5a5a5a5%3A0x0!2sFuglslev+Bygade+5%2C+8400+Ebeltoft!5e0!3m2!1sda!2sdk!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kort over Fuglslev Bygade 5, 8400 Ebeltoft"
            />
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
              className="w-full border border-border bg-background text-foreground p-3"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full border border-border bg-background text-foreground p-3"
            />

            <input
              name="subject"
              placeholder="Emne"
              required
              className="w-full border border-border bg-background text-foreground p-3"
            />

            <textarea
              name="message"
              placeholder="Besked"
              required
              rows={5}
              className="w-full border border-border bg-background text-foreground p-3"
            />

            <button
              type="submit"
              className="w-full bg-foreground text-background p-3 hover:opacity-90 transition-opacity"
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
