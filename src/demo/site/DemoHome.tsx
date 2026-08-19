import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import ceramicsHero from "@/assets/ceramics-hero.png";

const kontakt = [
  { icon: MapPin, label: "Adresse", value: "Fuglslev Bygade 5, 8400 Ebeltoft", href: undefined },
  { icon: Phone, label: "Telefon", value: "+45 20 45 66 37", href: "tel:+4520456637" },
  { icon: Mail, label: "Email", value: "keramiker@henrietteduckert.dk", href: "mailto:keramiker@henrietteduckert.dk" },
];

export default function DemoHome() {
  return (
    <div>
      {/* Hero */}
      <section className="container py-16 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="stagger-children space-y-7">
            <div className="line-reveal h-[2px] w-12 bg-foreground" />
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Håndlavet
              <br />
              <span className="font-light">keramik</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Unika værker af Henriette Duckert, hvor håndværk og kunst mødes. Formet i hånden, ét stykke ad
              gangen — til at se på og til at bruge.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/demo/om-mig"
                className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-medium tracking-wide text-primary-foreground hover-lift"
              >
                Om mig
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/demo/kontakt"
                className="inline-flex items-center border border-foreground/20 px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 hover:border-foreground"
              >
                Kontakt
              </Link>
            </div>
          </div>

          <div className="img-reveal overflow-hidden">
            <img
              src={ceramicsHero}
              alt="Håndlavet keramik af Henriette Duckert"
              className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              loading="eager"
              width={800}
              height={800}
            />
          </div>
        </div>
      </section>

      {/* Praktisk – det man typisk kommer for at finde */}
      <section className="border-t border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {kontakt.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background">
                  <Icon size={18} />
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                {href ? (
                  <a href={href} className="link-underline block font-medium leading-relaxed">
                    {value}
                  </a>
                ) : (
                  <p className="font-medium leading-relaxed">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
