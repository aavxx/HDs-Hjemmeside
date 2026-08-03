// Demodata til /demo og /demo/portal.
//
// VIGTIGT: Alt her er opdigtet. Demoportalen ligger på en offentlig URL uden
// reel adgangskontrol, så den må aldrig hente rigtige kundedata fra Supabase.
// Vil man koble demoen på virkelige data, skal portalen først have server-side
// auth og RLS på plads – se README.

export type PieceCategory = "Skåle" | "Vaser" | "Krus" | "Fade" | "Unika";
export type PieceStatus = "Til salg" | "Solgt" | "På bestilling";

export interface Piece {
  id: string;
  navn: string;
  kategori: PieceCategory;
  status: PieceStatus;
  pris: number;
  maal: string;
  glasur: string;
  aar: number;
  beskrivelse: string;
  /** Farvetone til pladsholder-illustrationen, 0-360. */
  hue: number;
}

export const PIECE_CATEGORIES: PieceCategory[] = ["Skåle", "Vaser", "Krus", "Fade", "Unika"];

export const pieces: Piece[] = [
  {
    id: "skaal-morgenlys",
    navn: "Morgenlys",
    kategori: "Skåle",
    status: "Til salg",
    pris: 480,
    maal: "Ø 18 cm · H 9 cm",
    glasur: "Askeglasur, mat",
    aar: 2025,
    beskrivelse:
      "Drejet i lys stentøjsler og brændt ved 1280 grader. Glasuren løber en anelse mod foden og samler farven i en varm ring, som ingen to skåle deler.",
    hue: 32,
  },
  {
    id: "vase-hoej-ler",
    navn: "Høj Ler",
    kategori: "Vaser",
    status: "Til salg",
    pris: 1250,
    maal: "Ø 14 cm · H 32 cm",
    glasur: "Rå ler udenpå, klar indeni",
    aar: 2025,
    beskrivelse:
      "En høj, smal form med uglaseret yderside, så leret får lov at ånde. Indersiden er glaseret og tåler vand og friske blomster.",
    hue: 18,
  },
  {
    id: "krus-hverdag",
    navn: "Hverdag",
    kategori: "Krus",
    status: "Til salg",
    pris: 320,
    maal: "Ø 8 cm · H 10 cm · 3 dl",
    glasur: "Havblå, blank",
    aar: 2025,
    beskrivelse:
      "Krus med hank formet efter hånden. Tåler opvaskemaskine, men bliver smukkest af at blive vasket i hånden.",
    hue: 205,
  },
  {
    id: "fad-langbord",
    navn: "Langbord",
    kategori: "Fade",
    status: "På bestilling",
    pris: 1680,
    maal: "48 × 22 cm · H 4 cm",
    glasur: "Sandhvid med jernpletter",
    aar: 2024,
    beskrivelse:
      "Bygget i plade og formet over en trækølle. Tænkt til serveringen midt på bordet, hvor mange hænder skal nå ind over den.",
    hue: 42,
  },
  {
    id: "unika-vinterstille",
    navn: "Vinterstille",
    kategori: "Unika",
    status: "Solgt",
    pris: 3400,
    maal: "Ø 26 cm · H 24 cm",
    glasur: "Dobbeltdyppet, krakeleret",
    aar: 2024,
    beskrivelse:
      "Et enkeltstående stykke fra vinterbrændingen. Krakeleringen er fremkaldt ved hurtig afkøling og fortsætter langsomt gennem hele stykkets liv.",
    hue: 220,
  },
  {
    id: "skaal-lav-sten",
    navn: "Lav Sten",
    kategori: "Skåle",
    status: "Til salg",
    pris: 540,
    maal: "Ø 24 cm · H 6 cm",
    glasur: "Stengrå, silkemat",
    aar: 2025,
    beskrivelse:
      "Bred og lav med en kant, der er trukket let udad. Ligger godt i to hænder og bruges lige så ofte til nøgler som til frugt.",
    hue: 210,
  },
  {
    id: "vase-knop",
    navn: "Knop",
    kategori: "Vaser",
    status: "Til salg",
    pris: 620,
    maal: "Ø 11 cm · H 15 cm",
    glasur: "Okker, mat",
    aar: 2025,
    beskrivelse:
      "En lille rund vase til en enkelt gren. Halsen er smal nok til at holde selv tynde stilke oprejst.",
    hue: 38,
  },
  {
    id: "krus-espresso",
    navn: "Espresso",
    kategori: "Krus",
    status: "Til salg",
    pris: 220,
    maal: "Ø 6 cm · H 6 cm · 1 dl",
    glasur: "Mørk tjørn, blank",
    aar: 2025,
    beskrivelse:
      "Sælges enkeltvis eller i sæt af fire. De fire i sættet er bevidst ikke ens – de er drejet efter øjemål samme morgen.",
    hue: 12,
  },
  {
    id: "fad-tallerken-hverdag",
    navn: "Hverdagstallerken",
    kategori: "Fade",
    status: "Til salg",
    pris: 380,
    maal: "Ø 27 cm",
    glasur: "Sandhvid, blank",
    aar: 2025,
    beskrivelse:
      "Middagstallerken i stentøj, tænkt til daglig brug. Stabler pænt og tåler både ovn og opvaskemaskine.",
    hue: 45,
  },
  {
    id: "unika-fuglslev",
    navn: "Fuglslev",
    kategori: "Unika",
    status: "Til salg",
    pris: 2900,
    maal: "Ø 20 cm · H 38 cm",
    glasur: "Lokal lerslikker, saltbrændt",
    aar: 2025,
    beskrivelse:
      "Brændt med ler gravet få hundrede meter fra værkstedet. Saltet i ovnen giver overfladen sin karakteristiske appelsinhud.",
    hue: 26,
  },
  {
    id: "skaal-par",
    navn: "Par",
    kategori: "Skåle",
    status: "På bestilling",
    pris: 860,
    maal: "2 stk. · Ø 15 cm · H 8 cm",
    glasur: "Havblå og sandhvid",
    aar: 2024,
    beskrivelse:
      "To skåle drejet som et sæt, den ene lidt højere end den anden. Laves på bestilling i den glasurkombination, du vælger.",
    hue: 200,
  },
  {
    id: "vase-tvilling",
    navn: "Tvilling",
    kategori: "Vaser",
    status: "Solgt",
    pris: 1480,
    maal: "Ø 16 cm · H 28 cm",
    glasur: "Askeglasur over jern",
    aar: 2024,
    beskrivelse:
      "To sammenvoksede former, drejet hver for sig og samlet mens leret stadig var vådt. Sømmen er med vilje synlig.",
    hue: 30,
  },
];

