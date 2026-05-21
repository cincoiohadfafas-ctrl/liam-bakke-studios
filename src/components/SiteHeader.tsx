import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoMark from "@/assets/logo-mark.png";

const NAV = [
  { label: "Tjenester", to: "/", hash: "tjenester", pulse: false },
  { label: "Beats", to: "/", hash: "portfolio", pulse: false },
  { label: "Priser", to: "/", hash: "priser", pulse: false },
  { label: "Anmeldelser", to: "/", hash: "anmeldelser", pulse: false },
  { label: "Akustikk", to: "/akustikk", hash: undefined, pulse: false },
  { label: "As featured", to: "/featured", hash: undefined, pulse: true },
  { label: "Om Liam", to: "/om", hash: undefined, pulse: false },
] as const;

const MOBILE_NAV = [
  { label: "Tjenester", to: "/", hash: "tjenester" },
  { label: "Beats", to: "/", hash: "portfolio" },
  { label: "Priser", to: "/", hash: "priser" },
  { label: "Anmeldelser", to: "/", hash: "anmeldelser" },
  { label: "Akustikk", to: "/akustikk", hash: undefined },
  { label: "As featured", to: "/featured", hash: undefined },
  { label: "Om Liam", to: "/om", hash: undefined },
  { label: "Kontakt", to: "/", hash: "kontakt" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [currentPath]);

  function handleNavClick(to: string, hash?: string) {
    setOpen(false);
    if (to === "/" && hash && currentPath === "/") {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "oklch(0.12 0.03 155 / 0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid oklch(0.32 0.06 280 / 0.4)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
            <img src={logoMark} alt="LBS" className="h-7 w-7" style={{ filter: "invert(1)" }} />
            <span
              className="font-display font-bold text-sm tracking-wide uppercase hidden sm:block"
              style={{ color: "oklch(0.97 0.01 240)" }}
            >
              Liam Bakke{" "}
              <span style={{ color: "oklch(0.68 0.16 168)" }}>Studios</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                onClick={() => handleNavClick(item.to, item.hash)}
                className="relative px-3 py-1.5 text-sm rounded-lg transition-colors"
                style={{ color: "oklch(0.70 0.04 265)" }}
                activeProps={{ style: { color: "oklch(0.97 0.01 240)" } }}
              >
                {item.pulse ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full animate-pulse"
                      style={{ background: "oklch(0.68 0.16 168)" }}
                    />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              hash="booking"
              onClick={() => handleNavClick("/", "booking")}
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))",
                color: "oklch(0.97 0.01 240)",
              }}
            >
              Book økt <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              aria-label={open ? "Lukk meny" : "Åpne meny"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              style={{
                border: "1px solid oklch(0.32 0.06 280 / 0.5)",
                background: "oklch(0.19 0.05 148 / 0.7)",
                color: "oklch(0.97 0.01 240)",
              }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: "oklch(0.10 0.03 155 / 0.8)", backdropFilter: "blur(8px)" }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-50 w-[min(82vw,300px)] flex flex-col"
              style={{
                background: "oklch(0.16 0.05 280)",
                borderLeft: "1px solid oklch(0.32 0.06 280 / 0.5)",
              }}
            >
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "oklch(0.32 0.06 280 / 0.4)" }}>
                <span className="font-display font-bold text-sm tracking-wide uppercase" style={{ color: "oklch(0.97 0.01 240)" }}>
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Lukk meny"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full transition-colors"
                  style={{ border: "1px solid oklch(0.32 0.06 280 / 0.5)", color: "oklch(0.70 0.04 265)" }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-col flex-1 p-5 gap-1 overflow-y-auto scrollbar-thin">
                {MOBILE_NAV.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={item.to}
                      hash={item.hash}
                      onClick={() => handleNavClick(item.to, item.hash)}
                      className="group flex items-center justify-between py-3.5 border-b font-display text-lg transition-colors"
                      style={{
                        borderColor: "oklch(0.32 0.06 280 / 0.3)",
                        color: "oklch(0.85 0.03 265)",
                      }}
                    >
                      <span>{item.label}</span>
                      <ArrowRight
                        className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                        style={{ color: "oklch(0.68 0.16 168)" }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="p-5 border-t" style={{ borderColor: "oklch(0.32 0.06 280 / 0.4)" }}>
                <Link
                  to="/"
                  hash="booking"
                  onClick={() => handleNavClick("/", "booking")}
                  className="flex items-center justify-center gap-2 rounded-full py-3 font-medium text-sm transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))",
                    color: "oklch(0.97 0.01 240)",
                  }}
                >
                  Book økt <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
