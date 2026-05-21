import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

/* ── Seeded random ───────────────────────────────────────────────── */
const sr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };

/* ── Branch path data ────────────────────────────────────────────── */
// All paths share the same SVG coordinate space (viewBox "0 0 900 900")
// Trunk base sits at (450, 910).

const TRUNK =
  "M450,910 C447,868 440,822 434,778 C426,730 420,695 422,660 C424,626 432,598 437,570 C441,544 443,520 440,496";

const MAIN: [string, number][] = [
  // [path, strokeWidth]
  ["M440,496 C420,472 395,450 365,424 C335,398 300,374 262,346", 11],
  ["M440,496 C428,468 414,444 400,416 C385,386 370,356 352,324", 10],
  ["M440,496 C453,468 468,444 482,416 C496,386 510,356 528,324", 10],
  ["M440,496 C462,472 488,450 516,424 C544,398 574,374 608,346", 11],
];

const SECONDARY: [string, number][] = [
  // From far-left branch (~262,346)
  ["M262,346 C240,322 215,300 188,274 C165,252 142,230 116,206", 7],
  ["M262,346 C252,316 242,288 232,258 C222,230 212,202 204,172", 7],
  // From left-center branch midpoint (~400,416) and end (~352,324)
  ["M352,324 C332,298 310,274 288,248 C268,226 248,202 228,176", 7],
  ["M352,324 C364,298 374,272 382,244 C390,218 394,190 396,162", 6],
  // From right-center branch midpoint and end (~528,324)
  ["M528,324 C548,298 570,274 592,248 C612,226 632,202 652,176", 7],
  ["M528,324 C516,298 506,272 498,244 C490,218 486,190 484,162", 6],
  // From far-right branch (~608,346)
  ["M608,346 C630,322 654,300 678,274 C700,252 722,230 744,206", 7],
  ["M608,346 C620,316 630,288 638,258 C646,230 652,202 658,172", 7],
];

const TWIGS: [string, number][] = [
  // From left ends
  ["M116,206 C100,186 82,166 65,144 C52,126 40,108 28,88", 4],
  ["M116,206 C118,182 120,158 124,134 C128,112 134,90 140,68", 4],
  ["M188,274 C170,252 150,232 130,210", 4],
  ["M204,172 C190,150 174,130 158,108 C146,90 135,72 124,54", 4],
  ["M228,176 C212,154 194,132 176,110 C162,92 148,74 134,56", 4],
  ["M396,162 C390,138 382,114 374,90 C368,70 362,52 354,34", 4],
  ["M396,162 C406,138 416,114 424,90", 4],
  ["M484,162 C490,138 494,114 496,90 C498,70 498,52 496,34", 4],
  ["M484,162 C474,138 464,114 456,90", 4],
  ["M652,176 C668,154 686,132 704,110 C718,92 730,74 742,56", 4],
  ["M652,176 C648,152 644,128 642,104 C640,84 640,64 640,44", 4],
  ["M744,206 C762,186 778,166 792,144 C804,126 814,108 822,88", 4],
  ["M744,206 C748,182 750,158 750,134 C750,112 748,90 744,68", 4],
  ["M658,172 C664,148 668,124 670,100 C672,80 672,60 670,40", 4],
  // Center extras
  ["M288,248 C272,226 254,204 236,182 C222,164 208,146 194,128", 4],
  ["M228,176 C238,152 248,128 256,104", 4],
  ["M382,244 C374,220 365,196 356,172", 4],
];

