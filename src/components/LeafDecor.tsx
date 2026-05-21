import { motion, useScroll, useTransform, useMotionTemplate, MotionValue } from "framer-motion";

// True 5-lobed ivy leaf with layered shading, drop shadow and full vein network
function IvyLeaf({ s, variant = 0, op }: { s: number; variant?: number; op: number }) {
  const id = `ivy-${s}-${variant}`;
  // Color variants: dark green, mid green, slightly yellowed, blue-green
  const fills = [
    ["oklch(0.36 0.18 148)", "oklch(0.22 0.14 142)"],
    ["oklch(0.32 0.16 144)", "oklch(0.18 0.12 138)"],
    ["oklch(0.38 0.14 155)", "oklch(0.24 0.11 150)"],
    ["oklch(0.34 0.12 140)", "oklch(0.20 0.14 135)"],
    ["oklch(0.30 0.20 145)", "oklch(0.16 0.16 140)"],
  ];
  const [light, dark] = fills[variant % fills.length];
  const v = "oklch(0.26 0.09 140)"; // vein color

  // 5-lobed ivy leaf path scaled by s. Origin at petiole attachment.
  // Center lobe up, two side lobes, two lower lobes, heart-notched base.
  const p = (n: number) => n * s;
  const leaf = `
    M0,0
    C${p(0.12)},${p(-0.18)} ${p(0.30)},${p(-0.20)} ${p(0.40)},${p(-0.38)}
    C${p(0.52)},${p(-0.58)} ${p(0.44)},${p(-0.80)} ${p(0.28)},${p(-0.86)}
    C${p(0.18)},${p(-0.90)} ${p(0.08)},${p(-0.86)} ${p(0.04)},${p(-0.78)}
    C${p(0.16)},${p(-0.92)} ${p(0.22)},${p(-1.10)} ${p(0.14)},${p(-1.28)}
    C${p(0.06)},${p(-1.46)} ${p(-0.06)},${p(-1.54)} 0,${p(-1.66)}
    C${p(-0.06)},${p(-1.54)} ${p(-0.18)},${p(-1.46)} ${p(-0.14)},${p(-1.28)}
    C${p(-0.08)},${p(-1.10)} ${p(-0.04)},${p(-0.92)} ${p(-0.04)},${p(-0.78)}
    C${p(-0.12)},${p(-0.86)} ${p(-0.22)},${p(-0.90)} ${p(-0.32)},${p(-0.86)}
    C${p(-0.48)},${p(-0.80)} ${p(-0.56)},${p(-0.58)} ${p(-0.44)},${p(-0.38)}
    C${p(-0.34)},${p(-0.20)} ${p(-0.16)},${p(-0.18)} 0,0 Z
  `;

  return (
    <g opacity={op}>
      <defs>
        <radialGradient id={`${id}-grad`} cx="38%" cy="72%" r="65%" gradientUnits="userSpaceOnUse"
          x1="0" y1="0" x2={p(0.6)} y2={p(-1.6)}>
          <stop offset="0%"   stopColor={light}/>
          <stop offset="60%"  stopColor={dark}/>
          <stop offset="100%" stopColor={dark} stopOpacity="0.7"/>
        </radialGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={p(0.04)} dy={p(0.06)} stdDeviation={p(0.08)} floodColor="black" floodOpacity="0.35"/>
        </filter>
      </defs>

      {/* Shadow layer */}
      <path d={leaf} fill="black" opacity="0.18" transform={`translate(${p(0.04)},${p(0.06)})`}/>

      {/* Leaf body */}
      <path d={leaf} fill={`url(#${id}-grad)`}/>

      {/* Highlight along upper-center lobe */}
      <path
        d={`M0,${p(-0.85)} C${p(0.04)},${p(-1.10)} ${p(0.02)},${p(-1.35)} 0,${p(-1.62)}`}
        stroke={light} strokeWidth={p(0.06)} strokeLinecap="round" fill="none" opacity="0.22"
      />

      {/* ── Vein network ── */}
      {/* Central mid-rib */}
      <path d={`M0,0 C0,${p(-0.55)} 0,${p(-1.10)} 0,${p(-1.64)}`}
        stroke={v} strokeWidth={p(0.055)} strokeLinecap="round" fill="none" opacity="0.60"/>

      {/* Upper-lobe veins (branch from mid-rib ~60% up) */}
      <path d={`M0,${p(-0.95)} C${p(0.06)},${p(-1.10)} ${p(0.10)},${p(-1.24)} ${p(0.12)},${p(-1.40)}`}
        stroke={v} strokeWidth={p(0.032)} strokeLinecap="round" fill="none" opacity="0.48"/>
      <path d={`M0,${p(-0.95)} C${p(-0.06)},${p(-1.10)} ${p(-0.10)},${p(-1.24)} ${p(-0.12)},${p(-1.40)}`}
        stroke={v} strokeWidth={p(0.032)} strokeLinecap="round" fill="none" opacity="0.48"/>

      {/* Side-lobe veins (branch at ~45% up) */}
      <path d={`M0,${p(-0.60)} C${p(0.12)},${p(-0.68)} ${p(0.26)},${p(-0.70)} ${p(0.38)},${p(-0.80)}`}
        stroke={v} strokeWidth={p(0.030)} strokeLinecap="round" fill="none" opacity="0.44"/>
      <path d={`M0,${p(-0.60)} C${p(-0.12)},${p(-0.68)} ${p(-0.26)},${p(-0.70)} ${p(-0.38)},${p(-0.80)}`}
        stroke={v} strokeWidth={p(0.030)} strokeLinecap="round" fill="none" opacity="0.44"/>

      {/* Lower-lobe veins (branch at ~22% up) */}
      <path d={`M0,${p(-0.28)} C${p(0.14)},${p(-0.32)} ${p(0.28)},${p(-0.30)} ${p(0.38)},${p(-0.36)}`}
        stroke={v} strokeWidth={p(0.024)} strokeLinecap="round" fill="none" opacity="0.38"/>
      <path d={`M0,${p(-0.28)} C${p(-0.14)},${p(-0.32)} ${p(-0.28)},${p(-0.30)} ${p(-0.38)},${p(-0.36)}`}
        stroke={v} strokeWidth={p(0.024)} strokeLinecap="round" fill="none" opacity="0.38"/>

      {/* Tertiary veins on upper lobe */}
      <path d={`M${p(0.06)},${p(-1.12)} C${p(0.14)},${p(-1.18)} ${p(0.18)},${p(-1.26)} ${p(0.20)},${p(-1.36)}`}
        stroke={v} strokeWidth={p(0.016)} strokeLinecap="round" fill="none" opacity="0.28"/>
      <path d={`M${p(-0.06)},${p(-1.12)} C${p(-0.14)},${p(-1.18)} ${p(-0.18)},${p(-1.26)} ${p(-0.20)},${p(-1.36)}`}
        stroke={v} strokeWidth={p(0.016)} strokeLinecap="round" fill="none" opacity="0.28"/>

      {/* Subtle edge serrations — small notch lines */}
      {[-0.42,-0.28,-0.14,0.14,0.28,0.42].map((xf, i) => (
        <line key={i}
          x1={p(xf)} y1={p(-0.56)} x2={p(xf * 0.85)} y2={p(-0.48)}
          stroke={v} strokeWidth={p(0.012)} opacity="0.22"
        />
      ))}
    </g>
  );
}

