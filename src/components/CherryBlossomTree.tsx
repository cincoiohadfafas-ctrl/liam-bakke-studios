import { useEffect, useRef } from "react";

const PETALS = Array.from({ length: 22 }, (_, i) => {
  const rand = (s: number) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
  return {
    left:     `${5 + rand(i * 3 + 1) * 90}%`,
    size:     6 + rand(i * 3 + 2) * 6,
    duration: 6 + rand(i * 3 + 3) * 8,
    delay:    -rand(i * 7 + 4) * 14,
    sway:     30 + rand(i * 3 + 5) * 50,
    rotate:   rand(i * 3 + 6) * 360,
  };
});

export function CherryBlossomTree() {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (styleRef.current) return;
    const style = document.createElement("style");
    style.textContent = `
      @keyframes petalFall {
        0%   { transform: translateY(-40px) rotate(0deg) translateX(0px); opacity: 0; }
        8%   { opacity: 1; }
        88%  { opacity: 0.7; }
        100% { transform: translateY(100vh) rotate(var(--pr)) translateX(var(--sway)); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => { style.remove(); styleRef.current = null; };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-55%)",
        zIndex: 0,
        pointerEvents: "none",
        width: "min(680px, 95vw)",
      }}
    >
      {/* Falling petals */}
      {PETALS.map((p, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            top: 0,
            left: p.left,
            width: p.size,
            height: p.size * 0.7,
            borderRadius: "50% 0 50% 0",
            background: `oklch(0.82 0.10 350 / 0.7)`,
            animation: `petalFall ${p.duration}s ${p.delay}s infinite linear`,
            ["--pr" as string]: `${p.rotate}deg`,
            ["--sway" as string]: `${p.sway}px`,
          }}
        />
      ))}

      {/* Tree SVG */}
      <svg
        viewBox="0 0 680 720"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="blossomGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="oklch(0.90 0.12 350)" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="oklch(0.78 0.14 350)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.70 0.10 350)" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="trunkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Trunk ── */}
        <g opacity="0.55" filter="url(#trunkGlow)">
          {/* Main trunk */}
          <path d="M340,720 C338,680 330,640 325,600 C318,550 310,510 308,470 C305,430 315,400 320,370"
            stroke="#2a1a0e" strokeWidth="28" strokeLinecap="round" fill="none" />
          <path d="M340,720 C338,680 330,640 325,600 C318,550 310,510 308,470 C305,430 315,400 320,370"
            stroke="#3d2818" strokeWidth="20" strokeLinecap="round" fill="none" />
          <path d="M340,720 C338,680 330,640 325,600 C318,550 310,510 308,470 C305,430 315,400 320,370"
            stroke="#4a3020" strokeWidth="12" strokeLinecap="round" fill="none" />

          {/* Left main branch */}
          <path d="M320,370 C305,340 280,310 250,280 C225,255 195,240 170,220"
            stroke="#2a1a0e" strokeWidth="20" strokeLinecap="round" fill="none" />
          <path d="M320,370 C305,340 280,310 250,280 C225,255 195,240 170,220"
            stroke="#4a3020" strokeWidth="12" strokeLinecap="round" fill="none" />

          {/* Right main branch */}
          <path d="M318,380 C335,350 360,315 390,285 C415,260 445,245 470,220"
            stroke="#2a1a0e" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M318,380 C335,350 360,315 390,285 C415,260 445,245 470,220"
            stroke="#4a3020" strokeWidth="11" strokeLinecap="round" fill="none" />

          {/* Left sub-branches */}
          <path d="M250,280 C235,255 215,235 195,205 C180,185 165,165 148,145"
            stroke="#3d2818" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M250,280 C235,255 215,235 195,205 C180,185 165,165 148,145"
            stroke="#4a3020" strokeWidth="7" strokeLinecap="round" fill="none" />

          <path d="M200,245 C185,220 165,200 145,175 C130,158 115,140 100,120"
            stroke="#3d2818" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M200,245 C185,220 165,200 145,175 C130,158 115,140 100,120"
            stroke="#4a3020" strokeWidth="6" strokeLinecap="round" fill="none" />

          <path d="M170,220 C155,200 140,178 125,155 C112,136 100,115 88,95"
            stroke="#3d2818" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Right sub-branches */}
          <path d="M390,285 C405,258 420,230 440,205 C455,185 470,165 488,145"
            stroke="#3d2818" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M390,285 C405,258 420,230 440,205 C455,185 470,165 488,145"
            stroke="#4a3020" strokeWidth="6" strokeLinecap="round" fill="none" />

          <path d="M445,245 C460,220 478,198 498,175 C514,157 530,138 548,118"
            stroke="#3d2818" strokeWidth="10" strokeLinecap="round" fill="none" />

          <path d="M470,220 C485,198 500,175 518,152 C532,133 548,112 562,92"
            stroke="#3d2818" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Upward branch from trunk */}
          <path d="M312,440 C295,415 278,390 268,360 C258,332 255,305 248,275"
            stroke="#3d2818" strokeWidth="11" strokeLinecap="round" fill="none" />

          <path d="M308,490 C290,465 272,445 260,415 C250,390 245,360 238,330"
            stroke="#3d2818" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Fine twigs */}
          {[
            "M148,145 C138,128 125,112 112,95",
            "M148,145 C158,128 168,112 178,96",
            "M100,120 C90,104 80,88 72,72",
            "M88,95 C80,78 74,62 68,46",
            "M488,145 C498,128 510,112 522,97",
            "M488,145 C478,128 465,112 452,97",
            "M548,118 C556,102 564,86 572,70",
            "M562,92 C570,76 578,60 585,44",
            "M248,275 C238,256 228,238 218,218",
            "M248,275 C258,256 268,238 278,218",
            "M238,330 C225,312 215,295 205,276",
          ].map((d, i) => (
            <path key={i} d={d} stroke="#3d2818" strokeWidth="5" strokeLinecap="round" fill="none" />
          ))}
        </g>

        {/* ── Blossom clusters ── */}
        <g opacity="0.72" filter="url(#softGlow)">
          {[
            // [cx, cy, r] — cluster center and radius
            [148,130,38],[100,105,32],[88,80,28],[72,60,24],[68,36,20],
            [178,88,26],[112,82,22],
            [170,200,30],[145,162,26],
            [488,130,36],[522,82,28],[572,56,22],[585,32,18],
            [452,84,24],[465,98,22],
            [248,260,32],[218,205,26],[205,260,24],
            [278,205,22],[238,315,26],
            [340,355,30],[320,345,24],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r * 1.4} fill="url(#blossomGlow)" opacity="0.5" />
              <circle cx={cx} cy={cy} r={r} fill="oklch(0.85 0.11 350)" opacity="0.55" />
              <circle cx={cx} cy={cy} r={r * 0.55} fill="oklch(0.92 0.08 355)" opacity="0.6" />
            </g>
          ))}
        </g>

        {/* ── Individual blossoms scattered at tips ── */}
        <g opacity="0.65">
          {[
            [148,132],[132,110],[165,108],[108,88],[85,72],[62,52],[74,42],[92,38],
            [178,90],[190,76],[170,68],
            [490,132],[508,108],[525,88],[555,64],[575,50],[590,36],[580,22],
            [450,90],[468,76],[485,62],
            [245,262],[228,240],[212,215],[200,192],
            [275,210],[260,190],[240,170],
            [205,262],[220,278],
            [338,360],[352,342],[325,338],
          ].map(([cx, cy], i) => (
            <Blossom key={i} cx={cx} cy={cy} seed={i} />
          ))}
        </g>
      </svg>
    </div>
  );
}

function Blossom({ cx, cy, seed }: { cx: number; cy: number; seed: number }) {
  const rand = (s: number) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
  const size  = 5 + rand(seed * 3 + 1) * 5;
  const angle = rand(seed * 3 + 2) * 360;
  const pink1 = `oklch(${0.82 + rand(seed) * 0.10} ${0.10 + rand(seed * 2) * 0.08} ${340 + rand(seed * 5) * 30})`;
  const pink2 = `oklch(${0.90 + rand(seed * 2) * 0.08} 0.06 355)`;

  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`} opacity={0.7 + rand(seed) * 0.3}>
      {[0, 72, 144, 216, 288].map((a, i) => {
        const rad = (a * Math.PI) / 180;
        const px = Math.cos(rad) * size;
        const py = Math.sin(rad) * size;
        return (
          <ellipse
            key={i}
            cx={px * 0.5}
            cy={py * 0.5}
            rx={size * 0.55}
            ry={size * 0.35}
            transform={`rotate(${a})`}
            fill={pink1}
          />
        );
      })}
      <circle cx={0} cy={0} r={size * 0.28} fill={pink2} />
    </g>
  );
}
