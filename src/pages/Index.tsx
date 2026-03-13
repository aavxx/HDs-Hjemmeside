import { Link } from "react-router-dom";
import ceramicsHero from "@/assets/ceramics-hero.png";

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="font-display text-4xl md:text-6xl font-light leading-tight text-foreground">
              Håndlavet<br />keramik
            </h1>
            <p className="text-muted-foreground font-body text-lg max-w-md leading-relaxed">
              Unika stykker skabt med omhu og passion. Hvert stykke er formet i hånden og fortæller sin egen historie.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                to="/bestilling"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground text-sm font-body tracking-wide hover:opacity-90 transition-opacity"
              >
                Bestil keramik
              </Link>
              <Link
                to="/om-mig"
                className="inline-flex items-center px-6 py-3 border border-foreground text-foreground text-sm font-body tracking-wide hover:bg-accent transition-colors"
              >
                Lær mig at kende
              </Link>
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <img
              src={ceramicsHero}
              alt="Håndlavet keramik af Henriette Duckert - kopper, kander og skåle med ternet mønster og farverige kanter"
              className="w-full object-cover aspect-square"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