/* ── Blossom cluster positions [cx, cy, r, intensity] ────────────── */
const CLUSTERS: [number, number, number, number][] = [
  // Far left canopy
  [70,80,52,1],[42,72,38,0.8],[110,60,42,0.9],[130,92,36,0.75],
  [88,42,30,0.7],[148,68,28,0.65],[56,110,32,0.7],
  // Left canopy
  [200,168,46,1],[175,144,38,0.85],[222,148,34,0.8],
  [165,192,30,0.7],[245,128,32,0.75],[182,120,28,0.7],
  // Left-center canopy
  [232,170,42,0.95],[210,148,34,0.8],[255,148,32,0.75],
  [290,138,38,0.85],[308,122,28,0.7],[268,118,26,0.65],
  // Center canopy
  [358,32,44,0.95],[375,52,38,0.88],[340,58,34,0.8],
  [396,42,30,0.75],[320,46,28,0.7],[395,82,26,0.6],
  [480,42,44,0.95],[462,62,38,0.88],[500,52,32,0.8],
  [456,28,28,0.72],[518,78,26,0.65],
  // Right-center canopy
  [558,148,42,0.95],[538,128,34,0.8],[580,128,32,0.75],
  [615,140,38,0.85],[598,118,28,0.7],[560,112,26,0.65],
  // Right canopy
  [700,168,46,1],[678,144,38,0.85],[722,148,34,0.8],
  [712,186,30,0.7],[654,140,32,0.72],[740,122,28,0.68],
  // Far right canopy
  [780,82,52,1],[808,72,38,0.8],[752,60,42,0.88],[732,90,36,0.75],
  [820,50,30,0.7],[760,42,28,0.65],[798,108,32,0.68],
  // Along branches (mid-tree blossoms)
  [130,200,28,0.6],[160,230,24,0.55],[240,260,26,0.55],
  [660,200,28,0.6],[695,230,24,0.55],[620,260,26,0.55],
  [350,320,22,0.5],[440,310,24,0.5],[530,320,22,0.5],
];

/* ── Falling petal config ─────────────────────────────────────────── */
const PETALS = Array.from({ length: 28 }, (_, i) => ({
  left:     `${3 + sr(i * 4 + 1) * 92}%`,
  size:     5 + sr(i * 4 + 2) * 6,
  dur:      7 + sr(i * 4 + 3) * 9,
  delay:    -(sr(i * 4 + 4) * 16),
  sway:     `${(sr(i * 4 + 5) > 0.5 ? 1 : -1) * (25 + sr(i * 4 + 6) * 55)}px`,
  rotate:   `${sr(i * 4 + 7) * 540}deg`,
  hue:      340 + sr(i * 4 + 8) * 28,
  light:    0.78 + sr(i * 4 + 9) * 0.14,
}));

/* ── Branch component ────────────────────────────────────────────── */
function Branch({
  d, sw, pathLen, color = "#1e1e2a",
}: {
  d: string; sw: number; pathLen: MotionValue<number>; color?: string;
}) {
  return (
    <>
      {/* Thick shadow pass */}
      <motion.path d={d} stroke="#0a0a12" strokeWidth={sw + 3} fill="none"
        strokeLinecap="round" opacity={0.5} style={{ pathLength: pathLen }} />
      {/* Main branch */}
      <motion.path d={d} stroke={color} strokeWidth={sw} fill="none"
        strokeLinecap="round" style={{ pathLength: pathLen }} />
      {/* Inner highlight */}
      <motion.path d={d} stroke="#2e2e40" strokeWidth={sw * 0.35} fill="none"
        strokeLinecap="round" opacity={0.4} style={{ pathLength: pathLen }} />
    </>
  );
}

