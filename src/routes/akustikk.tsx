import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Layers, Mic2, Volume2, Waves } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LeafDecor } from "@/components/LeafDecor";

const SPECS = [
  {
    icon: Layers,
    title: "4 rader takpaneler",
    body: "16 matt-svarte absorberende paneler montert i tak — bryter tidlige refleksjoner og kveler stående bølger over hodet.",
  },
  {
    icon: Waves,
    title: "Bass-kontroll",
    body: "Hjørneabsorbenter og diffusjon i bakveggen gir et stramt lavmellomtone uten å gjøre rommet dødt.",
  },
  {
    icon: Mic2,
    title: "Vokalsone",
    body: "Dedikert vokalplass med kontrollert refleksjon — rommet forsvinner, stemmen står helt frempå.",
  },
  {
    icon: Volume2,
    title: "RT60 ~0,3s",
    body: "Kort, jevn etterklang gir presise takes og en miks som oversetter direkte til hodetelefoner, bil og høyttalere.",
  },
];

export function AkustikkPage() {
  return (
    <>
      <title>Akustikk i studio — Liam Bakke Studios</title>
      <meta
        name="description"
        content="Slik er studioet akustisk behandlet: 4 rader absorberende takpaneler, bass-feller og dempede flater for et balansert lydbilde."
      />
      <meta property="og:title" content="Akustikk — Liam Bakke Studios" />
      <meta property="og:description" content="Bak lyden: akustisk behandling, paneler og romdesign hos Liam Bakke Studios." />

      <div className="relative min-h-screen" style={{ background: "oklch(0.14 0.04 280)" }}>
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, oklch(0.42 0.18 280 / 0.18) 0%, transparent 55%), radial-gradient(ellipse at 15% 75%, oklch(0.48 0.16 168 / 0.15) 0%, transparent 55%)",
          }}
        />
        <SiteHeader />
        <LeafDecor />
        <main className="pt-28 pb-24 px-5">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm mb-10 transition-colors hover:text-white"
              style={{ color: "oklch(0.65 0.04 265)" }}
            >
              <ArrowLeft className="h-4 w-4" /> Tilbake
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-widest mb-6"
                style={{ borderColor: "oklch(0.32 0.06 280 / 0.6)", background: "oklch(0.20 0.05 280 / 0.5)", color: "oklch(0.68 0.16 168)" }}
              >
                <Waves className="h-3.5 w-3.5" /> Akustikk
              </div>
              <h1
                className="font-display font-bold leading-[0.92] mb-6"
                style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "oklch(0.97 0.01 240)" }}
              >
                Et rom som <br />
                <span className="text-gradient">lyder riktig.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed" style={{ color: "oklch(0.70 0.04 265)" }}>
                Akustikken er det første mikrofonen fanger — før preamp, før plugins. Derfor er
                studioet bygget rundt et nøytralt, balansert lydbilde med dedikert behandling
                på flere flater.
              </p>
            </motion.div>

            {/* Panel visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="mt-12 relative rounded-2xl overflow-hidden border"
              style={{
                aspectRatio: "16/7",
                background: "linear-gradient(to bottom, oklch(0.22 0.06 280 / 0.7), oklch(0.16 0.05 280 / 0.4))",
                borderColor: "oklch(0.32 0.06 280 / 0.5)",
                boxShadow: "0 0 60px -20px oklch(0.62 0.18 280 / 0.3)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute inset-5 grid grid-rows-4 gap-2.5">
                {Array.from({ length: 4 }).map((_, row) => (
                  <div key={row} className="grid grid-cols-12 gap-1.5">
                    {Array.from({ length: 12 }).map((_, col) => (
                      <motion.div
                        key={col}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: 0.3 + row * 0.1 + col * 0.02, duration: 0.4 }}
                        className="rounded-sm"
                        style={{
                          background: `linear-gradient(to bottom, oklch(${0.22 + (row * col % 5) * 0.02} 0.04 280), oklch(0.14 0.03 280))`,
                          border: "1px solid oklch(0.35 0.07 280 / 0.3)",
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div
                className="absolute bottom-3 right-4 text-[10px] uppercase tracking-widest"
                style={{ color: "oklch(0.50 0.04 265)" }}
              >
                4 × 12 panel-grid · taklayout
              </div>
            </motion.div>

            {/* Specs */}
            <div className="mt-14 grid md:grid-cols-2 gap-5">
              {SPECS.map((s, i) => (
                <motion.article
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border p-7 transition-all"
                  style={{
                    background: "oklch(0.20 0.05 280 / 0.6)",
                    borderColor: "oklch(0.32 0.06 280 / 0.5)",
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.62 0.18 280 / 0.5)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.32 0.06 280 / 0.5)"; }}
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "oklch(0.62 0.18 280 / 0.2)" }}
                  >
                    <s.icon className="h-6 w-6" style={{ color: "oklch(0.68 0.16 168)" }} />
                  </div>
                  <h3 className="font-display text-xl mb-2" style={{ color: "oklch(0.97 0.01 240)" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.04 265)" }}>{s.body}</p>
                </motion.article>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-14 rounded-2xl border p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.18 280 / 0.12), oklch(0.52 0.16 168 / 0.10))",
                borderColor: "oklch(0.68 0.16 168 / 0.35)",
              }}
            >
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-2" style={{ color: "oklch(0.97 0.01 240)" }}>
                  Hør forskjellen selv.
                </h2>
                <p className="text-sm" style={{ color: "oklch(0.65 0.04 265)" }}>
                  Book en demo-time og opplev rommet før du booker hele prosjektet.
                </p>
              </div>
              <Link
                to="/"
                hash="booking"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-sm transition-all hover:opacity-90 whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))",
                  color: "oklch(0.97 0.01 240)",
                }}
              >
                Book en time <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
