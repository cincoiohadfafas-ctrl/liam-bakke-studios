import { motion, useScroll, useTransform } from "framer-motion";
import cherryBlossom from "@/assets/cherry-blossom.png";

export function CherryBlossomTree() {
  const { scrollYProgress } = useScroll();

  // Reveal: clip grows from the trunk base (bottom-center) upward as you scroll
  const clipProgress = useTransform(scrollYProgress, [0, 0.85], [0, 100]);
  const clip = useTransform(
    clipProgress,
    v => `inset(${100 - v}% 0% 0% 0%)`
  );

  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.90, 1.0], [0, 0.72, 0.72, 0]);

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        bottom: "-2%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(780px, 95vw)",
        zIndex: 0,
        pointerEvents: "none",
        clipPath: clip,
        opacity,
        mixBlendMode: "screen",
      }}
    >
      <img
        src={cherryBlossom}
        alt=""
        style={{
          width: "100%",
          display: "block",
          userSelect: "none",
          draggable: false,
        } as React.CSSProperties}
      />
    </motion.div>
  );
}
