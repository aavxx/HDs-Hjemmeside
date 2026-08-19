import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import ceramicsHero from "@/assets/ceramics-hero.png";
import portrait from "@/assets/henriette-portrait.png";

/**
 * Forsiden holder sig til det, der faktisk kan stå på skrift: Henriettes egen
 * tekst, udstillingerne og indkøbene derfra, samt hvordan man får kontakt.
 * Ingen opdigtede processer, hold eller leveringstider.
 */

const cv = [
  {
    titel: "Udstillinger",
    punkter: [
      "Charlottenborgs Forårsudstilling",
      "Kunstnernes Sommerudstilling",
      "Clay – Danmarks Keramikmuseum",
      "Udstillinger i Japan, Sverige og Tyskland",
    ],
  },
  {
    titel: "Separatudstillinger",
    punkter: ["Huset i Asnæs", "Tranegården i Gentofte", "Galleri Louis Borch & Sohn, Hamburg"],
  },
  {
    titel: "Værker indkøbt af",
    punkter: [
      "Københavns Kulturfond",
      "Silkeborg Kommune",
      "En række danske virksomheder og kunstforeninger",
    ],
  },
  {
    titel: "Medlemskaber og omtale",
    punkter: [
      "Danske Kunsthåndværkere og Designere",
      "Lertøj Aarhus og Huset i Asnæs",
      "Weilbachs Kunstnerleksikon og Den Danske Tehistorie",
    ],
  },
];

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

      {/* Kort om Henriette */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
            <div className="img-reveal overflow-hidden">
              <img
                src={portrait}
                alt="Henriette Duckert ved drejebænken"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                loading="lazy"
                width={700}
                height={875}
              />
            </div>

            <div className="space-y-6">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Keramikeren</p>
              <h2 className="text-3xl font-semibold leading-snug md:text-4xl">
                Leret som materiale — i form, overflade og funktion
              </h2>
              <div className="h-[2px] w-12 bg-foreground" />
              <p className="max-w-xl leading-relaxed text-muted-foreground">
                Jeg hedder Henriette Duckert og arbejder med keramik som kunstnerisk udtryk. Gennem mange år
                har jeg arbejdet med leret som materiale og udforsket dets muligheder i både form, overflade og
                funktion. Keramikken giver mig mulighed for at arbejde med hænderne og skabe unikke værker,
                hvor håndværk og kunst mødes.
              </p>
              <Link
                to="/demo/om-mig"
                className="group inline-flex items-center gap-2 text-sm font-medium link-underline"
              >
                Læs hele historien
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Udstillinger og anerkendelse */}
      <section className="border-t border-border bg-muted/40">
        <div className="container py-16 md:py-24">
          <div className="mb-10 max-w-2xl space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Udvalgt</p>
            <h2 className="text-3xl font-semibold leading-snug md:text-4xl">Vist og indkøbt</h2>
            <p className="leading-relaxed text-muted-foreground">
              Værkerne har været vist på udstillinger i både Danmark og udlandet og er gennem årene blevet
              indkøbt af institutioner, virksomheder og kunstforeninger.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {cv.map(({ titel, punkter }) => (
              <div key={titel} className="border border-border bg-card p-6 md:p-7">
                <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {titel}
                </h3>
                <ul className="space-y-2.5">
                  {punkter.map((punkt) => (
                    <li key={punkt} className="flex gap-3 leading-relaxed">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground/50" />
                      <span>{punkt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galleriet er på vej */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-20">
          <div className="flex flex-col items-start justify-between gap-6 border border-border bg-card p-8 md:flex-row md:items-center md:p-10">
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Galleri</p>
              <h2 className="text-2xl font-semibold leading-snug">Billeder af værkerne er på vej</h2>
              <p className="leading-relaxed text-muted-foreground">
                Indtil galleriet er klar, er du velkommen til at skrive, hvis du vil høre, hvad der er
                tilgængeligt lige nu.
              </p>
            </div>
            <Link
              to="/demo/kontakt"
              className="group inline-flex shrink-0 items-center gap-2 bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover-lift"
            >
              Skriv til mig
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
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
