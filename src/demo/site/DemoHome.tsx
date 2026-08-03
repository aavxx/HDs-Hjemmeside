import { Link } from "react-router-dom";
import { ArrowRight, Flame, Hand, Package } from "lucide-react";
import ceramicsHero from "@/assets/ceramics-hero.png";
import PieceImage from "../PieceImage";
import { pieces } from "../data";

const featured = pieces.filter((p) => ["vase-hoej-ler", "skaal-morgenlys", "unika-fuglslev"].includes(p.id));

const steps = [
  {
    icon: Hand,
    titel: "Drejet i hånden",
    tekst: "Hvert stykke formes enkeltvis på skiven. Ingen forme, ingen serier – derfor er to stykker aldrig helt ens.",
  },
  {
    icon: Flame,
    titel: "Brændt to gange",
    tekst: "Først en forbrænding ved 950 grader, så glasur og en glødebrænding ved 1280. Sammenlagt tager det tre til fire uger.",
  },
  {
    icon: Package,
    titel: "Pakket til at holde",
    tekst: "Sendes med GLS i hele Danmark, eller hentes i værkstedet i Fuglslev efter aftale.",
  },
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
              Unika stykker fra værkstedet i Fuglslev. Drejet, glaseret og brændt af Henriette Duckert — ét
              ad gangen, siden 2009.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/demo/galleri"
                className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-medium tracking-wide text-primary-foreground hover-lift"
              >
                Se galleriet
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/demo/vaerksted"
                className="inline-flex items-center border border-foreground/20 px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 hover:border-foreground"
              >
                Besøg værkstedet
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

      {/* Udvalgte stykker */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Udvalgte stykker
              </p>
              <h2 className="text-3xl font-semibold leading-snug md:text-4xl">Nyt fra ovnen</h2>
            </div>
            <Link to="/demo/galleri" className="link-underline inline-flex items-center gap-2 text-sm font-medium">
              Hele galleriet
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((piece) => (
              <Link
                key={piece.id}
                to={`/demo/galleri?stykke=${piece.id}`}
                className="group block border border-border bg-card p-6 hover-lift"
              >
                <PieceImage
                  kategori={piece.kategori}
                  hue={piece.hue}
                  className="mx-auto h-44 w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="mt-6 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{piece.navn}</h3>
                    <p className="text-sm text-muted-foreground">{piece.kategori}</p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-medium">{piece.pris.toLocaleString("da-DK")} kr.</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Processen */}
      <section className="border-t border-border bg-muted/40">
        <div className="container py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-3">
            {steps.map(({ icon: Icon, titel, tekst }) => (
              <div key={titel} className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-semibold">{titel}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl border border-border bg-card p-8 text-center md:p-12">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Workshops</p>
            <h2 className="mb-4 text-2xl font-semibold leading-snug md:text-3xl">
              Prøv drejeskiven en lørdag i Fuglslev
            </h2>
            <p className="mx-auto mb-7 max-w-xl leading-relaxed text-muted-foreground">
              Fire timer ved skiven, ler og brænding inkluderet. Holdene er på højst seks, så der er tid til
              alle. Dine stykker er klar til afhentning cirka en måned efter.
            </p>
            <Link
              to="/demo/kontakt?emne=Workshop"
              className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover-lift"
            >
              Spørg om ledige datoer
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
