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
              Jeg hedder Henriette Duckert og arbejder med keramik som kunstnerisk
              udtryk. Gennem mange år har jeg arbejdet med leret som materiale og
              udforsket dets muligheder i både form, overflade og funktion.
              Keramikken giver mig mulighed for at arbejde med hænderne og skabe
              unikke værker, hvor håndværk og kunst mødes.
            </p>
            <p>
              Mit arbejde har gennem tiden været vist på en lang række udstillinger
              i både Danmark og udlandet. Jeg har blandt andet deltaget i
              udstillinger på Charlottenborgs Forårsudstilling, Kunstnernes
              Sommerudstilling, Clay – Danmarks Keramikmuseum, samt i udstillinger
              i blandt andet Japan, Sverige og Tyskland.
            </p>
            <p>
              Jeg har også haft flere separatudstillinger, blandt andet på Huset i
              Asnæs, Tranegården i Gentofte og Galleri Louis Borch &amp; Sohn i
              Hamburg.
            </p>
            <p>
              Mine værker er gennem årene blevet indkøbt af både institutioner og
              kunstforeninger, herunder Københavns Kulturfond, Silkeborg Kommune og
              en række danske virksomheder og kunstforeninger.
            </p>
            <p>
              Jeg er medlem af blandt andet Danske Kunsthåndværkere og Designere,
              Lertøj Aarhus og Huset i Asnæs, og mit arbejde er omtalt i blandt
              andet Weilbachs Kunstnerleksikon og Den Danske Tehistorie.
            </p>
            <p>
              I mit arbejde søger jeg at forene det kunstneriske med det
              håndværksmæssige, og jeg finder stor glæde i at skabe keramiske
              værker, der både kan opleves visuelt og bruges i hverdagen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OmMig;
