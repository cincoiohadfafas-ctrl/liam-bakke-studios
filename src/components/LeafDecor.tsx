import { motion, useScroll, useTransform, useMotionTemplate, MotionValue } from "framer-motion";
import { RainDrizzle } from "./RainDrizzle";

/* ─── Ivy leaf — proper 5-lobed Hedera helix shape ────────────────── */
function IvyLeaf({ s, variant = 0, op }: { s: number; variant?: number; op: number }) {
  const uid = `iv${s.toFixed(0)}v${variant}`;
  const p = (n: number) => n * s;

  // Color palette — fresh, deep shade, sun-exposed, new growth, aging, dying
  const palettes = [
    { light: "oklch(0.46 0.18 148)", dark: "oklch(0.28 0.14 142)", vein: "oklch(0.22 0.10 140)", shine: "oklch(0.60 0.14 152)" },
    { light: "oklch(0.38 0.15 152)", dark: "oklch(0.22 0.12 148)", vein: "oklch(0.18 0.09 148)", shine: "oklch(0.50 0.12 155)" },
    { light: "oklch(0.52 0.16 144)", dark: "oklch(0.34 0.13 138)", vein: "oklch(0.26 0.10 136)", shine: "oklch(0.64 0.14 148)" },
    { light: "oklch(0.60 0.18 134)", dark: "oklch(0.44 0.16 130)", vein: "oklch(0.34 0.12 128)", shine: "oklch(0.70 0.16 138)" },
    { light: "oklch(0.58 0.10 112)", dark: "oklch(0.42 0.12 118)", vein: "oklch(0.34 0.09 120)", shine: "oklch(0.68 0.08 108)" },
    { light: "oklch(0.50 0.10 82)",  dark: "oklch(0.36 0.10 92)",  vein: "oklch(0.28 0.08 90)",  shine: "oklch(0.60 0.08 78)"  },
  ];
  const { light, dark, vein, shine } = palettes[variant % palettes.length];

  // 5-lobed ivy path — sharp pointed lobes, deep sinuses, heart base
  const leaf = `
    M0,0
    C${p(0.08)},${p(-0.02)} ${p(0.30)},${p(0.05)} ${p(0.40)},${p(-0.10)}
    C${p(0.54)},${p(-0.26)} ${p(0.58)},${p(-0.48)} ${p(0.44)},${p(-0.54)}
    C${p(0.35)},${p(-0.58)} ${p(0.25)},${p(-0.52)} ${p(0.21)},${p(-0.62)}
    C${p(0.17)},${p(-0.72)} ${p(0.20)},${p(-0.80)} ${p(0.25)},${p(-0.88)}
    C${p(0.34)},${p(-1.00)} ${p(0.62)},${p(-1.06)} ${p(0.64)},${p(-1.28)}
    C${p(0.66)},${p(-1.48)} ${p(0.50)},${p(-1.58)} ${p(0.30)},${p(-1.52)}
    C${p(0.18)},${p(-1.48)} ${p(0.10)},${p(-1.54)} ${p(0.05)},${p(-1.58)}
    C${p(0.02)},${p(-1.64)} 0,${p(-1.70)} 0,${p(-1.70)}
    C0,${p(-1.70)} ${p(-0.02)},${p(-1.64)} ${p(-0.05)},${p(-1.58)}
    C${p(-0.10)},${p(-1.54)} ${p(-0.18)},${p(-1.48)} ${p(-0.30)},${p(-1.52)}
    C${p(-0.50)},${p(-1.58)} ${p(-0.66)},${p(-1.48)} ${p(-0.64)},${p(-1.28)}
    C${p(-0.62)},${p(-1.06)} ${p(-0.34)},${p(-1.00)} ${p(-0.25)},${p(-0.88)}
    C${p(-0.20)},${p(-0.80)} ${p(-0.17)},${p(-0.72)} ${p(-0.21)},${p(-0.62)}
    C${p(-0.25)},${p(-0.52)} ${p(-0.35)},${p(-0.58)} ${p(-0.44)},${p(-0.54)}
    C${p(-0.58)},${p(-0.48)} ${p(-0.54)},${p(-0.26)} ${p(-0.40)},${p(-0.10)}
    C${p(-0.30)},${p(0.05)} ${p(-0.08)},${p(-0.02)} 0,0 Z
  `;

  return (
    <g opacity={op}>
      <defs>
        <linearGradient id={`${uid}-g`} x1="30%" y1="100%" x2="65%" y2="0%">
          <stop offset="0%"   stopColor={dark} />
          <stop offset="45%"  stopColor={light} />
          <stop offset="100%" stopColor={light} stopOpacity="0.85" />
        </linearGradient>
        <filter id={`${uid}-sh`} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx={p(0.03)} dy={p(0.07)} stdDeviation={p(0.07)}
            floodColor="black" floodOpacity="0.40" />
        </filter>
      </defs>

      {/* Cast shadow */}
      <path d={leaf} fill="black" opacity="0.15"
        transform={`translate(${p(0.05)},${p(0.08)})`} />

      {/* Leaf body */}
      <path d={leaf} fill={`url(#${uid}-g)`} filter={`url(#${uid}-sh)`} />

      {/* Waxy surface sheen — diagonal highlight across upper portion */}
      <path
        d={`M${p(-0.22)},${p(-0.75)} C${p(-0.08)},${p(-1.10)} ${p(0.10)},${p(-1.30)} ${p(0.18)},${p(-1.55)}`}
        stroke={shine} strokeWidth={p(0.12)} strokeLinecap="round" fill="none" opacity="0.18"
      />
      {/* Secondary sheen */}
      <path
        d={`M${p(-0.38)},${p(-0.40)} C${p(-0.22)},${p(-0.62)} ${p(-0.10)},${p(-0.80)} ${p(0.04)},${p(-0.95)}`}
        stroke={shine} strokeWidth={p(0.08)} strokeLinecap="round" fill="none" opacity="0.12"
      />

      {/* ── Vein network ── */}
      {/* Central midrib — base to center lobe */}
      <path d={`M0,${p(-0.04)} L0,${p(-1.68)}`}
        stroke={vein} strokeWidth={p(0.062)} strokeLinecap="round" fill="none" opacity="0.70" />

      {/* Primary vein → right upper lobe */}
      <path d={`M0,${p(-0.38)} C${p(0.14)},${p(-0.55)} ${p(0.34)},${p(-0.75)} ${p(0.58)},${p(-1.14)}`}
        stroke={vein} strokeWidth={p(0.044)} strokeLinecap="round" fill="none" opacity="0.60" />
      {/* Primary vein → left upper lobe */}
      <path d={`M0,${p(-0.38)} C${p(-0.14)},${p(-0.55)} ${p(-0.34)},${p(-0.75)} ${p(-0.58)},${p(-1.14)}`}
        stroke={vein} strokeWidth={p(0.044)} strokeLinecap="round" fill="none" opacity="0.60" />

      {/* Primary vein → right base lobe */}
      <path d={`M0,${p(-0.10)} C${p(0.18)},${p(-0.18)} ${p(0.36)},${p(-0.28)} ${p(0.50)},${p(-0.42)}`}
        stroke={vein} strokeWidth={p(0.036)} strokeLinecap="round" fill="none" opacity="0.52" />
      {/* Primary vein → left base lobe */}
      <path d={`M0,${p(-0.10)} C${p(-0.18)},${p(-0.18)} ${p(-0.36)},${p(-0.28)} ${p(-0.50)},${p(-0.42)}`}
        stroke={vein} strokeWidth={p(0.036)} strokeLinecap="round" fill="none" opacity="0.52" />

      {/* Secondary veins — right upper lobe */}
      <path d={`M${p(0.22)},${p(-0.62)} C${p(0.34)},${p(-0.68)} ${p(0.46)},${p(-0.80)} ${p(0.54)},${p(-0.96)}`}
        stroke={vein} strokeWidth={p(0.022)} strokeLinecap="round" fill="none" opacity="0.38" />
      <path d={`M${p(0.38)},${p(-0.86)} C${p(0.48)},${p(-0.95)} ${p(0.55)},${p(-1.06)} ${p(0.58)},${p(-1.20)}`}
        stroke={vein} strokeWidth={p(0.018)} strokeLinecap="round" fill="none" opacity="0.32" />
      {/* Secondary veins — left upper lobe */}
      <path d={`M${p(-0.22)},${p(-0.62)} C${p(-0.34)},${p(-0.68)} ${p(-0.46)},${p(-0.80)} ${p(-0.54)},${p(-0.96)}`}
        stroke={vein} strokeWidth={p(0.022)} strokeLinecap="round" fill="none" opacity="0.38" />
      <path d={`M${p(-0.38)},${p(-0.86)} C${p(-0.48)},${p(-0.95)} ${p(-0.55)},${p(-1.06)} ${p(-0.58)},${p(-1.20)}`}
        stroke={vein} strokeWidth={p(0.018)} strokeLinecap="round" fill="none" opacity="0.32" />

      {/* Secondary veins — center lobe */}
      <path d={`M0,${p(-1.04)} C${p(0.08)},${p(-1.18)} ${p(0.14)},${p(-1.32)} ${p(0.16)},${p(-1.48)}`}
        stroke={vein} strokeWidth={p(0.018)} strokeLinecap="round" fill="none" opacity="0.34" />
      <path d={`M0,${p(-1.04)} C${p(-0.08)},${p(-1.18)} ${p(-0.14)},${p(-1.32)} ${p(-0.16)},${p(-1.48)}`}
        stroke={vein} strokeWidth={p(0.018)} strokeLinecap="round" fill="none" opacity="0.34" />

      {/* Secondary veins — base lobes */}
      <path d={`M${p(0.14)},${p(-0.22)} C${p(0.26)},${p(-0.28)} ${p(0.38)},${p(-0.32)} ${p(0.48)},${p(-0.38)}`}
        stroke={vein} strokeWidth={p(0.016)} strokeLinecap="round" fill="none" opacity="0.30" />
      <path d={`M${p(-0.14)},${p(-0.22)} C${p(-0.26)},${p(-0.28)} ${p(-0.38)},${p(-0.32)} ${p(-0.48)},${p(-0.38)}`}
        stroke={vein} strokeWidth={p(0.016)} strokeLinecap="round" fill="none" opacity="0.30" />

      {/* Tertiary vein mesh on main lobes */}
      {[
        [`M${p(0.10)},${p(-0.76)} C${p(0.20)},${p(-0.84)} ${p(0.28)},${p(-0.94)} ${p(0.34)},${p(-1.04)}`, 0.22],
        [`M${p(-0.10)},${p(-0.76)} C${p(-0.20)},${p(-0.84)} ${p(-0.28)},${p(-0.94)} ${p(-0.34)},${p(-1.04)}`, 0.22],
        [`M${p(0.28)},${p(-0.92)} C${p(0.36)},${p(-1.02)} ${p(0.44)},${p(-1.14)} ${p(0.48)},${p(-1.28)}`, 0.18],
        [`M${p(-0.28)},${p(-0.92)} C${p(-0.36)},${p(-1.02)} ${p(-0.44)},${p(-1.14)} ${p(-0.48)},${p(-1.28)}`, 0.18],
        [`M${p(0.04)},${p(-1.24)} C${p(0.10)},${p(-1.34)} ${p(0.14)},${p(-1.44)} ${p(0.16)},${p(-1.56)}`, 0.16],
        [`M${p(-0.04)},${p(-1.24)} C${p(-0.10)},${p(-1.34)} ${p(-0.14)},${p(-1.44)} ${p(-0.16)},${p(-1.56)}`, 0.16],
      ].map(([d, op], i) => (
        <path key={i} d={d as string} stroke={vein} strokeWidth={p(0.012)}
          strokeLinecap="round" fill="none" opacity={op as number} />
      ))}
    </g>
  );
}