// Short branching petiole connecting leaf to stem
function Petiole({ x1, y1, x2, y2, w: sw }: { x1:number; y1:number; x2:number; y2:number; w:number }) {
  const mx = (x1+x2)/2 + (y2-y1)*0.3;
  const my = (y1+y2)/2 - (x2-x1)*0.3;
  return (
    <>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
        stroke="oklch(0.32 0.10 138)" strokeWidth={sw + 0.8} strokeLinecap="round" fill="none" opacity="0.55"/>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
        stroke="oklch(0.48 0.10 144)" strokeWidth={sw} strokeLinecap="round" fill="none" opacity="0.80"/>
    </>
  );
}

function VineSvg({ flip, width }: { flip?: boolean; width: number }) {
  const h = 1000;
  const w = width;

  type LeafDef = { cx: number; cy: number; s: number; rot: number; v: number; op: number };
  const leaves: LeafDef[] = [
    // main stem — large leaves
    { cx: w*0.38, cy: 218, s: 30, rot: -32, v: 0, op: 0.90 },
    { cx: w*0.34, cy: 395, s: 32, rot:  28, v: 1, op: 0.88 },
    { cx: w*0.28, cy: 572, s: 28, rot: -20, v: 2, op: 0.86 },
    { cx: w*0.32, cy: 748, s: 30, rot:  42, v: 0, op: 0.84 },
    { cx: w*0.26, cy: 905, s: 24, rot: -28, v: 3, op: 0.82 },
    // cluster off-stem
    { cx: w*0.50, cy: 295, s: 22, rot:  58, v: 4, op: 0.76 },
    { cx: w*0.46, cy: 475, s: 20, rot: -52, v: 1, op: 0.78 },
    { cx: w*0.42, cy: 658, s: 24, rot:  35, v: 2, op: 0.74 },
    { cx: w*0.36, cy: 838, s: 18, rot: -38, v: 0, op: 0.72 },
    // second stem
    { cx: w*0.64, cy: 182, s: 18, rot:  45, v: 3, op: 0.68 },
    { cx: w*0.58, cy: 358, s: 16, rot: -55, v: 4, op: 0.65 },
    { cx: w*0.54, cy: 535, s: 18, rot:  30, v: 1, op: 0.62 },
    { cx: w*0.60, cy: 712, s: 16, rot: -42, v: 2, op: 0.60 },
    // outer thin stems
    { cx: w*0.76, cy: 155, s: 13, rot:  62, v: 0, op: 0.55 },
    { cx: w*0.70, cy: 428, s: 12, rot: -38, v: 3, op: 0.52 },
    { cx: w*0.74, cy: 608, s: 14, rot:  22, v: 4, op: 0.50 },
    // extra depth leaves
    { cx: w*0.22, cy: 320, s: 14, rot:  18, v: 2, op: 0.45 },
    { cx: w*0.18, cy: 488, s: 12, rot: -25, v: 1, op: 0.42 },
  ];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMin meet"
      width={w}
      height={h}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}
    >
      {/* ── Woody main stem with shadow + highlight ── */}
      <path
        d={`M${w*0.62} 0 C${w*0.52} 85 ${w*0.22} 135 ${w*0.40} 230
           C${w*0.60} 330 ${w*0.16} 392 ${w*0.36} 490
           C${w*0.56} 588 ${w*0.10} 650 ${w*0.30} 755
           C${w*0.50} 848 ${w*0.06} 915 ${w*0.26} 1000`}
        stroke="oklch(0.22 0.08 135)" strokeWidth="6.5" strokeLinecap="round" opacity="0.50"
      />
      <path
        d={`M${w*0.62} 0 C${w*0.52} 85 ${w*0.22} 135 ${w*0.40} 230
           C${w*0.60} 330 ${w*0.16} 392 ${w*0.36} 490
           C${w*0.56} 588 ${w*0.10} 650 ${w*0.30} 755
           C${w*0.50} 848 ${w*0.06} 915 ${w*0.26} 1000`}
        stroke="oklch(0.38 0.12 140)" strokeWidth="4.5" strokeLinecap="round"
      />
      <path
        d={`M${w*0.62} 0 C${w*0.52} 85 ${w*0.22} 135 ${w*0.40} 230
           C${w*0.60} 330 ${w*0.16} 392 ${w*0.36} 490
           C${w*0.56} 588 ${w*0.10} 650 ${w*0.30} 755`}
        stroke="oklch(0.55 0.08 148)" strokeWidth="1.2" strokeLinecap="round" opacity="0.22"
        strokeDasharray="8 22"
      />

      {/* ── Second stem ── */}
      <path
        d={`M${w*0.82} 0 C${w*0.75} 68 ${w*0.46} 108 ${w*0.60} 198
           C${w*0.76} 292 ${w*0.40} 352 ${w*0.56} 448
           C${w*0.72} 542 ${w*0.28} 608 ${w*0.48} 708
           C${w*0.66} 798 ${w*0.22} 866 ${w*0.42} 958`}
        stroke="oklch(0.28 0.09 138)" strokeWidth="4" strokeLinecap="round" opacity="0.45"
      />
      <path
        d={`M${w*0.82} 0 C${w*0.75} 68 ${w*0.46} 108 ${w*0.60} 198
           C${w*0.76} 292 ${w*0.40} 352 ${w*0.56} 448
           C${w*0.72} 542 ${w*0.28} 608 ${w*0.48} 708
           C${w*0.66} 798 ${w*0.22} 866 ${w*0.42} 958`}
        stroke="oklch(0.40 0.11 143)" strokeWidth="2.8" strokeLinecap="round" opacity="0.80"
      />

      {/* ── Thin outer stems ── */}
      <path
        d={`M${w*0.94} 0 C${w*0.87} 52 ${w*0.64} 88 ${w*0.74} 168
           C${w*0.87} 258 ${w*0.54} 308 ${w*0.68} 398
           C${w*0.82} 488 ${w*0.46} 542 ${w*0.62} 635`}
        stroke="oklch(0.36 0.09 144)" strokeWidth="2" strokeLinecap="round" opacity="0.60"
      />
      <path
        d={`M${w*0.42} 0 C${w*0.36} 58 ${w*0.16} 98 ${w*0.26} 178
           C${w*0.38} 258 ${w*0.08} 318 ${w*0.20} 408`}
        stroke="oklch(0.44 0.11 146)" strokeWidth="1.6" strokeLinecap="round" opacity="0.50"
      />

      {/* ── Petioles (leaf stalks) ── */}
      <Petiole x1={w*0.40} y1={230} x2={w*0.38} y2={218} w={1.6}/>
      <Petiole x1={w*0.36} y1={490} x2={w*0.34} y2={395} w={1.6}/>
      <Petiole x1={w*0.30} y1={755} x2={w*0.28} y2={572} w={1.5}/>
      <Petiole x1={w*0.40} y1={230} x2={w*0.50} y2={295} w={1.4}/>
      <Petiole x1={w*0.36} y1={490} x2={w*0.46} y2={475} w={1.3}/>
      <Petiole x1={w*0.60} y1={198} x2={w*0.64} y2={182} w={1.3}/>
      <Petiole x1={w*0.56} y1={448} x2={w*0.58} y2={358} w={1.2}/>

      {/* ── Leaves (back to front order) ── */}
      {[...leaves].reverse().map(({ cx, cy, s, rot, v, op }, i) => (
        <g key={`l-${i}`} transform={`translate(${cx},${cy}) rotate(${rot})`}>
          <IvyLeaf s={s} variant={v} op={op} />
        </g>
      ))}

      {/* ── Tendrils (tight spiral curls) ── */}
      {[
        { x: w*0.36, y: 220 }, { x: w*0.32, y: 400 }, { x: w*0.26, y: 580 },
        { x: w*0.48, y: 300 }, { x: w*0.44, y: 480 }, { x: w*0.56, y: 188 },
        { x: w*0.68, y: 168 }, { x: w*0.72, y: 440 },
      ].map(({ x, y }, i) => (
        <path
          key={`t-${i}`}
          d={`M${x},${y}
             C${x-10},${y+14} ${x+7},${y+28} ${x-4},${y+44}
             C${x-14},${y+58} ${x-4},${y+72} ${x+6},${y+64}
             C${x+12},${y+58} ${x+8},${y+50} ${x+4},${y+54}`}
          stroke="oklch(0.40 0.12 146)" strokeWidth="1.1" strokeLinecap="round"
          opacity="0.55" fill="none"
        />
      ))}

      {/* ── Berry/grape clusters ── */}
      {[{ x: w*0.34, y: 500 }, { x: w*0.28, y: 770 }].map(({ x, y }, i) => (
        <g key={`b-${i}`}>
          {/* Pedicle stems */}
          {[[0,0],[8,5],[-6,8],[3,14],[-4,20],[9,18]].map(([dx,dy],j) => (
            <line key={j} x1={x + dx*0.3} y1={y - 10 + dy*0.3} x2={x+dx} y2={y+dy}
              stroke="oklch(0.34 0.10 142)" strokeWidth="0.9" opacity="0.60"/>
          ))}
          {/* Berries with highlight */}
          {[
            [0,0,5],[8,5,4],[-6,8,4.5],[3,14,3.5],[-4,20,3],[9,18,3.5]
          ].map(([dx,dy,r],j) => (
            <g key={j}>
              <circle cx={x+dx} cy={y+dy} r={r+0.8} fill="oklch(0.20 0.12 148)" opacity="0.40"/>
              <circle cx={x+dx} cy={y+dy} r={r}     fill="oklch(0.38 0.18 150)" opacity="0.82"/>
              <circle cx={x+dx-r*0.3} cy={y+dy-r*0.3} r={r*0.28} fill="white" opacity="0.20"/>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

function Vine({
  progress,
  triggerStart,
  triggerEnd,
  left,
  right,
  opacity,
  flip,
  width,
  zIndex = 0,
}: {
  progress: MotionValue<number>;
  triggerStart: number;
  triggerEnd: number;
  left?: string;
  right?: string;
  opacity: number;
  flip?: boolean;
  width: number;
  zIndex?: number;
}) {
  // Grow reveal: solidEnd sweeps 0→100, tipFade slightly ahead.
  // Both lock at 100 after triggerEnd so they never fade back.
  const solidEnd = useTransform(progress, [triggerStart, triggerEnd, 1], [0,  84, 100]);
  const tipFade  = useTransform(progress, [triggerStart, triggerEnd, 1], [0, 100, 100]);
  const mask     = useMotionTemplate`linear-gradient(to bottom, black 0%, black ${solidEnd}%, transparent ${tipFade}%)`;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left,
        right,
        width: `${width}px`,
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex,
        opacity,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <VineSvg flip={flip} width={width} />
    </motion.div>
  );
}

export function LeafDecor() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* Explicit background sits below vines */}
      <div aria-hidden style={{ position: "fixed", inset: 0, background: "oklch(0.14 0.04 280)", zIndex: -2 }} />
      <Vine progress={scrollYProgress} triggerStart={0}    triggerEnd={0.65} left="-12px"  opacity={0.92} flip={false} width={150} />
      <Vine progress={scrollYProgress} triggerStart={0.02} triggerEnd={0.67} right="-12px" opacity={0.90} flip={true}  width={145} />
      <Vine progress={scrollYProgress} triggerStart={0.05} triggerEnd={0.72} left="90px"   opacity={0.65} flip={false} width={120} />
      <Vine progress={scrollYProgress} triggerStart={0.08} triggerEnd={0.75} right="85px"  opacity={0.62} flip={true}  width={115} />
      <Vine progress={scrollYProgress} triggerStart={0.15} triggerEnd={0.82} left="190px"  opacity={0.38} flip={false} width={95}  zIndex={0} />
      <Vine progress={scrollYProgress} triggerStart={0.18} triggerEnd={0.85} right="180px" opacity={0.35} flip={true}  width={90}  zIndex={0} />
    </>
  );
}