/* ── Blossom cluster component ───────────────────────────────────── */
function BlossomCluster({
  cx, cy, r, bloom, id,
}: {
  cx: number; cy: number; r: number; bloom: MotionValue<number>; id: number;
}) {
  const gid = `bcg-${id}`;
  return (
    <motion.g style={{ opacity: bloom }}>
      {/* Outer ambient glow */}
      <circle cx={cx} cy={cy} r={r * 2.2}
        fill={`url(#${gid}-outer)`} opacity={0.35} />
      {/* Mid bloom mass */}
      <circle cx={cx} cy={cy} r={r * 1.5}
        fill={`url(#${gid}-mid)`} opacity={0.55} />
      {/* Dense core */}
      <circle cx={cx} cy={cy} r={r}
        fill={`url(#${gid}-core)`} opacity={0.7} />
      {/* A few individual petal silhouettes */}
      {[0,72,144,216,288].map((a, pi) => {
        const rad = (a * Math.PI) / 180;
        const pr = r * 0.7;
        const px = cx + Math.cos(rad) * pr * 0.6;
        const py = cy + Math.sin(rad) * pr * 0.6;
        return (
          <ellipse key={pi} cx={px} cy={py}
            rx={r * 0.38} ry={r * 0.26}
            transform={`rotate(${a + 20},${px},${py})`}
            fill={`oklch(0.92 0.08 ${352 + (pi * 7)})`}
            opacity={0.45} />
        );
      })}
      <defs>
        <radialGradient id={`${gid}-outer`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="oklch(0.88 0.12 350)" />
          <stop offset="100%" stopColor="oklch(0.80 0.10 350)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gid}-mid`} cx="45%" cy="45%" r="55%">
          <stop offset="0%"   stopColor="oklch(0.93 0.09 355)" />
          <stop offset="70%"  stopColor="oklch(0.82 0.13 348)" />
          <stop offset="100%" stopColor="oklch(0.75 0.11 345)" stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id={`${gid}-core`} cx="40%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="oklch(0.97 0.05 358)" />
          <stop offset="50%"  stopColor="oklch(0.88 0.11 352)" />
          <stop offset="100%" stopColor="oklch(0.78 0.15 345)" />
        </radialGradient>
      </defs>
    </motion.g>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */
export function CherryBlossomTree() {
  const { scrollYProgress } = useScroll();
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (styleRef.current) return;
    const s = document.createElement("style");
    s.textContent = `
      @keyframes sakuraDrift {
        0%   { opacity:0; transform: translateY(-20px) translateX(0px) rotate(0deg); }
        6%   { opacity:0.85; }
        90%  { opacity:0.6; }
        100% { opacity:0; transform: translateY(105vh) translateX(var(--sw)) rotate(var(--sr)); }
      }
    `;
    document.head.appendChild(s);
    styleRef.current = s;
    return () => { s.remove(); styleRef.current = null; };
  }, []);

  // Scroll-driven growth stages
  const trunkLen    = useTransform(scrollYProgress, [0.00, 0.14], [0, 1]);
  const mainLen     = useTransform(scrollYProgress, [0.10, 0.32], [0, 1]);
  const secLen      = useTransform(scrollYProgress, [0.27, 0.52], [0, 1]);
  const twigLen     = useTransform(scrollYProgress, [0.45, 0.68], [0, 1]);
  const bloomOp     = useTransform(scrollYProgress, [0.58, 0.84], [0, 1]);
  const glowOp      = useTransform(scrollYProgress, [0.62, 0.92], [0, 0.45]);
  const petalOp     = useTransform(scrollYProgress, [0.65, 0.88], [0, 1]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(900px, 100vw)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Falling petals */}
      <motion.div style={{ opacity: petalOp }}>
        {PETALS.map((p, i) => (
          <div key={i} style={{
            position: "fixed",
            top: 0,
            left: p.left,
            width:  p.size,
            height: p.size * 0.65,
            borderRadius: "50% 0 50% 0",
            background: `oklch(${p.light} 0.10 ${p.hue} / 0.75)`,
            animation: `sakuraDrift ${p.dur}s ${p.delay}s infinite linear`,
            ["--sw" as string]: p.sway,
            ["--sr" as string]: p.rotate,
          }} />
        ))}
      </motion.div>

      <svg viewBox="0 0 900 920" width="100%" xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}>
        <defs>
          <filter id="ck-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="18" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="ck-canopy" cx="50%" cy="60%" r="50%">
            <stop offset="0%"   stopColor="oklch(0.82 0.14 350)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.72 0.10 345)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient canopy glow behind everything */}
        <motion.ellipse cx={440} cy={280} rx={380} ry={260}
          fill="url(#ck-canopy)" filter="url(#ck-glow)"
          style={{ opacity: glowOp }} />

        {/* ── Branches ── */}
        <g opacity={0.88}>
          <Branch d={TRUNK} sw={22} pathLen={trunkLen} />
          {MAIN.map(([d, sw], i) => (
            <Branch key={i} d={d} sw={sw} pathLen={mainLen} />
          ))}
          {SECONDARY.map(([d, sw], i) => (
            <Branch key={i} d={d} sw={sw} pathLen={secLen} />
          ))}
          {TWIGS.map(([d, sw], i) => (
            <Branch key={i} d={d} sw={sw} pathLen={twigLen} />
          ))}
        </g>

        {/* ── Blossoms ── */}
        <g>
          {CLUSTERS.map(([cx, cy, r, intensity], i) => (
            <BlossomCluster
              key={i} cx={cx} cy={cy} r={r} id={i}
              bloom={useTransform(bloomOp, [0, 1], [0, intensity as number])}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
