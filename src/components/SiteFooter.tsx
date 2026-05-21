import { Link, useNavigate } from "@tanstack/react-router";
import { Instagram, Music2, Mail, Phone } from "lucide-react";
import { EMAIL, PHONE, INSTAGRAM_URL, SPOTIFY_URL } from "@/lib/utils";
import logoFull from "@/assets/logo-full.png";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DinoGame } from "./DinoGame";

const LINKS = [
  { label: "Tjenester", to: "/", hash: "tjenester" },
  { label: "Priser", to: "/", hash: "priser" },
  { label: "Om Liam", to: "/om", hash: undefined },
  { label: "Akustikk", to: "/akustikk", hash: undefined },
  { label: "As featured", to: "/featured", hash: undefined },
  { label: "Booking", to: "/", hash: "booking" },
] as const;

function AdminPortal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const r = await fetch("/api/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, dates: [] }),
    });
    setLoading(false);
    if (r.ok) {
      navigate({ to: "/admin" });
    } else {
      setError("Feil passord");
      setPassword("");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "oklch(0.10 0.04 280 / 0.85)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="rounded-2xl border p-8 w-full max-w-xs"
        style={{
          background: "oklch(0.18 0.05 280)",
          borderColor: "oklch(0.32 0.06 280 / 0.5)",
        }}
      >
        <p className="text-xs uppercase tracking-widest font-semibold mb-5"
          style={{ color: "oklch(0.68 0.16 168)" }}>Admin</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "oklch(0.14 0.04 280)",
              border: "1px solid oklch(0.32 0.06 280 / 0.6)",
              color: "oklch(0.90 0.02 265)",
            }}
          />
          {error && <p className="text-xs" style={{ color: "oklch(0.65 0.18 25)" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))",
              color: "oklch(0.97 0.01 240)",
            }}
          >
            {loading ? "Sjekker…" : "Logg inn"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function SiteFooter() {
  const [clicks, setClicks]     = useState(0);
  const [showDino, setShowDino] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const keyBuffer = useRef("");

  // Listen for "liam" typed anywhere on the page
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      keyBuffer.current = (keyBuffer.current + e.key).slice(-4);
      if (keyBuffer.current.toLowerCase() === "liam") {
        setShowAdmin(true);
        keyBuffer.current = "";
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSecretClick() {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 5) { setShowDino(true); setClicks(0); }
  }

  return (
    <>
    <AnimatePresence>
      {showDino && <DinoGame onClose={() => setShowDino(false)} />}
      {showAdmin && <AdminPortal onClose={() => setShowAdmin(false)} />}
    </AnimatePresence>
    <footer
      className="relative border-t"
      style={{ borderColor: "oklch(0.32 0.06 280 / 0.4)", background: "oklch(0.13 0.04 280)" }}
    >
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src={logoFull} alt="Liam Bakke Studios" className="h-9" style={{ filter: "invert(1)" }} />
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.60 0.04 265)" }}>
              Profesjonelt innspillingsstudio for artister som tar musikken sin på alvor.
              Varme rom, presist utstyr, ekte resultater.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "oklch(0.68 0.16 168)" }}>
              Navigasjon
            </p>
            <ul className="space-y-2">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    hash={l.hash}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "oklch(0.65 0.04 265)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "oklch(0.68 0.16 168)" }}>
              Kontakt
            </p>
            <ul className="space-y-3">
              {[
                { icon: Phone, value: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
                { icon: Mail, value: EMAIL, href: `mailto:${EMAIL}` },
                { icon: Instagram, value: "@liam_bakke", href: INSTAGRAM_URL },
                { icon: Music2, value: "Spotify", href: SPOTIFY_URL },
              ].map(({ icon: Icon, value, href }) => (
                <li key={value} className="min-w-0">
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-sm transition-colors hover:text-white min-w-0"
                    style={{ color: "oklch(0.65 0.04 265)" }}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: "oklch(0.68 0.16 168)" }} />
                    <span className="truncate">{value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: "oklch(0.32 0.06 280 / 0.3)", color: "oklch(0.50 0.04 265)" }}
        >
          <span>
            ©{" "}
            <span
              onClick={handleSecretClick}
              className="cursor-default select-none"
              title=""
            >
              {new Date().getFullYear()}
            </span>
            {" "}Liam Bakke Studios — Enkeltpersonforetak
          </span>
          <div className="flex items-center gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href={SPOTIFY_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Spotify</a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