/* ─── Petiole (leaf stalk) ─────────────────────────────────────────── */
function Petiole({ x1, y1, x2, y2, w }: { x1:number; y1:number; x2:number; y2:number; w:number }) {
  const mx = (x1+x2)/2 + (y2-y1)*0.25;
  const my = (y1+y2)/2 - (x2-x1)*0.25;
  return (
    <>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
        stroke="oklch(0.20 0.08 130)" strokeWidth={w+1.2} strokeLinecap="round" fill="none" opacity="0.45"/>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
        stroke="oklch(0.36 0.11 138)" strokeWidth={w} strokeLinecap="round" fill="none" opacity="0.88"/>
    </>
  );
}

/* ─── Stem node bump ───────────────────────────────────────────────── */
function Node({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r+1} fill="oklch(0.18 0.07 132)" opacity="0.40" />
      <circle cx={x} cy={y} r={r}   fill="oklch(0.30 0.10 138)" opacity="0.70" />
      <circle cx={x-r*0.3} cy={y-r*0.3} r={r*0.3} fill="oklch(0.44 0.08 145)" opacity="0.25" />
    </>
  );
}

/* ─── Single tendril curl ──────────────────────────────────────────── */
function Tendril({ x, y, dir = 1 }: { x: number; y: number; dir?: number }) {
  const d = dir;
  return (
    <path
      d={`M${x},${y}
         C${x+d*8},${y+10} ${x+d*16},${y+22} ${x+d*10},${y+36}
         C${x+d*4},${y+48} ${x-d*6},${y+52} ${x-d*8},${y+42}
         C${x-d*10},${y+34} ${x-d*4},${y+28} ${x+d*2},${y+32}`}
      stroke="oklch(0.36 0.12 142)" strokeWidth="1.1" strokeLinecap="round"
      fill="none" opacity="0.60"
    />
  );
}

