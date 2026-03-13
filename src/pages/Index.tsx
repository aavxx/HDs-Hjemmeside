import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ceramicsHero from "@/assets/ceramics-hero.png";

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="container py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="stagger-children space-y-8">
            <div className="w-12 h-[2px] bg-foreground line-reveal" />
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] text-foreground tracking-tight">
              Håndlavet
              <br />
              <span className="font-light">keramik</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Unika stykker skabt med omhu og passion. Hvert stykke er formet i
              hånden og fortæller sin egen historie.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/bestilling"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover-lift"
              >
                Bestil keramik
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/om-mig"
                className="inline-flex items-center px-7 py-3.5 border border-foreground/20 text-foreground text-sm font-medium tracking-wide hover:border-foreground transition-colors duration-300"
              >
                Lær mig at kende
              </Link>
            </div>
          </div>

          <div className="img-reveal overflow-hidden">
            <img
              src={ceramicsHero}
              alt="Håndlavet keramik af Henriette Duckert"
              className="w-full object-cover aspect-square hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Brief section */}
      <section className="border-t border-border">
        <div className="container py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center stagger-children space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
              Håndværk & Design
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground leading-snug">
              Hvert stykke er unikt — drejet, dekoreret og brændt med kærlighed
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Fra idé til færdigt stykke tager hvert produkt flere uger. Det er
              netop denne tålmodighed og omsorg, der giver keramikken sjæl.
            </p>
            <Link
              to="/om-mig"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
            >
              Læs mere om processen
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
