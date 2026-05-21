import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Mic,
  Music2,
  Play,
  Sliders,
  Sparkles,
  Star,
} from "lucide-react";
import { useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { EMAIL, INSTAGRAM_URL, PHONE, SPOTIFY_URL } from "@/lib/utils";
import studio from "@/assets/studio2.webp";
import { LeafDecor } from "@/components/LeafDecor";

/* ─── Head / SEO ─────────────────────────────────────────────────── */
export function IndexPage() {
  return (
    <>
      <title>Liam Bakke Studios — Profesjonelt innspillingsstudio i Norge</title>
      <meta
        name="description"
        content="Liam Bakke Studios er et profesjonelt innspillingsstudio for vokal, beats og mix/master. Book en økt og hør forskjellen."
      />
      <meta property="og:title" content="Liam Bakke Studios" />
      <meta property="og:description" content="Profesjonelt innspillingsstudio — vokal, beats, mix & master." />
      <div className="relative" style={{ background: "oklch(0.14 0.04 280)" }}>
        <LeafDecor />
        <SiteHeader />
        <main>
          <Hero />
          <Services />
          <Portfolio />
          <Pricing />
          <Reviews />
          <Booking />
          <ContactStrip />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

/* ─── Hero background — scoped to hero section, no fixed bleed ───── */
function HeroBg() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 600, 900], [0.70, 0.15, 0]);
  const y       = useTransform(scrollY, [0, 900], [0, 260]);
  const x       = useTransform(scrollY, [0, 900], [0, -40]);
  const scale   = useTransform(scrollY, [0, 900], [1.0, 1.18]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <motion.div
        style={{ y, x, scale }}
        className="absolute inset-0"
        transition={{ type: "tween", ease: "linear" }}
      >
        <img
          src={studio}
          alt="Liam Bakke Studios interior"
          className="h-full w-full object-cover"
          style={{ transform: "rotate(90deg) scale(1.6)", transformOrigin: "center" }}
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.14 0.04 280 / 0.35) 0%, oklch(0.14 0.04 280 / 0.65) 55%, oklch(0.14 0.04 280) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 25% 30%, oklch(0.42 0.18 280 / 0.4) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, oklch(0.48 0.16 168 / 0.3) 0%, transparent 55%)",
        }}
      />
    </motion.div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden noise-overlay"
      style={{ isolation: "isolate" }}
    >
      <HeroBg />
      <div className="max-w-7xl mx-auto px-5 pt-32 pb-20 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-widest mb-7"
            style={{
              borderColor: "oklch(0.32 0.06 280 / 0.6)",
              background: "oklch(0.20 0.05 280 / 0.5)",
              color: "oklch(0.68 0.16 168)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "oklch(0.68 0.16 168)" }} />
            Studio åpent for booking
          </div>

          <h1
            className="font-display font-bold leading-[0.92] mb-7"
            style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)", color: "oklch(0.97 0.01 240)" }}
          >
            Lyden som <br />
            <span className="text-gradient">flytter folk.</span>
          </h1>

          <p
            className="text-lg leading-relaxed max-w-xl mb-10"
            style={{ color: "oklch(0.70 0.04 265)" }}
          >
            Liam Bakke Studios er et profesjonelt innspillingsstudio bygget for artister
            som tar musikken sin på alvor. Varme rom, presist utstyr, og et øre som vet
            hva låten din trenger.
          </p>

          <div className="flex flex-wrap gap-3 mb-16">
            <Link
              to="/"
              hash="booking"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-medium text-base transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))",
                color: "oklch(0.97 0.01 240)",
                boxShadow: "0 0 40px -8px oklch(0.62 0.18 280 / 0.5)",
              }}
            >
              Book en økt <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              hash="portfolio"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-medium text-base transition-all hover:bg-white/5"
              style={{
                borderColor: "oklch(0.40 0.08 280 / 0.8)",
                background: "oklch(0.20 0.05 280 / 0.4)",
                color: "oklch(0.90 0.02 265)",
              }}
            >
              <Play className="h-4 w-4" /> Hør beatsa
            </Link>
          </div>

          <div
            className="flex flex-wrap items-center gap-6 text-sm"
            style={{ color: "oklch(0.65 0.04 265)" }}
          >
            {[
              { val: "1000+", lbl: "Beats produsert" },
              { val: "TV2", lbl: "& MGPjr featured" },
              { val: "1:1", lbl: "Personlig oppfølging" },
            ].map(({ val, lbl }, i) => (
              <div key={lbl} className="flex items-center gap-6">
                {i > 0 && <div className="h-8 w-px" style={{ background: "oklch(0.32 0.06 280 / 0.5)" }} />}
                <div>
                  <div className="font-display text-2xl font-bold" style={{ color: "oklch(0.97 0.01 240)" }}>{val}</div>
                  <div>{lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "oklch(0.50 0.04 265)" }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <div
          className="w-px h-10 animate-pulse"
          style={{ background: "linear-gradient(to bottom, oklch(0.62 0.18 280 / 0.8), transparent)" }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Services ───────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: Mic,
    title: "Vokalinnspilling",
    body: "Krystallklare takes i et rom designet for stemmen din. Pro-mikrofon, forsterkere og preamps som løfter prestasjonen din.",
  },
  {
    icon: Music2,
    title: "Custom beats",
    body: "Skreddersydde beats laget for deg — sjanger, stemning og tempo etter ønske. 2 revisjoner inkludert.",
  },
  {
    icon: Sliders,
    title: "Mix & master",
    body: "Få låten radio-ready. Profesjonell miks og mastering tilpasset prosjektets størrelse og distribusjonskanal.",
  },
];

function Services() {
  return (
    <section id="tjenester" className="relative py-28 px-5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>
            Tjenester
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold" style={{ color: "oklch(0.97 0.01 240)" }}>
            Innspilling, gjort{" "}
            <span className="text-gradient">ordentlig.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="group relative rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "oklch(0.20 0.05 280 / 0.6)",
                borderColor: "oklch(0.32 0.06 280 / 0.5)",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.62 0.18 280 / 0.6)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 50px -15px oklch(0.62 0.18 280 / 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.32 0.06 280 / 0.5)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300"
                style={{ background: "oklch(0.62 0.18 280 / 0.2)" }}
              >
                <s.icon className="h-6 w-6" style={{ color: "oklch(0.68 0.16 168)" }} />
              </div>
              <h3 className="font-display text-xl mb-2.5" style={{ color: "oklch(0.97 0.01 240)" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.04 265)" }}>{s.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            to="/akustikk"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/5"
            style={{ borderColor: "oklch(0.40 0.08 280 / 0.6)", color: "oklch(0.80 0.04 265)" }}
          >
            Se akustikkbehandling <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            hash="priser"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/5"
            style={{ borderColor: "oklch(0.40 0.08 280 / 0.6)", color: "oklch(0.80 0.04 265)" }}
          >
            Se priser <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Portfolio ──────────────────────────────────────────────────── */
function Portfolio() {
  return (
    <section id="portfolio" className="relative py-28 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>
              Beats
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold" style={{ color: "oklch(0.97 0.01 240)" }}>
              Latest{" "}
              <span className="text-gradient">Beats.</span>
            </h2>
          </motion.div>
          <a
            href={SPOTIFY_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/5"
            style={{ borderColor: "oklch(0.68 0.16 168 / 0.5)", color: "oklch(0.68 0.16 168)" }}
          >
            Følg på Spotify <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <SpotifyPortfolio />
      </div>
    </section>
  );
}

const SPOTIFY_IDS = [
  "2kVgVg482yR0LaPbNv1RJn",
  "7hMj275zk6mrukM9TCKIrW",
  "0UjY6d49LcB9gefNGJjxXq",
  "1ENgD2Ug9odXNKl5SfGA44",
];

function SpotifyPortfolio() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {SPOTIFY_IDS.map((id) => (
        <iframe
          key={id}
          src={`https://open.spotify.com/embed/album/${id}?utm_source=generator&theme=0`}
          width="100%"
          height="180"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ borderRadius: "12px", border: "none", display: "block" }}
        />
      ))}
    </motion.div>
  );
}

/* ─── Pricing ────────────────────────────────────────────────────── */
const PRICING = [
  {
    name: "Timepris",
    price: "750",
    unit: "kr / time",
    desc: "Fleksibelt for korte takes, demoer eller enkeltspor.",
    features: ["Studio + tekniker", "Rå filer levert", "Booking 24/7"],
    featured: false,
  },
  {
    name: "Studio Pakke B",
    price: null,
    unit: "ta kontakt",
    desc: "2 timer innspilling med beat og lett miks inkludert.",
    features: ["2 timer studio", "Beat inkludert", "Lett miks", "Rå filer + WAV"],
    featured: false,
  },
  {
    name: "Studio Pakke A",
    price: "4 500",
    unit: "kr / 4 timer",
    desc: "Mest brukt. 4 timer i studio med beat og miks (ikke master).",
    features: ["4 timer studio", "Beat inkludert", "Miks inkludert", "WAV / MP3 / stems"],
    featured: true,
  },
  {
    name: "Pakke Exclusive",
    price: "10 000",
    unit: "kr / heldag",
    desc: "Full produksjon: beat, miks, master og 8t innspilling — pluss Spotify-veiledning.",
    features: ["8 timer studio", "Beat + miks + master", "Veiledning til release", "Full Spotify-pakke"],
    featured: false,
  },
];

const ADDONS = [
  { title: "Custom beat", body: "2 500,- — 2 revisjoner inkludert. Leveres som WAV, MP3 og stems." },
  { title: "Mix & master", body: "2 500 – 7 500,- på bestilling. Pris avhenger av antall spor i låten." },
  { title: "Russelåter", body: "Egen kategori — ta kontakt for tilbud og tilgjengelighet." },
];

function Pricing() {
  return (
    <section id="priser" className="relative pt-10 pb-28 px-5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>
            Priser
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold" style={{ color: "oklch(0.97 0.01 240)" }}>
            Klar, transparent,{" "}
            <span className="text-gradient">ingen overraskelser.</span>
          </h2>
          <p className="mt-4 text-sm" style={{ color: "oklch(0.65 0.04 265)" }}>
            Prisene gjelder unsigned artister. Signed? Ta kontakt for egen avtale.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRICING.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border p-6 flex flex-col"
              style={{
                background: p.featured
                  ? "oklch(0.62 0.18 280 / 0.12)"
                  : "oklch(0.20 0.05 280 / 0.6)",
                borderColor: p.featured
                  ? "oklch(0.62 0.18 280 / 0.7)"
                  : "oklch(0.32 0.06 280 / 0.5)",
                backdropFilter: "blur(12px)",
                boxShadow: p.featured ? "0 0 60px -20px oklch(0.62 0.18 280 / 0.4)" : "none",
              }}
            >
              {p.featured && (
                <div
                  className="absolute -top-3 left-5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                  style={{ background: "oklch(0.68 0.16 168)", color: "oklch(0.12 0.04 280)" }}
                >
                  Mest populær
                </div>
              )}
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "oklch(0.65 0.04 265)" }}>{p.name}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-3xl font-bold" style={{ color: "oklch(0.97 0.01 240)" }}>
                  {p.price ?? "—"}
                </span>
                <span className="text-xs" style={{ color: "oklch(0.60 0.04 265)" }}>{p.unit}</span>
              </div>
              <p className="text-sm mb-5" style={{ color: "oklch(0.65 0.04 265)" }}>{p.desc}</p>
              <ul className="space-y-2 flex-1 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "oklch(0.80 0.03 265)" }}>
                    <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "oklch(0.68 0.16 168)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/"
                hash="booking"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-all hover:opacity-90"
                style={
                  p.featured
                    ? { background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))", color: "oklch(0.97 0.01 240)" }
                    : { border: "1px solid oklch(0.40 0.08 280 / 0.7)", background: "oklch(0.25 0.06 280 / 0.5)", color: "oklch(0.85 0.03 265)" }
                }
              >
                Velg pakke <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {ADDONS.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border p-5"
              style={{ background: "oklch(0.18 0.04 280 / 0.7)", borderColor: "oklch(0.32 0.06 280 / 0.4)" }}
            >
              <p className="font-display text-base mb-1" style={{ color: "oklch(0.90 0.02 265)" }}>{a.title}</p>
              <p className="text-sm" style={{ color: "oklch(0.62 0.04 265)" }}>{a.body}</p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl border p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, oklch(0.62 0.18 280 / 0.12), oklch(0.52 0.16 168 / 0.10))",
            borderColor: "oklch(0.68 0.16 168 / 0.35)",
          }}
        >
          <div className="flex items-start gap-4 max-w-xl">
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.68 0.16 168 / 0.2)" }}
            >
              <Sparkles className="h-5 w-5" style={{ color: "oklch(0.68 0.16 168)" }} />
            </div>
            <div>
              <h3 className="font-display text-xl mb-1" style={{ color: "oklch(0.97 0.01 240)" }}>Spesielle behov?</h3>
              <p className="text-sm" style={{ color: "oklch(0.65 0.04 265)" }}>
                Russelåter, store prosjekter, label-arbeid eller noe helt annet? Ta direkte kontakt.
              </p>
            </div>
          </div>
          <Link
            to="/"
            hash="kontakt"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))",
              color: "oklch(0.97 0.01 240)",
            }}
          >
            Ta kontakt <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Reviews ────────────────────────────────────────────────────── */
