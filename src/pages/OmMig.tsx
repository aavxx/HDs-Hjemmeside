import henriettePortrait from "@/assets/henriette-portrait.png";

const OmMig = () => {
  return (
    <section className="container py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        <div className="img-reveal overflow-hidden">
          <img
            src={henriettePortrait}
            alt="Henriette Duckert ved drejebænken i sit værksted"
            className="w-full object-cover aspect-[3/4] hover:scale-[1.02] transition-transform duration-700"
          />
        </div>

        <div className="stagger-children space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-3">
              Om Mig
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Henriette Duckert
            </h1>
          </div>
          <div className="w-12 h-[2px] bg-foreground line-reveal" />
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              Henriette Duckert er en passioneret keramiker, der arbejder fra
              sit værksted med at skabe unikke, håndlavede stykker. Hver form
              drejes omhyggeligt på drejebænken og dekoreres med
              karakteristiske mønstre og farver.
            </p>
            <p>
              Med kærlighed til håndværket og øje for detaljen skaber Henriette
              keramik, der forener funktion og æstetik — stykker der er lige så
              smukke at se på, som de er rare at bruge i hverdagen.
            </p>
            <p>
              Hendes signaturstil er kendetegnet ved de ternet mønstre og
              farverige kanter, der giver hvert stykke et legende og personligt
              udtryk.
            </p>
            <p className="text-sm italic text-muted-foreground/60">
              Beskrivelsen opdateres snart med mere information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OmMig;
