import { useMemo } from "react";

const DROPS = 35;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function RainDrizzle() {
  const drops = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: DROPS }, (_, i) => ({
      id: i,
      left: rand() * 100,
      delay: rand() * 4,
      duration: 0.5 + rand() * 0.6,
      opacity: 0.10 + rand() * 0.12,
      length: 14 + rand() * 18,
      thickness: 0.8 + rand() * 0.7,
    }));
  }, []);

  return (
    <>
      <style>{`
        @keyframes raindrop {
          0%   { transform: translateY(-40px) skewX(-8deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(105vh) skewX(-8deg); opacity: 0; }
        }
      `}</style>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {drops.map(({ id, left, delay, duration, opacity, length, thickness }) => (
          <div
            key={id}
            style={{
              position: "absolute",
              top: 0,
              left: `${left}%`,
              width: `${thickness}px`,
              height: `${length}px`,
              borderRadius: "1px",
              background: `linear-gradient(to bottom, transparent, oklch(0.90 0.05 220 / ${opacity}), transparent)`,
              animation: `raindrop ${duration}s ${delay}s linear infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}