const REVIEWS = [
  {
    name: "Torstein Skaar Einarsen",
    body: "Utrolig dyktig produsent og herlig studio. Anbefales på det sterkeste!",
    when: "for 2 uker siden",
    rating: 5,
  },
  {
    name: "Sigrid Svellingen Flatekvål",
    body: "Hyggelig kar 😎 Utrolig kult studio 🤩",
    when: "for 5 måneder siden",
    rating: 5,
  },
  {
    name: "Eiril Lægreid",
    body: "10/10",
    when: "for 7 måneder siden",
    rating: 5,
  },
];

function Reviews() {
  return (
    <section id="anmeldelser" className="relative py-28 px-5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>
            Anmeldelser
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold" style={{ color: "oklch(0.97 0.01 240)" }}>
            Hva folk sier{" "}
            <span className="text-gradient">etter økta.</span>
          </h2>
          <p className="mt-4 text-sm" style={{ color: "oklch(0.65 0.04 265)" }}>
            Hentet fra Google. Ekte stemmer, ekte sesjoner.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border p-6 flex flex-col"
              style={{
                background: "oklch(0.20 0.05 280 / 0.6)",
                borderColor: "oklch(0.32 0.06 280 / 0.5)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" style={{ color: "oklch(0.85 0.18 80)" }} />
                ))}
                <span className="ml-2 text-xs" style={{ color: "oklch(0.55 0.04 265)" }}>Google · 5/5</span>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "oklch(0.85 0.02 265)" }}>
                "{r.body}"
              </p>
              <div
                className="mt-5 pt-4 border-t flex items-center justify-between"
                style={{ borderColor: "oklch(0.32 0.06 280 / 0.4)" }}
              >
                <span className="font-display text-sm" style={{ color: "oklch(0.90 0.02 265)" }}>{r.name}</span>
                <span className="text-xs" style={{ color: "oklch(0.50 0.04 265)" }}>{r.when}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Booking ────────────────────────────────────────────────────── */
function toIcsDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function downloadIcs(name: string, service: string, date: string, message: string) {
  const start = toIcsDate(date);
  // Default 2-hour session; end = start + 2h
  const end = toIcsDate(new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000).toISOString());
  const uid = `${Date.now()}@liambakkestudios.no`;
  const now = toIcsDate(new Date().toISOString());

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Liam Bakke Studios//Booking//NO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Studio Session – ${service} @ Liam Bakke Studios`,
    `DESCRIPTION:Hei ${name}!\\nGleder oss til å se deg.\\n\\n${message || ""}`,
    "LOCATION:Liam Bakke Studios",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Påminnelse: Studio session i morgen!",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "liam-bakke-studios-booking.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function Booking() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name    = fd.get("name") as string;
    const service = fd.get("service") as string;
    const date    = fd.get("date") as string;
    const message = fd.get("message") as string;
    const body = [
      `Ny bookingforespørsel fra nettsiden`,
      ``,
      `Fra:      ${name}`,
      `Tjeneste: ${service}`,
      `Dato:     ${date || "Ikke oppgitt"}`,
      ``,
      `Melding:`,
      message || "Ingen melding",
      ``,
      `---`,
      `Svar direkte på denne e-posten for å bekrefte booking.`,
    ].join("\r\n");

    if (date) downloadIcs(name, service, date, message);
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`🎵 Booking – ${name} – ${service}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <section id="booking" className="relative py-28 px-5 overflow-hidden">
      {/* Forest glow bg */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, oklch(0.42 0.18 280 / 0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, oklch(0.58 0.12 75 / 0.15) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>
            Booking
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4" style={{ color: "oklch(0.97 0.01 240)" }}>
            La oss lage{" "}
            <span className="text-gradient">noe sykt.</span>
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "oklch(0.65 0.04 265)" }}>
            Fortell hva du jobber med, så svarer Liam innen 24 timer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border p-7 md:p-9"
          style={{
            background: "oklch(0.20 0.05 280 / 0.7)",
            borderColor: "oklch(0.40 0.10 280 / 0.6)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 80px -20px oklch(0.62 0.18 280 / 0.3)",
          }}
        >
          {sent ? (
            <div className="text-center py-8">
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))" }}
              >
                <Check className="h-8 w-8" style={{ color: "oklch(0.97 0.01 240)" }} />
              </div>
              <h3 className="font-display text-2xl mb-2" style={{ color: "oklch(0.97 0.01 240)" }}>E-post klar!</h3>
              <p className="text-sm" style={{ color: "oklch(0.65 0.04 265)" }}>
                E-postappen din åpnet seg med meldingen ferdig utfylt. Send den så svarer Liam innen 24 timer.
              </p>
              <p className="text-sm mt-2" style={{ color: "oklch(0.68 0.16 168)" }}>
                📅 Kalender-fil lastet ned — åpne den for å legge til i kalenderen din med påminnelse dagen før.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-sm underline"
                style={{ color: "oklch(0.68 0.16 168)" }}
              >
                Send ny forespørsel
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Navn" name="name" placeholder="Ditt navn" required />
                <FormField label="E-post" name="email" type="email" placeholder="deg@epost.no" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "oklch(0.65 0.04 265)" }}>Tjeneste</label>
                  <select
                    name="service"
                    defaultValue="Studio Pakke A"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background: "oklch(0.16 0.04 280)",
                      border: "1px solid oklch(0.32 0.06 280 / 0.6)",
                      color: "oklch(0.90 0.02 265)",
                    }}
                  >
                    {["Timepris", "Studio Pakke B", "Studio Pakke A", "Pakke Exclusive", "Custom beat", "Mix & master", "Russelåt", "Annet"].map((o) => (
                      <option key={o} style={{ background: "oklch(0.16 0.04 280)" }}>{o}</option>
                    ))}
                  </select>
                </div>
                <FormField label="Ønsket dato (valgfritt)" name="date" type="date" />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "oklch(0.65 0.04 265)" }}>Om prosjektet</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Sjanger, antall låter, referanser..."
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
                  style={{
                    background: "oklch(0.16 0.04 280)",
                    border: "1px solid oklch(0.32 0.06 280 / 0.6)",
                    color: "oklch(0.90 0.02 265)",
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-medium transition-all hover:opacity-90 active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))",
                  color: "oklch(0.97 0.01 240)",
                }}
              >
                Send forespørsel <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-xs text-center" style={{ color: "oklch(0.55 0.04 265)" }}>
                Foretrekker du å snakke direkte? Ring {PHONE} eller DM på Instagram.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function FormField({
  label, name, type = "text", placeholder, required,
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "oklch(0.65 0.04 265)" }}>{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{
          background: "oklch(0.16 0.04 280)",
          border: "1px solid oklch(0.32 0.06 280 / 0.6)",
          color: "oklch(0.90 0.02 265)",
        }}
      />
    </div>
  );
}

/* ─── Contact strip ──────────────────────────────────────────────── */
function ContactStrip() {
  const items = [
    { icon: Music2, label: "Instagram", value: "@liam_bakke", href: INSTAGRAM_URL },
    { icon: Music2, label: "Spotify", value: "liambakke", href: SPOTIFY_URL },
  ];

  return (
    <section id="kontakt" className="relative py-20 px-5 border-t" style={{ borderColor: "oklch(0.32 0.06 280 / 0.35)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "oklch(0.68 0.16 168)" }}>
            Kontakt
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold" style={{ color: "oklch(0.97 0.01 240)" }}>
            Plugger du{" "}
            <span className="text-gradient">inn?</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Telefon", value: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
            { label: "E-post", value: EMAIL, href: `mailto:${EMAIL}` },
            { label: "Instagram", value: "@liam_bakke", href: INSTAGRAM_URL },
            { label: "Spotify", value: "liambakke", href: SPOTIFY_URL },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="rounded-2xl border p-5 transition-all hover:-translate-y-0.5 overflow-hidden min-w-0"
              style={{
                background: "oklch(0.20 0.05 280 / 0.5)",
                borderColor: "oklch(0.32 0.06 280 / 0.5)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(0.68 0.16 168 / 0.5)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(0.32 0.06 280 / 0.5)"; }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "oklch(0.60 0.04 265)" }}>{c.label}</p>
              <p className="font-display text-sm truncate" style={{ color: "oklch(0.90 0.02 265)" }}>{c.value}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