/* ─── Aerial rootlet cluster ───────────────────────────────────────── */
function Rootlets({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.35">
      {[-4,-1,2,5].map((dx, i) => (
        <line key={i}
          x1={x+dx} y1={y}
          x2={x+dx+(i%2===0?2:-2)} y2={y+6+i*2}
          stroke="oklch(0.32 0.09 136)" strokeWidth="0.8" strokeLinecap="round"
        />
      ))}
    </g>
  );
}

/* ─── VineSvg — full ivy drape ─────────────────────────────────────── */
function VineSvg({ flip, width }: { flip?: boolean; width: number }) {
  const w = width;
  const h = 1000;

  // Main stem S-curve control points (as fractions of w)
  const ms = (fx: number, y: number) => `${w*fx},${y}`;

  // ── Stems ──────────────────────────────────────────────────────────
  // Main stem: thick woody vine, strong S-curve
  const mainStem = `M${ms(0.58,0)} C${ms(0.50,70)} ${ms(0.20,120)} ${ms(0.38,215)}
    C${ms(0.58,312)} ${ms(0.14,382)} ${ms(0.35,478)}
    C${ms(0.56,572)} ${ms(0.10,642)} ${ms(0.30,740)}
    C${ms(0.50,832)} ${ms(0.06,902)} ${ms(0.26,1000)}`;

  // Second main stem — slightly offset, thinner
  const stem2 = `M${ms(0.80,0)} C${ms(0.72,60)} ${ms(0.44,100)} ${ms(0.58,192)}
    C${ms(0.74,284)} ${ms(0.38,344)} ${ms(0.54,438)}
    C${ms(0.70,530)} ${ms(0.26,598)} ${ms(0.46,695)}
    C${ms(0.64,782)} ${ms(0.20,854)} ${ms(0.40,950)}`;

  // Tertiary outer stems — thin, young growth
  const stem3 = `M${ms(0.94,0)} C${ms(0.86,48)} ${ms(0.62,82)} ${ms(0.72,162)}
    C${ms(0.84,246)} ${ms(0.52,294)} ${ms(0.64,380)}
    C${ms(0.76,464)} ${ms(0.44,520)} ${ms(0.60,610)}`;
  const stem4 = `M${ms(0.44,0)} C${ms(0.36,52)} ${ms(0.14,90)} ${ms(0.26,170)}
    C${ms(0.38,248)} ${ms(0.06,308)} ${ms(0.20,395)}`;

  // Branch stems — grow off main stem
  const branch1 = `M${ms(0.38,215)} C${ms(0.50,228)} ${ms(0.70,238)} ${ms(0.80,258)} C${ms(0.88,274)} ${ms(0.86,296)} ${ms(0.76,308)}`;
  const branch2 = `M${ms(0.35,478)} C${ms(0.48,490)} ${ms(0.62,498)} ${ms(0.72,520)} C${ms(0.80,540)} ${ms(0.78,562)} ${ms(0.68,572)}`;
  const branch3 = `M${ms(0.30,740)} C${ms(0.44,748)} ${ms(0.58,752)} ${ms(0.66,772)}`;
  const branch4 = `M${ms(0.58,192)} C${ms(0.46,204)} ${ms(0.26,218)} ${ms(0.18,242)} C${ms(0.10,262)} ${ms(0.12,286)} ${ms(0.24,294)}`;

  // Helper: draw one stem with shadow + body + highlight
  function Stem({ d, sw, opacity = 1, youngColor = false }: {
    d: string; sw: number; opacity?: number; youngColor?: boolean;
  }) {
    const shadowColor = youngColor ? "oklch(0.18 0.07 130)" : "oklch(0.14 0.06 118)";
    const bodyColor   = youngColor ? "oklch(0.34 0.12 138)" : "oklch(0.26 0.09 128)";
    const hlColor     = youngColor ? "oklch(0.48 0.10 148)" : "oklch(0.38 0.07 140)";
    return (
      <>
        <path d={d} stroke={shadowColor} strokeWidth={sw+2.5} strokeLinecap="round" fill="none" opacity={opacity*0.45} />
        <path d={d} stroke={bodyColor}   strokeWidth={sw}     strokeLinecap="round" fill="none" opacity={opacity} />
        <path d={d} stroke={hlColor}     strokeWidth={sw*0.28} strokeLinecap="round" fill="none" opacity={opacity*0.28}
          strokeDasharray={`${sw*4} ${sw*14}`} />
      </>
    );
  }

  // ── Leaves ─────────────────────────────────────────────────────────
  type L = { cx: number; cy: number; s: number; rot: number; v: number; op: number };
  const leaves: L[] = [
    // main stem — large mature leaves
    { cx: w*0.36, cy: 205, s: 32, rot: -38, v: 0, op: 0.92 },
    { cx: w*0.32, cy: 285, s: 28, rot:  22, v: 1, op: 0.90 },
    { cx: w*0.42, cy: 390, s: 34, rot: -28, v: 0, op: 0.90 },
    { cx: w*0.28, cy: 468, s: 30, rot:  44, v: 2, op: 0.88 },
    { cx: w*0.38, cy: 570, s: 32, rot: -22, v: 1, op: 0.88 },
    { cx: w*0.24, cy: 650, s: 28, rot:  36, v: 0, op: 0.86 },
    { cx: w*0.34, cy: 748, s: 30, rot: -42, v: 2, op: 0.84 },
    { cx: w*0.20, cy: 835, s: 26, rot:  28, v: 1, op: 0.82 },
    { cx: w*0.30, cy: 918, s: 24, rot: -32, v: 0, op: 0.80 },

    // second stem leaves
    { cx: w*0.56, cy: 178, s: 22, rot:  52, v: 3, op: 0.78 },
    { cx: w*0.62, cy: 298, s: 20, rot: -46, v: 2, op: 0.76 },
    { cx: w*0.50, cy: 428, s: 22, rot:  30, v: 1, op: 0.74 },
    { cx: w*0.58, cy: 542, s: 20, rot: -55, v: 3, op: 0.72 },
    { cx: w*0.44, cy: 688, s: 22, rot:  38, v: 0, op: 0.70 },
    { cx: w*0.52, cy: 804, s: 18, rot: -30, v: 2, op: 0.68 },

    // branches — clustered leaves
    { cx: w*0.78, cy: 262, s: 18, rot: -20, v: 3, op: 0.70 },
    { cx: w*0.72, cy: 302, s: 16, rot:  40, v: 4, op: 0.65 },
    { cx: w*0.70, cy: 524, s: 18, rot: -35, v: 2, op: 0.68 },
    { cx: w*0.64, cy: 566, s: 16, rot:  25, v: 5, op: 0.62 },
    { cx: w*0.18, cy: 248, s: 16, rot:  55, v: 3, op: 0.65 },
    { cx: w*0.22, cy: 292, s: 14, rot: -44, v: 4, op: 0.60 },

    // outer thin stems — small young growth
    { cx: w*0.70, cy: 152, s: 14, rot:  62, v: 3, op: 0.62 },
    { cx: w*0.76, cy: 390, s: 12, rot: -40, v: 4, op: 0.58 },
    { cx: w*0.66, cy: 596, s: 14, rot:  22, v: 5, op: 0.55 },
    { cx: w*0.16, cy: 172, s: 12, rot: -58, v: 3, op: 0.55 },
    { cx: w*0.12, cy: 348, s: 11, rot:  34, v: 4, op: 0.50 },

    // depth/background leaves — small, faded
    { cx: w*0.85, cy: 122, s: 10, rot:  48, v: 1, op: 0.38 },
    { cx: w*0.80, cy: 468, s: 10, rot: -28, v: 2, op: 0.35 },
    { cx: w*0.08, cy: 420, s: 10, rot:  15, v: 0, op: 0.32 },
    { cx: w*0.90, cy: 688, s:  9, rot: -52, v: 3, op: 0.30 },
  ];

  // Petiole attachment points [stemX, stemY, leafCx, leafCy, w]
  const petioles: [number,number,number,number,number][] = [
    [w*0.40, 218, w*0.36, 205, 1.8],
    [w*0.36, 292, w*0.32, 285, 1.6],
    [w*0.36, 388, w*0.42, 390, 1.8],
    [w*0.33, 475, w*0.28, 468, 1.7],
    [w*0.37, 572, w*0.38, 570, 1.7],
    [w*0.29, 645, w*0.24, 650, 1.6],
    [w*0.32, 745, w*0.34, 748, 1.6],
    [w*0.52, 185, w*0.56, 178, 1.4],
    [w*0.56, 305, w*0.62, 298, 1.3],
    [w*0.78, 265, w*0.78, 262, 1.3],
    [w*0.18, 252, w*0.18, 248, 1.2],
  ];

  // Node positions along stems
  const nodes: [number,number,number][] = [
    [w*0.40,218,3.5],[w*0.36,388,4],[w*0.33,478,3.5],[w*0.37,572,3.5],
    [w*0.29,740,3.5],[w*0.56,192,3],[w*0.54,438,3],[w*0.46,695,3],
    [w*0.38,215,3],[w*0.35,478,3],[w*0.58,192,2.8],[w*0.54,438,2.8],
  ];

  // Rootlet clusters — where ivy grips the wall
  const rootlets: [number,number][] = [
    [w*0.42,310],[w*0.30,520],[w*0.38,700],[w*0.56,420],[w*0.48,610],
  ];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMin meet"
      width={w} height={h}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}
    >
      {/* ── Stems (back to front) ── */}
      <Stem d={stem4}   sw={1.8} opacity={0.55} youngColor />
      <Stem d={stem3}   sw={2.2} opacity={0.62} youngColor />
      <Stem d={branch4} sw={3.0} opacity={0.72} youngColor />
      <Stem d={branch3} sw={2.8} opacity={0.68} youngColor />
      <Stem d={stem2}   sw={4.5} opacity={0.80} />
      <Stem d={branch1} sw={3.5} opacity={0.75} youngColor />
      <Stem d={branch2} sw={3.2} opacity={0.72} youngColor />
      <Stem d={mainStem} sw={7.5} opacity={0.92} />

      {/* ── Node bumps at attachment points ── */}
      {nodes.map(([x, y, r], i) => <Node key={i} x={x} y={y} r={r} />)}

      {/* ── Aerial rootlets ── */}
      {rootlets.map(([x, y], i) => <Rootlets key={i} x={x} y={y} />)}

      {/* ── Petioles ── */}
      {petioles.map(([x1,y1,x2,y2,pw], i) => (
        <Petiole key={i} x1={x1} y1={y1} x2={x2} y2={y2} w={pw} />
      ))}

      {/* ── Leaves (back to front) ── */}
      {[...leaves].reverse().map(({ cx, cy, s, rot, v, op }, i) => (
        <g key={i} transform={`translate(${cx},${cy}) rotate(${rot})`}>
          <IvyLeaf s={s} variant={v} op={op} />
        </g>
      ))}

      {/* ── Tendrils ── */}
      {[
        { x: w*0.34, y: 208, dir:  1 },
        { x: w*0.30, y: 392, dir: -1 },
        { x: w*0.26, y: 572, dir:  1 },
        { x: w*0.22, y: 745, dir: -1 },
        { x: w*0.50, y: 302, dir:  1 },
        { x: w*0.46, y: 445, dir: -1 },
        { x: w*0.62, y: 192, dir:  1 },
        { x: w*0.76, y: 318, dir: -1 },
      ].map(({ x, y, dir }, i) => (
        <Tendril key={i} x={x} y={y} dir={dir} />
      ))}

      {/* ── Berry clusters (deep shade variant only on inner stems) ── */}
      {[{ x: w*0.32, y: 498 }, { x: w*0.26, y: 758 }, { x: w*0.54, y: 452 }].map(({ x, y }, i) => (
        <g key={i} opacity="0.78">
          {[[0,0,5.5],[9,6,4.5],[-7,9,5],[4,16,4],[-5,22,3.5],[10,20,4]].map(([dx,dy,r],j) => (
            <g key={j}>
              <line x1={x+dx*0.4} y1={y-12+dy*0.4} x2={x+dx} y2={y+dy}
                stroke="oklch(0.28 0.10 140)" strokeWidth="1.0" opacity="0.55"/>
              <circle cx={x+dx} cy={y+dy} r={(r as number)+1.0}
                fill="oklch(0.16 0.10 146)" opacity="0.38"/>
              <circle cx={x+dx} cy={y+dy} r={r as number}
                fill="oklch(0.36 0.20 152)" opacity="0.85"/>
              <circle cx={(x+dx)-(r as number)*0.35} cy={(y+dy)-(r as number)*0.35}
                r={(r as number)*0.30} fill="white" opacity="0.22"/>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ─── Vine (scroll-driven reveal wrapper) ─────────────────────────── */
function Vine({
  progress, triggerStart, triggerEnd, left, right, opacity, flip, width, zIndex = 0,
}: {
  progress: MotionValue<number>;
  triggerStart: number; triggerEnd: number;
  left?: string; right?: string;
  opacity: number; flip?: boolean; width: number; zIndex?: number;
}) {
  const solidEnd = useTransform(progress, [triggerStart, triggerEnd, 1], [0,  84, 100]);
  const tipFade  = useTransform(progress, [triggerStart, triggerEnd, 1], [0, 100, 100]);
  const mask     = useMotionTemplate`linear-gradient(to bottom, black 0%, black ${solidEnd}%, transparent ${tipFade}%)`;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed", top: 0, left, right,
        width: `${width}px`, height: "100vh",
        overflow: "hidden", pointerEvents: "none",
        zIndex, opacity,
        WebkitMaskImage: mask, maskImage: mask,
      }}
    >
      <VineSvg flip={flip} width={width} />
    </motion.div>
  );
}

/* ─── LeafDecor export ─────────────────────────────────────────────── */
export function LeafDecor() {
  const { scrollYProgress } = useScroll();
  return (
    <>
      <div aria-hidden style={{ position: "fixed", inset: 0, background: "oklch(0.14 0.04 280)", zIndex: -2 }} />
      <RainDrizzle />
      <Vine progress={scrollYProgress} triggerStart={0}    triggerEnd={0.65} left="-12px"  opacity={0.92} flip={false} width={150} />
      <Vine progress={scrollYProgress} triggerStart={0.02} triggerEnd={0.67} right="-12px" opacity={0.90} flip={true}  width={145} />
      <Vine progress={scrollYProgress} triggerStart={0.05} triggerEnd={0.72} left="90px"   opacity={0.65} flip={false} width={120} />
      <Vine progress={scrollYProgress} triggerStart={0.08} triggerEnd={0.75} right="85px"  opacity={0.62} flip={true}  width={115} />
      <Vine progress={scrollYProgress} triggerStart={0.15} triggerEnd={0.82} left="190px"  opacity={0.38} flip={false} width={95}  zIndex={0} />
      <Vine progress={scrollYProgress} triggerStart={0.18} triggerEnd={0.85} right="180px" opacity={0.35} flip={true}  width={90}  zIndex={0} />
    </>
  );
}
