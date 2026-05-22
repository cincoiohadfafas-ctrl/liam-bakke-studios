import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Music2, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LeafDecor } from "@/components/LeafDecor";

export function OmPage() {
  return (
    <>
      <title>Om Liam — Liam Bakke Studios</title>
      <meta name="description" content="Bli kjent med produsenten bak Liam Bakke Studios — historien, filosofien og veien fra 2019 til i dag." />
      <meta property="og:title" content="Om Liam — Liam Bakke Studios" />
      <meta property="og:description" content="Produsenten bak Liam Bakke Studios. Est. 2019." />

      <div className="relative min-h-screen" style={{ background: "oklch(0.14 0.04 280)" }}>
        {/* Subtle bg glow */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 20%, oklch(0.42 0.18 280 / 0.2) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, oklch(0.48 0.16 168 / 0.15) 0%, transparent 55%)",
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
                <Sparkles className="h-3 w-3" /> Est. 2019 — {new Date().getFullYear()}
              </div>
              <h1
                className="font-display font-bold leading-[0.92] mb-6"
                style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "oklch(0.97 0.01 240)" }}
              >
                Mannen bak <br />
                <span className="text-gradient">knappene.</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed" style={{ color: "oklch(0.70 0.04 265)" }}>
                Liam Bakke har holdt på med musikk siden 2019. Det som startet som en hobby på
                soverommet har vokst til et fullverdig studio med 1000+ produserte beats, kunder
                fra hele landet og features på TV2 og MGPjr. Filosofien er enkel: god lyd, ekte
                relasjoner, og låter du faktisk vil høre på etterpå.
              </p>
            </motion.div>

            {/* Info cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-12 grid sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Calendar, label: "Etablert", value: "2021" },
                { icon: MapPin, label: "Holder til", value: "Bergen, Norge" },
                { icon: Music2, label: "Spesialitet", value: "Beats & innspilling" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border p-5 flex items-center gap-3"
                  style={{
                    background: "oklch(0.20 0.05 280 / 0.6)",
                    borderColor: "oklch(0.32 0.06 280 / 0.5)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "oklch(0.62 0.18 280 / 0.2)" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "oklch(0.68 0.16 168)" }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest" style={{ color: "oklch(0.60 0.04 265)" }}>{label}</p>
                    <p className="font-display text-lg" style={{ color: "oklch(0.97 0.01 240)" }}>{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Timeline */}
            <div className="mt-20">
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>
                Reisen
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-10" style={{ color: "oklch(0.97 0.01 240)" }}>
                Fra 2019 til i dag.
              </h2>
              <div
                className="relative border-l pl-8 space-y-10"
                style={{ borderColor: "oklch(0.32 0.06 280 / 0.5)" }}
              >
                {[
                  { year: "2019", title: "Det starter", body: "Første beats lages på soverommet. Idé blir til vane." },
                  { year: "2021", title: "Studio tar form", body: "Rommet bygges ut. Akustikk, utstyr og rutiner faller på plass." },
                  { year: "2023", title: "TV2 & MGPjr", body: "Produksjoner brukes på riksdekkende plattformer." },
                  { year: String(new Date().getFullYear()), title: "1000+ beats senere", body: "Fortsatt samme drivkraft — bedre låter, bedre artister." },
                ].map((t, i) => (
                  <motion.div
                    key={t.year}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="relative"
                  >
                    <span
                      className="absolute -left-[37px] top-2 h-3 w-3 rounded-full"
                      style={{
                        background: "oklch(0.68 0.16 168)",
                        boxShadow: "0 0 10px oklch(0.68 0.16 168 / 0.6)",
                      }}
                    />
                    <p className="font-display text-sm tracking-widest mb-0.5" style={{ color: "oklch(0.68 0.16 168)" }}>{t.year}</p>
                    <p className="font-display text-2xl mb-1" style={{ color: "oklch(0.97 0.01 240)" }}>{t.title}</p>
                    <p className="text-sm" style={{ color: "oklch(0.65 0.04 265)" }}>{t.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 rounded-2xl border p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.18 280 / 0.12), oklch(0.52 0.16 168 / 0.10))",
                borderColor: "oklch(0.68 0.16 168 / 0.35)",
              }}
            >
              <div>
                <h3 className="font-display text-2xl md:text-3xl mb-2" style={{ color: "oklch(0.97 0.01 240)" }}>
                  Vil du jobbe sammen?
                </h3>
                <p className="text-sm" style={{ color: "oklch(0.65 0.04 265)" }}>
                  Ta kontakt — første prat er alltid gratis og uforpliktende.
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
                Book en økt <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