// --- Portalens demodata ----------------------------------------------------

export type OrderStatus = "Afventer" | "Behandler" | "Fuldført" | "Annulleret";
export const ORDER_STATUSES: OrderStatus[] = ["Afventer", "Behandler", "Fuldført", "Annulleret"];

export interface Inquiry {
  id: string;
  navn: string;
  email: string;
  emne: string;
  besked: string;
  modtaget: string;
  laest: boolean;
  papirkurv: boolean;
  /** Sat når henvendelsen er lavet om til en ordre. */
  ordreId?: string;
}

export interface Order {
  id: string;
  kunde: string;
  email: string;
  telefon?: string;
  beskrivelse: string;
  status: OrderStatus;
  beloeb: number;
  oprettet: string;
  frist?: string;
  noter?: string;
}

/** Faste datoer, så demoen ser ens ud hver gang den vises frem. */
const d = (dagesSiden: number, time = 9): string => {
  const base = new Date("2026-08-03T00:00:00Z");
  base.setUTCDate(base.getUTCDate() - dagesSiden);
  base.setUTCHours(time, 0, 0, 0);
  return base.toISOString();
};

export const seedInquiries: Inquiry[] = [
  {
    id: "inq-1",
    navn: "Mette Sørensen",
    email: "mette.sorensen@example.dk",
    emne: "Bestilling af servicesæt til 8 personer",
    besked:
      "Hej Henriette\n\nVi skal have nyt service til sommerhuset og faldt over dine tallerkener på markedet i Ebeltoft. Vi mangler 8 middagstallerkener og 8 skåle i den sandhvide glasur.\n\nHvad ville sådan et sæt koste, og hvor lang leveringstid skal vi regne med?\n\nMvh Mette",
    modtaget: d(0, 8),
    laest: false,
    papirkurv: false,
  },
  {
    id: "inq-2",
    navn: "Jens Kofoed",
    email: "jk@example.com",
    emne: "Workshop for 6 personer i oktober",
    besked:
      "Godmorgen\n\nJeg vil gerne booke en drejeworkshop for min afdeling – vi er 6. Har I ledige lørdage i oktober?\n\nVenlig hilsen Jens",
    modtaget: d(0, 11),
    laest: false,
    papirkurv: false,
  },
  {
    id: "inq-3",
    navn: "Galleri Nordlys",
    email: "kontakt@example-galleri.dk",
    emne: "Forespørgsel om udstilling foråret 2027",
    besked:
      "Kære Henriette\n\nVi kuraterer en udstilling om dansk stentøj til foråret 2027 og vil meget gerne have dit arbejde med. Kan vi aftale et besøg i værkstedet?\n\nDe bedste hilsner\nGalleri Nordlys",
    modtaget: d(1, 14),
    laest: true,
    papirkurv: false,
  },
  {
    id: "inq-4",
    navn: "Anne Lindgaard",
    email: "anne.l@example.dk",
    emne: "Er Vinterstille stadig til salg?",
    besked:
      "Hej\n\nJeg så Vinterstille på din side. Er den stadig ledig, og sender du til Aarhus?\n\nMvh Anne",
    modtaget: d(2, 10),
    laest: true,
    papirkurv: false,
    ordreId: "ord-3",
  },
  {
    id: "inq-5",
    navn: "Thomas Bæk",
    email: "tb@example.dk",
    emne: "Reparation af hank",
    besked:
      "Hej Henriette\n\nJeg har et krus fra jer, hvor hanken er knækket. Kan det reddes, eller skal jeg bestille et nyt?\n\nThomas",
    modtaget: d(3, 16),
    laest: true,
    papirkurv: false,
  },
  {
    id: "inq-6",
    navn: "Sofie Dahl",
    email: "sofie@example.dk",
    emne: "Bryllupsgave – 2 unika skåle",
    besked:
      "Hej\n\nMin søster skal giftes i september. Jeg tænkte på Par-skålene, gerne i havblå. Kan de nå at blive færdige inden den 12.?\n\nKh Sofie",
    modtaget: d(5, 9),
    laest: true,
    papirkurv: false,
    ordreId: "ord-2",
  },
  {
    id: "inq-7",
    navn: "uaLxiimtbpIcEdUmMurv",
    email: "jo.h.n.de.capu.a2.3@example-spam.com",
    emne: "sYgiAsJSvyGrOmgVVyMhJkA increase your traffic",
    besked: "ppFbodoVUmjcizfdttnvE click here to rank your website",
    modtaget: d(1, 3),
    laest: true,
    papirkurv: true,
  },
  {
    id: "inq-8",
    navn: "Kirsten Holm",
    email: "kirsten.holm@example.dk",
    emne: "Tak for en dejlig dag",
    besked:
      "Kære Henriette\n\nTusind tak for workshoppen i lørdags. Min vase overlevede brændingen, og den står nu i vindueskarmen.\n\nKirsten",
    modtaget: d(7, 13),
    laest: true,
    papirkurv: false,
  },
];

