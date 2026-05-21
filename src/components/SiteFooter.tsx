import { Link } from "@tanstack/react-router";
import { Instagram, Music2, Mail, Phone } from "lucide-react";
import { EMAIL, PHONE, INSTAGRAM_URL, SPOTIFY_URL } from "@/lib/utils";
import logoFull from "@/assets/logo-full.png";

const LINKS = [
  { label: "Tjenester", to: "/", hash: "tjenester" },
  { label: "Priser", to: "/", hash: "priser" },
  { label: "Om Liam", to: "/om", hash: undefined },
  { label: "Akustikk", to: "/akustikk", hash: undefined },
  { label: "As featured", to: "/featured", hash: undefined },
  { label: "Booking", to: "/", hash: "booking" },
] as const;

export function SiteFooter() {
  return (
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
          <span>© {new Date().getFullYear()} Liam Bakke Studios — Enkeltpersonforetak</span>
          <div className="flex items-center gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href={SPOTIFY_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Spotify</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
