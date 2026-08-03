import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import portrait from "@/assets/henriette-portrait.png";

const timeline = [
  { aar: "2009", tekst: "Første drejeskive i et lånt udhus i Fuglslev. Otte skåle, hvoraf to overlevede brændingen." },
  { aar: "2013", tekst: "Værkstedet flytter ind i den gamle lade. Plads til en rigtig ovn og til at holde hold." },
  { aar: "2018", tekst: "Første udstilling i Ebeltoft. Siden fast leverandør til to gallerier og en restaurant." },
  { aar: "2024", tekst: "Begynder at grave og slemme lokalt ler fra markerne omkring værkstedet." },
];

const praktisk = [
  { icon: MapPin, label: "Adresse", value: "Fuglslev Bygade 5, 8400 Ebeltoft" },
  { icon: Clock, label: "Åbent værksted", value: "Torsdag 13–17, ellers efter aftale" },
  { icon: Users, label: "Workshops", value: "Lørdage, højst 6 deltagere pr. hold" },
];

export default function DemoWorkshop() {
  return (
    <div>
      <section className="container py-14 md:py-20">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <div className="stagger-children space-y-6">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Værkstedet</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Der går tre uger
              <br />
              <span className="font-light">fra ler til hylde</span>
            </h1>
            <div className="line-reveal h-[2px] w-12 bg-foreground" />
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Jeg hedder Henriette Duckert og har drejet keramik i Fuglslev siden 2009. Værkstedet ligger i
                den gamle lade bag huset, med udsigt over markerne, hvor en del af leret efterhånden også
                kommer fra.
              </p>
              <p>
                Alt bliver til ét stykke ad gangen. Jeg arbejder i stentøj, fordi det tåler hverdagen — det
                skal kunne holde til opvaskemaskinen, til at blive tabt en enkelt gang, og til at blive brugt
                hver dag i mange år.
              </p>
              <p>
                Glasurerne blander jeg selv. Det er derfor to skåle aldrig bliver helt ens, og det er med
                vilje. En lille skævhed er ikke en fejl; det er beviset på, at der har været en hånd inde over.
              </p>
            </div>
          </div>

          <div className="img-reveal overflow-hidden">
            <img
              src={portrait}
              alt="Henriette Duckert i værkstedet"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
              width={700}
              height={875}
            />
          </div>
        </div>
      </section>

      {/* Tidslinje */}
      <section className="border-t border-border bg-muted/40">
        <div className="container py-16 md:py-24">
          <h2 className="mb-10 text-2xl font-semibold md:text-3xl">Undervejs</h2>
          <ol className="relative space-y-8 border-l border-border pl-8">
            {timeline.map((t) => (
              <li key={t.aar} className="relative">
                <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-foreground" />
                <p className="mb-1 text-sm font-semibold tracking-wide">{t.aar}</p>
                <p className="max-w-xl leading-relaxed text-muted-foreground">{t.tekst}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Praktisk */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {praktisk.map(({ icon: Icon, label, value }) => (
              <div key={label} className="border border-border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-border">
                  <Icon size={17} />
                </div>
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                <p className="font-medium leading-relaxed">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/demo/kontakt?emne=Besøg i værkstedet"
              className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover-lift"
            >
              Aftal et besøg
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
