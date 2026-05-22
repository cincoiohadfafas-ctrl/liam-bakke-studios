import { motion } from "framer-motion";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LeafDecor } from "@/components/LeafDecor";

const SECTIONS = [
  {
    title: "Booking & Betaling",
    body: [
      "Alle bookinger bekreftes via e-post etter at depositum er mottatt.",
      "Betaling kan gjøres via Vipps, bankoverføring eller kontant ved oppmøte.",
      "Fullstendig betaling forfaller senest på dagen for innspillingssession.",
      "Ved manglende betaling forbeholder Liam Bakke Studio seg retten til å kansellere bookingen.",
    ],
  },
  {
    title: "Kanselleringspolicy",
    body: [
      "Kansellering mer enn 7 dager før booket dato: Depositum refunderes i sin helhet.",
      "Kansellering 3–7 dager før booket dato: 50 % av depositumet refunderes.",
      "Kansellering mindre enn 72 timer før booket dato: Depositumet refunderes ikke.",
      "Liam Bakke Studio forbeholder seg retten til å avlyse en session ved force majeure, sykdom eller tekniske problemer. I slike tilfeller tilbys full refusjon eller ny dato uten ekstra kostnad.",
    ],
  },
  {
    title: "Depositum",
    body: [
      "Det kreves et depositum på 50 % av total sessionpris for å bekrefte bookingen.",
      "Depositumet er ikke-refunderbart ved kansellering under 72 timer før oppmøte.",
      "Depositumet går til fradrag på den totale prisen ved gjennomført session.",
    ],
  },
  {
    title: "Angrerett",
    body: [
      "I henhold til norsk angrerettlov (angrerettloven) har forbrukere som bestiller tjenester digitalt normalt 14 dagers angrerett.",
      "Angreretten bortfaller dersom tjenesten (innspillingssession) er påbegynt med forbrukerens samtykke innen angrefristen.",
      "Ved bruk av angreretten kontaktes Liam Bakke Studio skriftlig på contact.liambakke@gmail.com.",
    ],
  },
  {
    title: "Studioregler",
    body: [
      "Respektér utstyr, lokaler og andre som befinner seg i studioet.",
      "Mat og drikke er tillatt, men ikke i nærheten av utstyr.",
      "Røyking og rusmidler er ikke tillatt i studioet.",
      "Antall personer utover det som er avtalt i bookingen, kan medføre tilleggskostnad.",
      "Skader på studioutstyr forårsaket av klienten faktureres til kostpris.",
    ],
  },
  {
    title: "Immaterielle rettigheter",
    body: [
      "Liam Bakke Studio beholder ingenting av opphavsretten til innspilt materiale. All rett tilfaller artisten.",
      "Liam Bakke Studio kan med artistens samtykke bruke utdrag fra innspillinger i markedsføring.",
      "Artisten er ansvarlig for at innspilt innhold ikke krenker tredjeparts opphavsrettigheter.",
    ],
  },
];

export function LegalPage() {
  return (
    <>
      <title>Vilkår & Juridisk — Liam Bakke Studio</title>
      <div className="relative" style={{ background: "oklch(0.14 0.04 280)" }}>
        <LeafDecor />
        <SiteHeader />
        <main className="max-w-3xl mx-auto px-5 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>
              Juridisk
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4" style={{ color: "oklch(0.97 0.01 240)" }}>
              Vilkår &{" "}
              <span className="text-gradient">betingelser.</span>
            </h1>
            <p className="text-sm mb-16" style={{ color: "oklch(0.60 0.04 265)" }}>
              Sist oppdatert: mai 2025 · Liam Bakke Studio — Enkeltpersonforetak
            </p>

            <div className="space-y-10">
              {SECTIONS.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                  className="rounded-2xl border p-6 md:p-8"
                  style={{
                    background: "oklch(0.20 0.05 280 / 0.6)",
                    borderColor: "oklch(0.32 0.06 280 / 0.5)",
                  }}
                >
                  <h2 className="font-display text-xl font-bold mb-4" style={{ color: "oklch(0.97 0.01 240)" }}>
                    {s.title}
                  </h2>
                  <ul className="space-y-2.5">
                    {s.body.map((line, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "oklch(0.72 0.04 265)" }}>
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "oklch(0.68 0.16 168)" }} />
                        {line}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <p className="mt-12 text-xs text-center" style={{ color: "oklch(0.45 0.04 265)" }}>
              Spørsmål om vilkårene? Ta kontakt på{" "}
              <a href="mailto:contact.liambakke@gmail.com" className="underline hover:text-white transition-colors">
                contact.liambakke@gmail.com
              </a>
            </p>
          </motion.div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
