import henriettePortrait from "@/assets/henriette-portrait.png";

const OmMig = () => {
  return (
    <section className="container py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div className="animate-fade-in">
          <img
            src={henriettePortrait}
            alt="Henriette Duckert ved drejebænken i sit værksted"
            className="w-full object-cover aspect-[3/4]"
          />
        </div>

        <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
            Om Mig
          </h1>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            <p>
              Henriette Duckert er en passioneret keramiker, der arbejder fra sit værksted med at skabe unikke, håndlavede stykker. Hver form drejes omhyggeligt på drejebænken og dekoreres med karakteristiske mønstre og farver.
            </p>
            <p>
              Med kærlighed til håndværket og øje for detaljen skaber Henriette keramik, der forener funktion og æstetik — stykker der er lige så smukke at se på, som de er rare at bruge i hverdagen.
            </p>
            <p>
              Hendes signaturstil er kendetegnet ved de ternet mønstre og farverige kanter, der giver hvert stykke et legende og personligt udtryk.
            </p>
            <p className="text-sm italic text-muted-foreground/70">
              Beskrivelsen opdateres snart med mere information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OmMig;
