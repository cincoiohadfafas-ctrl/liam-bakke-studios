import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, ExternalLink, Music2, Tv } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LeafDecor } from "@/components/LeafDecor";

const FEATURES = [
  {
    icon: Tv,
    name: "TV2",
    role: "Lydproduksjon · TV-medvirkning",
    body: "Musikk produsert ved Liam Bakke Studios har vært featured i TV2-produksjoner — fra bakgrunnsspor til artistmedvirkning på skjerm.",
  },
  {
    icon: Music2,
    name: "MGPjr",
    role: "Produksjon · Innspilling",
    body: "Bidrag til MGPjr (Melodi Grand Prix Junior) — fra demo til ferdig låt klar for scenen, innspilt og produsert i studio.",
  },
];

export function FeaturedPage() {
  return (
    <>
      <title>As featured on TV2 & MGPjr — Liam Bakke Studios</title>
      <meta
        name="description"
        content="Liam Bakke Studios har levert produksjon og innspilling til TV2 og MGPjr — se hvor arbeidet har vært featured."
      />
      <meta property="og:title" content="As featured on TV2 & MGPjr" />
      <meta property="og:description" content="Produksjon og innspilling fra Liam Bakke Studios — featured på TV2 og MGPjr." />

      <div className="relative min-h-screen" style={{ background: "oklch(0.14 0.04 280)" }}>
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 20%, oklch(0.42 0.18 280 / 0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, oklch(0.48 0.16 168 / 0.15) 0%, transparent 55%)",
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
                <Award className="h-3.5 w-3.5" /> Featured arbeid
              </div>
              <h1
                className="font-display font-bold leading-[0.92] mb-6"
                style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)", color: "oklch(0.97 0.01 240)" }}
              >
                Sett på{" "}
                <span className="text-gradient">TV2</span>
                {" "}&{" "}
                <br className="sm:hidden" />
                hørt på{" "}
                <span className="text-gradient">MGPjr.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed" style={{ color: "oklch(0.70 0.04 265)" }}>
                Lyd produsert ved Liam Bakke Studios har funnet veien til både riksdekkende TV
                og en av Norges største musikkscener for unge artister.
              </p>
            </motion.div>

            <div className="mt-14 grid md:grid-cols-2 gap-5">
              {FEATURES.map((f, i) => (
                <motion.article
                  key={f.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
                  className="rounded-2xl border p-7 transition-all"
                  style={{
                    background: "oklch(0.20 0.05 280 / 0.6)",
                    borderColor: "oklch(0.32 0.06 280 / 0.5)",
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.62 0.18 280 / 0.5)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.32 0.06 280 / 0.5)"; }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.62 0.18 280 / 0.2)" }}
                    >
                      <f.icon className="h-6 w-6" style={{ color: "oklch(0.68 0.16 168)" }} />
                    </div>
                    <div>
                      <p className="font-display text-2xl" style={{ color: "oklch(0.97 0.01 240)" }}>{f.name}</p>
                      <p className="text-xs uppercase tracking-widest" style={{ color: "oklch(0.60 0.04 265)" }}>{f.role}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.68 0.04 265)" }}>{f.body}</p>
                </motion.article>
              ))}
            </div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 rounded-2xl border p-6 grid sm:grid-cols-3 gap-6"
              style={{
                background: "oklch(0.18 0.04 280 / 0.7)",
                borderColor: "oklch(0.32 0.06 280 / 0.4)",
              }}
            >
              {[
                { val: "TV2", lbl: "Riksdekkende kanal" },
                { val: "MGPjr", lbl: "Nasjonal musikkscene" },
                { val: "1000+", lbl: "Produksjoner totalt" },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="text-center">
                  <p className="font-display text-3xl font-bold text-gradient mb-1">{val}</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: "oklch(0.60 0.04 265)" }}>{lbl}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 rounded-2xl border p-7 md:p-9"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.18 280 / 0.12), oklch(0.52 0.16 168 / 0.10))",
                borderColor: "oklch(0.68 0.16 168 / 0.35)",
              }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: "oklch(0.97 0.01 240)" }}>
                Vil du være neste?
              </h2>
              <p className="text-sm mb-6 max-w-xl" style={{ color: "oklch(0.65 0.04 265)" }}>
                Enten du sikter mot radio, TV eller bare den beste versjonen av låten din —
                studioet er klart.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  hash="booking"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))",
                    color: "oklch(0.97 0.01 240)",
                  }}
                >
                  Book studio <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
