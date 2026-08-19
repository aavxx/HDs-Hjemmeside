import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import portrait from "@/assets/henriette-portrait.png";

const afsnit = [
  "Jeg hedder Henriette Duckert og arbejder med keramik som kunstnerisk udtryk. Gennem mange år har jeg arbejdet med leret som materiale og udforsket dets muligheder i både form, overflade og funktion. Keramikken giver mig mulighed for at arbejde med hænderne og skabe unikke værker, hvor håndværk og kunst mødes.",
  "Mit arbejde har gennem tiden været vist på en lang række udstillinger i både Danmark og udlandet. Jeg har blandt andet deltaget i udstillinger på Charlottenborgs Forårsudstilling, Kunstnernes Sommerudstilling, Clay – Danmarks Keramikmuseum, samt i udstillinger i blandt andet Japan, Sverige og Tyskland.",
  "Jeg har også haft flere separatudstillinger, blandt andet på Huset i Asnæs, Tranegården i Gentofte og Galleri Louis Borch & Sohn i Hamburg.",
  "Mine værker er gennem årene blevet indkøbt af både institutioner og kunstforeninger, herunder Københavns Kulturfond, Silkeborg Kommune og en række danske virksomheder og kunstforeninger.",
  "Jeg er medlem af blandt andet Danske Kunsthåndværkere og Designere, Lertøj Aarhus og Huset i Asnæs, og mit arbejde er omtalt i blandt andet Weilbachs Kunstnerleksikon og Den Danske Tehistorie.",
  "I mit arbejde søger jeg at forene det kunstneriske med det håndværksmæssige, og jeg finder stor glæde i at skabe keramiske værker, der både kan opleves visuelt og bruges i hverdagen.",
];

export default function DemoAbout() {
  return (
    <section className="container py-14 md:py-20">
      <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
        <div className="img-reveal overflow-hidden">
          <img
            src={portrait}
            alt="Henriette Duckert i værkstedet"
            className="aspect-[3/4] w-full object-cover"
            loading="lazy"
            width={700}
            height={933}
          />
        </div>

        <div className="stagger-children space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Om mig</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">Henriette Duckert</h1>
          <div className="line-reveal h-[2px] w-12 bg-foreground" />

          <div className="space-y-5 leading-relaxed text-muted-foreground">
            {afsnit.map((tekst) => (
              <p key={tekst.slice(0, 24)}>{tekst}</p>
            ))}
          </div>

          <Link
            to="/demo/kontakt"
            className="group inline-flex items-center gap-2 pt-2 text-sm font-medium link-underline"
          >
            Skriv til mig
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
