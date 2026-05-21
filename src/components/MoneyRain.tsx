import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Bill({ id, x, delay, duration, rotation, scale, drift }: {
  id: number; x: number; delay: number; duration: number;
  rotation: number; scale: number; drift: number;
}) {
  return (
    <motion.div
      key={id}
      aria-hidden
      initial={{ y: -120, x: x + "vw", rotate: rotation, opacity: 0 }}
      animate={{
        y: "110vh",
        x: (x + drift) + "vw",
        rotate: rotation + (Math.random() > 0.5 ? 180 : -180),
        opacity: [0, 0.85, 0.85, 0],
      }}
      transition={{
        duration,
        delay,
        ease: "linear",
        opacity: { times: [0, 0.05, 0.85, 1], duration },
      }}
      style={{
        position: "fixed",
        top: 0,
        pointerEvents: "none",
        zIndex: 10,
        scale,
        originX: "50%",
        originY: "50%",
      }}
    >
      <BillSvg />
    </motion.div>
  );
}

function BillSvg() {
  return (
    <svg width="110" height="56" viewBox="0 0 110 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bill body — Norwegian 1000kr red/maroon */}
      <rect x="1" y="1" width="108" height="54" rx="3" fill="#8B1A1A" stroke="#5a0f0f" strokeWidth="1.2"/>
      {/* Background wave texture (simplified) */}
      <path d="M0 30 Q14 22 28 30 Q42 38 56 30 Q70 22 84 30 Q98 38 110 30" stroke="#a02020" strokeWidth="6" fill="none" opacity="0.4"/>
      <path d="M0 38 Q14 30 28 38 Q42 46 56 38 Q70 30 84 38 Q98 46 110 38" stroke="#a02020" strokeWidth="5" fill="none" opacity="0.3"/>
      {/* Inner border */}
      <rect x="3.5" y="3.5" width="103" height="49" rx="2" fill="none" stroke="#c44040" strokeWidth="0.7" strokeDasharray="3 1.5"/>
      {/* Left denomination block */}
      <rect x="6" y="6" width="22" height="16" rx="1.5" fill="#6e1515" opacity="0.8"/>
      <text x="17" y="18" textAnchor="middle" fill="#f5c0c0" fontSize="11" fontFamily="serif" fontWeight="bold">1000</text>
      {/* Right denomination block */}
      <rect x="82" y="34" width="22" height="16" rx="1.5" fill="#6e1515" opacity="0.8"/>
      <text x="93" y="46" textAnchor="middle" fill="#f5c0c0" fontSize="11" fontFamily="serif" fontWeight="bold">1000</text>
      {/* Center portrait area */}
      <ellipse cx="55" cy="28" rx="16" ry="14" fill="#7a1818" stroke="#c44040" strokeWidth="0.8"/>
      {/* Simplified lighthouse / sea motif in center */}
      <rect x="52" y="18" width="6" height="14" rx="1" fill="#d08080" opacity="0.9"/>
      <polygon points="52,18 58,18 55,14" fill="#e0a0a0" opacity="0.9"/>
      <rect x="50" y="30" width="10" height="3" rx="0.5" fill="#d08080" opacity="0.7"/>
      {/* NORGES BANK top center */}
      <text x="55" y="11" textAnchor="middle" fill="#f0b0b0" fontSize="5" fontFamily="serif" letterSpacing="1.5">NORGES BANK</text>
      {/* TUSEN KRONER bottom */}
      <text x="55" y="51" textAnchor="middle" fill="#f0b0b0" fontSize="5" fontFamily="serif" letterSpacing="1">TUSEN KRONER</text>
      {/* Serial number */}
      <text x="8" y="51" fill="#c07070" fontSize="4.2" fontFamily="monospace">LB{new Date().getFullYear()}1337</text>
      {/* Security hologram strip */}
      <rect x="68" y="4" width="5" height="48" rx="1" fill="url(#holo)" opacity="0.55"/>
      <defs>
        <linearGradient id="holo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#ffaaaa"/>
          <stop offset="33%"  stopColor="#ffddaa"/>
          <stop offset="66%"  stopColor="#aaffcc"/>
          <stop offset="100%" stopColor="#aaaaff"/>
        </linearGradient>
      </defs>
      {/* Norwegian coat of arms (simplified lion) */}
      <rect x="78" y="6" width="12" height="16" rx="2" fill="#6e1515" stroke="#c44040" strokeWidth="0.6"/>
      <text x="84" y="18" textAnchor="middle" fill="#f0b0b0" fontSize="10" fontFamily="serif">♛</text>
    </svg>
  );
}

function randomBill(id: number) {
  return {
    id,
    x: Math.random() * 96,
    delay: Math.random() * 3,
    duration: 3.5 + Math.random() * 3,
    rotation: -35 + Math.random() * 70,
    scale: 0.6 + Math.random() * 0.8,
    drift: -8 + Math.random() * 16,
  };
}

export function MoneyRain() {
  const [bills, setBills] = useState(() => Array.from({ length: 18 }, (_, i) => randomBill(i)));
  const [counter, setCounter] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(c => c + 1);
      setBills(prev => {
        // Replace oldest bill with a new one to keep constant rain
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = randomBill(Date.now() + idx);
        return next;
      });
    }, 380);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10 }} aria-hidden>
      <AnimatePresence>
        {bills.map(b => <Bill key={b.id} {...b} />)}
      </AnimatePresence>
    </div>
  );
}