export const seedOrders: Order[] = [
  {
    id: "ord-1",
    kunde: "Restaurant Molen",
    email: "køkken@example-molen.dk",
    telefon: "+45 30 11 22 33",
    beskrivelse: "24 serveringsfade i sandhvid til nyt menukoncept",
    status: "Behandler",
    beloeb: 18400,
    oprettet: d(12),
    frist: d(-25),
    noter: "Første 8 er brændt. Resten afventer glasurlevering.",
  },
  {
    id: "ord-2",
    kunde: "Sofie Dahl",
    email: "sofie@example.dk",
    beskrivelse: "Par – 2 skåle i havblå, bryllupsgave",
    status: "Behandler",
    beloeb: 860,
    oprettet: d(5),
    frist: d(-38),
    noter: "Skal være færdig inden 12. september.",
  },
  {
    id: "ord-3",
    kunde: "Anne Lindgaard",
    email: "anne.l@example.dk",
    beskrivelse: "Vinterstille – unika, forsendelse til Aarhus",
    status: "Fuldført",
    beloeb: 3400,
    oprettet: d(2),
    noter: "Sendt med GLS, sporingsnummer sendt til kunden.",
  },
  {
    id: "ord-4",
    kunde: "Jens Kofoed",
    email: "jk@example.com",
    telefon: "+45 26 55 44 12",
    beskrivelse: "Drejeworkshop, 6 deltagere",
    status: "Afventer",
    beloeb: 4200,
    oprettet: d(0),
    noter: "Afventer bekræftelse af dato i oktober.",
  },
  {
    id: "ord-5",
    kunde: "Ebeltoft Kunsthåndværk",
    email: "butik@example-ebeltoft.dk",
    beskrivelse: "Kommissionsparti: 12 krus, 6 vaser",
    status: "Fuldført",
    beloeb: 7300,
    oprettet: d(30),
    noter: "Afregnet. Genbestilling forventes til jul.",
  },
  {
    id: "ord-6",
    kunde: "Peter Vinther",
    email: "pv@example.dk",
    beskrivelse: "Specialbestilling: urne i saltbrændt stentøj",
    status: "Annulleret",
    beloeb: 2600,
    oprettet: d(20),
    noter: "Kunden fandt en anden løsning. Ingen omkostninger afholdt.",
  },
];

/** Henvendelser pr. uge til dashboardets graf. */
export const inquiryTrend = [
  { uge: "U27", henvendelser: 6, ordrer: 2 },
  { uge: "U28", henvendelser: 9, ordrer: 3 },
  { uge: "U29", henvendelser: 5, ordrer: 1 },
  { uge: "U30", henvendelser: 12, ordrer: 4 },
  { uge: "U31", henvendelser: 8, ordrer: 2 },
  { uge: "U32", henvendelser: 14, ordrer: 5 },
];
