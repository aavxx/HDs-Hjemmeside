const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-10">
    <h2
      className="text-xl font-semibold mb-3"
      style={{ color: "#07113C" }}
    >
      {title}
    </h2>
    <div className="text-base text-foreground leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

const Privatlivspolitik = () => {
  return (
    <div
      className="container py-16 md:py-24 max-w-3xl mx-auto"
      style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }}
    >
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
          Juridisk
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight"
          style={{ color: "#07113C" }}
        >
          Privatlivspolitik
        </h1>
        <p className="text-muted-foreground mt-4 text-sm">
          Senest opdateret: maj 2026
        </p>
      </div>

      <Section title="Om denne politik">
        <p>
          Denne privatlivspolitik beskriver, hvordan Henriette Duckert Keramik
          (henrietteduckert.dk) indsamler, bruger og opbevarer dine
          personoplysninger, når du besøger vores hjemmeside eller kontakter os.
        </p>
        <p>
          Dataansvarlig: Henriette Duckert, keramiker@henrietteduckert.dk,
          henrietteduckert.dk
        </p>
      </Section>

      <Section title="Hvilke data indsamler vi?">
        <p>Vi indsamler følgende oplysninger:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Kontaktformular:</strong> Navn, e-mailadresse, emne og
            beskedtekst — når du sender en henvendelse via kontaktformularen.
          </li>
          <li>
            <strong>Ordrer (kundeportal):</strong> Kundenavn, e-mailadresse,
            telefonnummer, ordrebebskrivelse, status og interne notater.
          </li>
          <li>
            <strong>E-mailkorrespondance:</strong> Afsendernavn, e-mailadresse,
            emne og beskedindhold ved ind- og udgående e-mails via portalen.
          </li>
        </ul>
      </Section>

      <Section title="Formål med behandlingen">
        <p>Vi behandler dine oplysninger for at:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Besvare dine henvendelser og forespørgsler</li>
          <li>Administrere ordrer og kundekommunikation</li>
          <li>Forbedre hjemmesidens oplevelse</li>
        </ul>
        <p>
          Retsgrundlaget for behandlingen er dit samtykke (henvendelse via
          kontaktformular) og berettiget interesse (ordreadministration og
          kommunikation).
        </p>
      </Section>

      <Section title="Tredjeparter vi deler data med">
        <p>
          Vi anvender følgende tredjeparter i forbindelse med driften af
          hjemmesiden:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Resend</strong> (resend.com) — e-maillevering og modtagelse
            af indkommende e-mails. Resend behandler e-mailindhold ved afsendelse.
          </li>
          <li>
            <strong>Supabase</strong> (supabase.com) — database til opbevaring
            af ordrer og e-mailkorrespondance. Data opbevares på servere i EU.
          </li>
          <li>
            <strong>Vercel</strong> (vercel.com) — hosting af hjemmesiden og
            serverløse funktioner. Vercel er hjemmesidens hosting-udbyder.
          </li>
          <li>
            <strong>Google Fonts</strong> — skrifttypen Bricolage Grotesque
            indlæses fra fonts.googleapis.com ved besøg på hjemmesiden. Din
            IP-adresse sendes til Google ved indlæsning.
          </li>
        </ul>
      </Section>

      <Section title="Cookies og lokal lagring">
        <p>
          Vi anvender ikke traditionelle tracking-cookies. Dog benyttes
          følgende:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Cookie-samtykke (localStorage):</strong> Vi gemmer din
            præference for cookie-samtykke lokalt i din browser under nøglen{" "}
            <code className="bg-muted px-1 rounded text-sm">
              hd_cookie_consent
            </code>
            .
          </li>
          <li>
            <strong>Portal-godkendelse (sessionStorage):</strong> Når du logger
            ind på den interne kundeportal, gemmes en godkendelsesmarkering i
            sessionens storage. Denne slettes automatisk, når du lukker browseren.
            Det er teknisk ikke en cookie.
          </li>
        </ul>
      </Section>

      <Section title="Opbevaringsperiode">
        <p>
          Vi opbevarer dine oplysninger så længe det er nødvendigt for at
          opfylde formålet med behandlingen, eller så længe vi er forpligtet
          hertil ved lov. Kontakthenvendelser slettes typisk efter 2 år.
          Ordredata opbevares så længe ordren er relevant for forretningen.
        </p>
      </Section>

      <Section title="Dine rettigheder">
        <p>Du har ret til at:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Anmode om indsigt i de oplysninger, vi har om dig</li>
          <li>Anmode om berigtigelse af forkerte oplysninger</li>
          <li>Anmode om sletning af dine oplysninger</li>
          <li>Gøre indsigelse mod behandlingen</li>
          <li>Klage til Datatilsynet (datatilsynet.dk)</li>
        </ul>
        <p>
          Kontakt os på keramiker@henrietteduckert.dk for at udøve dine
          rettigheder.
        </p>
      </Section>

      <Section title="Kontakt">
        <p>
          Henriette Duckert Keramik
          <br />
          E-mail: keramiker@henrietteduckert.dk
          <br />
          Hjemmeside: henrietteduckert.dk
        </p>
      </Section>
    </div>
  );
};

export default Privatlivspolitik;
