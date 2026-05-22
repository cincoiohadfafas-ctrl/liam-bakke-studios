import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const W = 700, H = 260, GROUND = 210, GRAVITY = 0.7, JUMP = -14;

type Obstacle = { x: number; y?: number; w: number; h: number; type: "cactus" | "bird" };
type PowerUpType = "shield" | "slowmo" | "mini" | "feather" | "magnet";
type PowerUp = { x: number; y: number; type: PowerUpType; collected: boolean };

const POWERUP_COLORS: Record<PowerUpType, string> = {
  shield:  "#4fc3f7",
  slowmo:  "#ce93d8",
  mini:    "#a5d6a7",
  feather: "#fff176",
  magnet:  "#ff8a65",
};

const POWERUP_LABELS: Record<PowerUpType, string> = {
  shield:  "🛡",
  slowmo:  "🌀",
  mini:    "🔬",
  feather: "🪶",
  magnet:  "🧲",
};

const POWERUP_NAMES: Record<PowerUpType, string> = {
  shield:  "SHIELD",
  slowmo:  "SLOW-MO",
  mini:    "TINY",
  feather: "FEATHER",
  magnet:  "MAGNET",
};

function drawDino(ctx: CanvasRenderingContext2D, x: number, y: number, dead: boolean, frame: number, mini: boolean, shield: boolean, feather: boolean) {
  const scale = mini ? 0.55 : 1;
  const s = (v: number) => v * scale;
  const c = dead ? "#888" : "#555";
  const leg = Math.floor(frame / 6) % 2;

  ctx.save();
  ctx.translate(x, y);
  if (shield) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = POWERUP_COLORS.shield;
    ctx.beginPath();
    ctx.ellipse(s(18), s(-24), s(28), s(32), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  if (feather) {
    ctx.save();
    ctx.globalAlpha = 0.5 + Math.sin(frame * 0.2) * 0.2;
    ctx.fillStyle = POWERUP_COLORS.feather;
    ctx.beginPath();
    ctx.ellipse(s(18), s(-24), s(22), s(28), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  // body
  ctx.fillStyle = c;
  ctx.fillRect(s(4), s(-36), s(28), s(24));
  // neck
  ctx.fillRect(s(26), s(-44), s(12), s(12));
  // head
  ctx.fillRect(s(22), s(-52), s(20), s(14));
  // eye
  ctx.fillStyle = dead ? "#aaa" : "white";
  ctx.fillRect(s(36), s(-50), s(5), s(5));
  ctx.fillStyle = dead ? "#888" : "#222";
  ctx.fillRect(s(37), s(-49), s(3), s(3));
  // mouth
  if (dead) { ctx.fillStyle = "#888"; ctx.fillRect(s(38), s(-44), s(6), s(2)); }
  // tail
  ctx.fillStyle = c;
  ctx.fillRect(s(0), s(-28), s(8), s(8));
  ctx.fillRect(s(-4), s(-22), s(8), s(6));
  // legs
  if (!dead) {
    ctx.fillRect(s(10), s(-12), s(8), leg ? s(14) : s(10));
    ctx.fillRect(s(22), s(-12), s(8), leg ? s(10) : s(14));
    ctx.fillStyle = "#444";
    ctx.fillRect(s(8),  s(-12 + (leg ? 14 : 10)), s(10), s(4));
    ctx.fillRect(s(20), s(-12 + (leg ? 10 : 14)), s(10), s(4));
  } else {
    ctx.fillRect(s(10), s(-12), s(8), s(12));
    ctx.fillRect(s(22), s(-12), s(8), s(12));
  }
  ctx.restore();
}

function drawCactus(ctx: CanvasRenderingContext2D, obs: Obstacle) {
  const top = GROUND - obs.h;
  ctx.fillStyle = "#4a7c3f";
  // trunk
  ctx.fillRect(obs.x + obs.w * 0.35, top, obs.w * 0.3, obs.h);
  // arms
  const arm1Y = top + obs.h * 0.25;
  ctx.fillRect(obs.x, arm1Y, obs.w * 0.38, obs.w * 0.28);
  ctx.fillRect(obs.x, arm1Y - obs.h * 0.18, obs.w * 0.28, obs.h * 0.2);
  ctx.fillRect(obs.x + obs.w * 0.62, arm1Y, obs.w * 0.38, obs.w * 0.28);
  ctx.fillRect(obs.x + obs.w * 0.72, arm1Y - obs.h * 0.14, obs.w * 0.28, obs.h * 0.16);
  // dark edge
  ctx.fillStyle = "#2d5a26";
  ctx.fillRect(obs.x + obs.w * 0.35, top, obs.w * 0.08, obs.h);
}

function drawBird(ctx: CanvasRenderingContext2D, obs: Obstacle, frame: number) {
  const flapUp = Math.floor(frame / 8) % 2;
  const cx = obs.x + obs.w / 2;
  const cy = obs.y ?? GROUND - obs.h;
  ctx.fillStyle = "#666";
  ctx.fillRect(cx - 10, cy - 5, 20, 8);
  ctx.fillRect(cx + 8, cy - 3, 8, 4);
  ctx.fillStyle = "#888";
  if (flapUp) {
    ctx.fillRect(cx - 22, cy - 12, 14, 6);
    ctx.fillRect(cx + 8, cy - 12, 14, 6);
  } else {
    ctx.fillRect(cx - 22, cy - 2, 14, 6);
    ctx.fillRect(cx + 8, cy - 2, 14, 6);
  }
  ctx.fillStyle = "#333";
  ctx.fillRect(cx - 2, cy - 6, 4, 4);
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#e8e8e8";
  ctx.beginPath();
  ctx.ellipse(x, y, 30, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x - 18, y + 4, 18, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 20, y + 5, 22, 11, 0, 0, Math.PI * 2); ctx.fill();
}

function drawPowerUp(ctx: CanvasRenderingContext2D, p: PowerUp, frame: number) {
  if (p.collected) return;
  const bobY = p.y + Math.sin(frame * 0.08) * 4;
  ctx.save();
  // glow
  ctx.shadowColor = POWERUP_COLORS[p.type];
  ctx.shadowBlur = 12;
  ctx.fillStyle = POWERUP_COLORS[p.type] + "33";
  ctx.beginPath();
  ctx.ellipse(p.x + 14, bobY - 14, 18, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  // box
  ctx.fillStyle = POWERUP_COLORS[p.type];
  ctx.beginPath();
  ctx.roundRect(p.x, bobY - 28, 28, 28, 6);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "16px serif";
  ctx.textAlign = "center";
  ctx.fillText(POWERUP_LABELS[p.type], p.x + 14, bobY - 8);
  ctx.restore();
}

function useGame(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const s = {
      dinoY: GROUND, dinoVY: 0, onGround: true,
      obstacles: [] as Obstacle[],
      powerups: [] as PowerUp[],
      score: 0, speed: 5, frame: 0, dead: false, started: false,
      animId: 0,
      // power-up states
      shield: 0, slowmo: 0, mini: 0, feather: 0, magnet: 0,
      activeName: "" as string, activeTimer: 0,
    };

    const clouds = [
      { x: 100, y: 40 }, { x: 300, y: 60 }, { x: 550, y: 35 }, { x: 680, y: 55 },
    ];

    function jump() {
      if (s.dead) { restart(); return; }
      if (!s.started) s.started = true;
      const g = s.feather > 0 ? GRAVITY * 0.35 : GRAVITY;
      const j = s.mini > 0 ? JUMP * 1.2 : JUMP;
      if (s.onGround) { s.dinoVY = j; s.onGround = false; }
      void g;
    }

    function restart() {
      s.dinoY = GROUND; s.dinoVY = 0; s.onGround = true;
      s.obstacles = []; s.powerups = [];
      s.score = 0; s.speed = 5; s.frame = 0;
      s.dead = false; s.started = true;
      s.shield = 0; s.slowmo = 0; s.mini = 0; s.feather = 0; s.magnet = 0;
      s.activeName = ""; s.activeTimer = 0;
    }

    const POWERUP_TYPES: PowerUpType[] = ["shield", "slowmo", "mini", "feather", "magnet"];

    function spawnPowerUp(x: number) {
      const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
      s.powerups.push({ x, y: GROUND, type, collected: false });
    }

    function applyPowerUp(type: PowerUpType) {
      const dur = 300;
      s[type] = dur;
      s.activeName = POWERUP_NAMES[type];
      s.activeTimer = dur;
    }

    let groundOffset = 0;
    let bgNight = 0;

    function loop() {
      // Sky — gets darker at night cycle
      const nightPct = Math.sin(s.score / 2000) * 0.5 + 0.5;
      const bg = `rgb(${Math.floor(245 - nightPct * 210)},${Math.floor(245 - nightPct * 210)},${Math.floor(245 - nightPct * 210)})`;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Clouds
      const cloudSpeed = s.started && !s.dead ? s.speed * 0.3 : 0;
      bgNight = (bgNight + cloudSpeed) % W;
      clouds.forEach(c => {
        const cx = ((c.x - bgNight + W * 2) % (W + 120)) - 60;
        drawCloud(ctx, cx, c.y);
      });

      // Score indicator for power-up
      if (s.activeName && s.activeTimer > 0) {
        const alpha = Math.min(1, s.activeTimer / 60);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#333";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`⚡ ${s.activeName} (${Math.ceil(s.activeTimer / 60)}s)`, 14, 24);
        ctx.globalAlpha = 1;
      }

      // Ground
      ctx.fillStyle = nightPct > 0.5 ? "#555" : "#888";
      ctx.fillRect(0, GROUND + 2, W, 2);
      ctx.fillStyle = nightPct > 0.5 ? "#444" : "#ccc";
      ctx.fillRect(0, GROUND + 4, W, H - GROUND - 4);
      groundOffset = (groundOffset + (s.started && !s.dead ? s.speed : 0)) % 40;
      ctx.fillStyle = nightPct > 0.5 ? "#555" : "#aaa";
      for (let gx = -groundOffset; gx < W; gx += 40) {
        ctx.fillRect(gx, GROUND + 3, 20, 1);
      }

      if (!s.started) {
        ctx.fillStyle = "#555";
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillText("PRESS SPACE OR CLICK TO START", W / 2, H / 2 - 10);
        ctx.font = "12px monospace";
        ctx.fillStyle = "#888";
        ctx.fillText("collect power-ups for special abilities", W / 2, H / 2 + 12);
      }

      if (s.started && !s.dead) {
        s.frame++;
        s.score++;
        const slowFactor = s.slowmo > 0 ? 0.45 : 1;
        s.speed = (5 + Math.floor(s.score / 400) * 0.5) * slowFactor;

        // Tick power-up timers
        (["shield","slowmo","mini","feather","magnet"] as PowerUpType[]).forEach(t => {
          if (s[t] > 0) { s[t]--; if (s.activeTimer > 0) s.activeTimer--; }
        });

        // Spawn obstacles
        const last = s.obstacles[s.obstacles.length - 1];
        const gap = 280 + Math.random() * 240;
        if (!last || last.x < W - gap) {
          const isBird = s.score > 800 && Math.random() < 0.25;
          if (isBird) {
            const birdY = GROUND - 40 - Math.random() * 50;
            s.obstacles.push({ x: W, w: 44, h: 20, type: "bird", y: birdY } as Obstacle & { y: number });
          } else {
            const h = 38 + Math.random() * 28;
            s.obstacles.push({ x: W, w: 32 + Math.random() * 12, h, type: "cactus" });
          }
          // 20% chance to spawn a power-up between obstacles
          if (Math.random() < 0.20) spawnPowerUp(W + gap / 2);
        }

        s.obstacles = s.obstacles.map(o => ({ ...o, x: o.x - s.speed })).filter(o => o.x > -80);
        s.powerups = s.powerups.map(p => ({ ...p, x: p.x - s.speed })).filter(p => p.x > -40);

        // Gravity
        const grav = s.feather > 0 ? GRAVITY * 0.3 : GRAVITY;
        s.dinoVY += grav;
        s.dinoY += s.dinoVY;
        if (s.dinoY >= GROUND) { s.dinoY = GROUND; s.dinoVY = 0; s.onGround = true; }

        // Magnet: pull nearby power-ups
        if (s.magnet > 0) {
          s.powerups.forEach(p => {
            if (!p.collected && Math.abs(p.x - 70) < 160) p.x += (70 - p.x) * 0.08;
          });
        }

        // Collect power-ups
        s.powerups.forEach(p => {
          if (!p.collected) {
            const dinoW = s.mini > 0 ? 16 : 28;
            const dinoH = s.mini > 0 ? 22 : 40;
            if (70 + dinoW > p.x && 70 < p.x + 28 && s.dinoY - dinoH < p.y && s.dinoY > p.y - 28) {
              p.collected = true;
              applyPowerUp(p.type);
            }
          }
        });

        // Collision
        if (s.shield === 0) {
          for (const o of s.obstacles) {
            const dinoW = s.mini > 0 ? 14 : 26;
            const dinoH = s.mini > 0 ? 20 : 38;
            const dinoX = 70;
            const obsTop = o.type === "bird" ? (o as any).y : GROUND - o.h;
            if (dinoX + dinoW - 4 > o.x + 4 && dinoX + 4 < o.x + o.w - 4 &&
                s.dinoY - dinoH + 4 < obsTop + o.h && s.dinoY > obsTop - 4) {
              s.dead = true;
            }
          }
        }
      }

      // Draw power-ups
      s.powerups.forEach(p => drawPowerUp(ctx, p, s.frame));

      // Draw obstacles
      for (const o of s.obstacles) {
        if (o.type === "cactus") drawCactus(ctx, o);
        else drawBird(ctx, o, s.frame);
      }

      // Draw dino
      drawDino(ctx, 70, s.dinoY, s.dead, s.frame, s.mini > 0, s.shield > 0, s.feather > 0);

      // Score
      ctx.fillStyle = "#555";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "right";
      ctx.fillText(Math.floor(s.score / 10).toString().padStart(5, "0"), W - 14, 22);

      if (s.dead) {
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#333";
        ctx.font = "bold 32px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 10);
        ctx.font = "13px monospace";
        ctx.fillStyle = "#666";
        ctx.fillText("press space or click to restart", W / 2, H / 2 + 18);
      }

      s.animId = requestAnimationFrame(loop);
    }

    s.animId = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
    };
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("click", jump);

    return () => {
      cancelAnimationFrame(s.animId);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("click", jump);
    };
  }, [active]);

  return canvasRef;
}

export function DinoGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useGame(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative rounded-xl overflow-hidden"
        style={{ background: "#f5f5f5", border: "2px solid #ddd", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-10 rounded-full p-1.5 hover:bg-black/10 transition-colors" style={{ color: "#888" }}>
          <X className="h-4 w-4" />
        </button>
        <div className="px-4 pt-3 pb-1 flex items-center gap-3 border-b" style={{ borderColor: "#ddd" }}>
          <span style={{ color: "#555", fontSize: 12, fontFamily: "monospace", letterSpacing: "0.05em" }}>DINO GAME</span>
          <div className="flex items-center gap-2 ml-2 text-xs" style={{ fontFamily: "monospace", color: "#888" }}>
            <span title="Shield">🛡 invincible</span>
            <span title="Slow-mo">🌀 slow-mo</span>
            <span title="Mini">🔬 tiny</span>
            <span title="Feather">🪶 float</span>
            <span title="Magnet">🧲 attract</span>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block cursor-pointer"
          style={{ maxWidth: "min(700px, 94vw)", height: "auto" }}
        />
        <div className="px-4 py-2 text-center" style={{ color: "#aaa", fontSize: 11, fontFamily: "monospace" }}>
          SPACE / ↑ to jump · click to play
        </div>
      </motion.div>
    </motion.div>
  );
}

export { AnimatePresence };
