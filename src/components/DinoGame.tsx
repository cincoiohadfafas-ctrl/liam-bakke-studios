import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const W = 700, H = 280, GROUND = 230, GRAVITY = 0.6, JUMP = -13;

type Obstacle = { x: number; w: number; h: number };

function useGame(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    dinoY: GROUND, dinoVY: 0, onGround: true,
    obstacles: [] as Obstacle[],
    score: 0, speed: 4, frame: 0, dead: false, started: false,
    animId: 0,
  });

  useEffect(() => {
    if (!active) return;
    const s = state.current;
    s.dinoY = GROUND; s.dinoVY = 0; s.onGround = true;
    s.obstacles = []; s.score = 0; s.speed = 4; s.frame = 0;
    s.dead = false; s.started = false;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function jump() {
      if (s.dead) { restart(); return; }
      if (!s.started) s.started = true;
      if (s.onGround) { s.dinoVY = JUMP; s.onGround = false; }
    }

    function restart() {
      s.dinoY = GROUND; s.dinoVY = 0; s.onGround = true;
      s.obstacles = []; s.score = 0; s.speed = 4; s.frame = 0;
      s.dead = false; s.started = true;
    }

    // Draw Tarnished knight (side-view pixel art style)
    function drawKnight(x: number, y: number, dead: boolean, frame: number) {
      const gold = dead ? "#888" : "#c9a84c";
      const darkGold = dead ? "#555" : "#8a6a1e";
      const cape = dead ? "#444" : "#6b1a1a";
      const legPhase = Math.floor(frame / 7) % 2;

      // Cape
      ctx.fillStyle = cape;
      ctx.fillRect(x + 2, y - 38, 10, 22);

      // Body armour
      ctx.fillStyle = gold;
      ctx.fillRect(x + 8, y - 40, 18, 24);

      // Pauldrons
      ctx.fillStyle = darkGold;
      ctx.fillRect(x + 6, y - 42, 8, 6);
      ctx.fillRect(x + 20, y - 42, 8, 6);

      // Head / helmet
      ctx.fillStyle = gold;
      ctx.fillRect(x + 10, y - 56, 16, 18);
      // visor
      ctx.fillStyle = dead ? "#333" : "#1a1a2e";
      ctx.fillRect(x + 12, y - 52, 10, 5);
      // helmet crest
      ctx.fillStyle = dead ? "#666" : "#e8c96d";
      ctx.fillRect(x + 14, y - 60, 8, 6);

      // Sword (raised when jumping)
      const swordY = s.onGround ? y - 50 : y - 62;
      ctx.fillStyle = dead ? "#666" : "#d4d4d4";
      ctx.fillRect(x + 28, swordY, 4, 28);
      ctx.fillStyle = darkGold;
      ctx.fillRect(x + 24, swordY + 26, 12, 4);

      // Shield
      ctx.fillStyle = darkGold;
      ctx.fillRect(x + 2, y - 42, 8, 18);
      ctx.fillStyle = gold;
      ctx.fillRect(x + 3, y - 40, 6, 14);

      // Legs
      ctx.fillStyle = gold;
      if (!dead) {
        ctx.fillRect(x + 10, y - 18, 8, legPhase ? 20 : 16);
        ctx.fillRect(x + 20, y - 18, 8, legPhase ? 16 : 20);
        // boots
        ctx.fillStyle = darkGold;
        ctx.fillRect(x + 8,  y - 18 + (legPhase ? 20 : 16), 10, 4);
        ctx.fillRect(x + 18, y - 18 + (legPhase ? 16 : 20), 10, 4);
      } else {
        ctx.fillRect(x + 10, y - 18, 8, 18);
        ctx.fillRect(x + 20, y - 18, 8, 18);
      }
    }

    // Draw Grafted Scion-ish enemy
    function drawEnemy(obs: Obstacle) {
      const top = GROUND - obs.h;
      const x = obs.x, w = obs.w;
      const ered = "#8b1a1a";
      const dark = "#3d0d0d";

      // Body mass
      ctx.fillStyle = dark;
      ctx.fillRect(x + w * 0.2, top, w * 0.6, obs.h);

      // Extra limbs
      ctx.fillStyle = ered;
      ctx.fillRect(x, top + 8,  w * 0.25, 6);
      ctx.fillRect(x + w * 0.75, top + 8, w * 0.25, 6);
      ctx.fillRect(x, top + 18, w * 0.2, 5);
      ctx.fillRect(x + w * 0.8, top + 18, w * 0.2, 5);

      // Blades/arms
      ctx.fillStyle = "#c0c0c0";
      ctx.fillRect(x - 4, top + 4, 10, 3);
      ctx.fillRect(x + w - 6, top + 4, 10, 3);

      // Eyes (glowing)
      ctx.fillStyle = "#ff6600";
      ctx.fillRect(x + w * 0.3, top + 6, 5, 5);
      ctx.fillRect(x + w * 0.6, top + 6, 5, 5);

      // Golden rune glow
      ctx.fillStyle = "rgba(201,168,76,0.15)";
      ctx.fillRect(x, top, w, obs.h);
    }

    let groundOffset = 0;
    let bgOffset = 0;

    function glowEye(ex: number, ey: number, rx: number, ry: number, pulse: number) {
      // Outer glow
      const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, rx * 2.5);
      g.addColorStop(0, `rgba(60,255,200,${0.45 + pulse * 0.3})`);
      g.addColorStop(0.4, `rgba(20,200,160,${0.2 + pulse * 0.15})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(ex, ey, rx * 2.5, ry * 2.5, 0, 0, Math.PI * 2); ctx.fill();
      // sclera
      ctx.fillStyle = "#e8f8f0";
      ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
      // iris
      ctx.fillStyle = `rgba(30,${Math.floor(200 + pulse * 55)},160,0.97)`;
      ctx.beginPath(); ctx.ellipse(ex, ey, rx * 0.62, ry * 0.62, 0, 0, Math.PI * 2); ctx.fill();
      // pupil
      ctx.fillStyle = "#04100c";
      ctx.beginPath(); ctx.ellipse(ex, ey, rx * 0.28, ry * 0.34, 0, 0, Math.PI * 2); ctx.fill();
      // highlight
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath(); ctx.ellipse(ex - rx * 0.22, ey - ry * 0.22, rx * 0.18, ry * 0.15, 0, 0, Math.PI * 2); ctx.fill();
    }

    function drawMoonLord(t: number) {
      const cx = W * 0.5;
      const pulse = Math.sin(t * 0.04) * 0.5 + 0.5;
      const breathe = Math.sin(t * 0.025) * 3;
      const skin = "#c8a878";
      const skinDark = "#8a6840";
      const skinShad = "#6a4e28";

      // Ambient teal glow behind whole figure
      const ambient = ctx.createRadialGradient(cx, 120, 0, cx, 120, 300);
      ambient.addColorStop(0, `rgba(20,180,140,${0.08 + pulse * 0.05})`);
      ambient.addColorStop(1, "transparent");
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, W, H);

      // ── Stars ──
      ctx.save();
      [[0.08,0.06],[0.88,0.04],[0.18,0.28],[0.92,0.22],[0.04,0.45],[0.96,0.40],[0.28,0.05],[0.72,0.09],[0.5,0.03],[0.4,0.18],[0.62,0.15]].forEach(([sx,sy],i) => {
        const f = Math.sin(t * 0.05 + i * 2.3) * 0.5 + 0.5;
        ctx.globalAlpha = 0.2 + f * 0.5;
        ctx.fillStyle = "#b8f0e0";
        ctx.fillRect(sx * W - 1, sy * GROUND - 1, 2, 2);
      });
      ctx.globalAlpha = 1;
      ctx.restore();

      // ── Torso ──
      // Lower ribcage area (exposed skeleton)
      const torsoTop = 80, torsoBot = GROUND - 20;
      // Torso base
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.moveTo(cx - 72, torsoTop + 30);
      ctx.bezierCurveTo(cx - 78, torsoTop + 60, cx - 68, torsoBot - 20, cx - 32, torsoBot);
      ctx.lineTo(cx + 32, torsoBot);
      ctx.bezierCurveTo(cx + 68, torsoBot - 20, cx + 78, torsoTop + 60, cx + 72, torsoTop + 30);
      ctx.bezierCurveTo(cx + 80, torsoTop + 10, cx + 50, torsoTop - 5, cx, torsoTop - 8);
      ctx.bezierCurveTo(cx - 50, torsoTop - 5, cx - 80, torsoTop + 10, cx - 72, torsoTop + 30);
      ctx.fill();

      // Muscle definition (pecs)
      ctx.fillStyle = skinDark;
      ctx.beginPath();
      ctx.ellipse(cx - 28, torsoTop + 18, 32, 22, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 28, torsoTop + 18, 32, 22, -0.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.ellipse(cx - 28, torsoTop + 14, 27, 18, 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 28, torsoTop + 14, 27, 18, -0.15, 0, Math.PI * 2); ctx.fill();

      // Ribs (exposed skeleton on lower torso)
      const ribTop = torsoTop + 42;
      ctx.strokeStyle = "#d4b88a";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      for (let r = 0; r < 5; r++) {
        const ry2 = ribTop + r * 18;
        const spread = 38 + r * 6;
        // left rib
        ctx.beginPath();
        ctx.moveTo(cx - 8, ry2);
        ctx.bezierCurveTo(cx - spread * 0.5, ry2 - 4, cx - spread, ry2 + 5, cx - spread + 4, ry2 + 14);
        ctx.stroke();
        // right rib
        ctx.beginPath();
        ctx.moveTo(cx + 8, ry2);
        ctx.bezierCurveTo(cx + spread * 0.5, ry2 - 4, cx + spread, ry2 + 5, cx + spread - 4, ry2 + 14);
        ctx.stroke();
      }
      // sternum
      ctx.strokeStyle = "#d4b88a";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(cx, ribTop - 4);
      ctx.lineTo(cx, ribTop + 4 * 18);
      ctx.stroke();

      // Brain/teal node on chest
      ctx.fillStyle = `rgba(30,${Math.floor(180 + pulse * 60)},140,0.85)`;
      ctx.beginPath();
      ctx.ellipse(cx, torsoTop + 30, 14, 11, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(60,255,200,${0.5 + pulse * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(cx, torsoTop + 30, 8, 6, 0, 0, Math.PI * 2); ctx.fill();

      // ── HEAD ──
      const headCX = cx, headCY = 34 + breathe;
      // skull
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.ellipse(headCX, headCY, 55, 48, 0, 0, Math.PI * 2); ctx.fill();
      // jaw
      ctx.fillStyle = skinDark;
      ctx.beginPath();
      ctx.ellipse(headCX, headCY + 38, 34, 18, 0, 0, Math.PI * 2); ctx.fill();

      // ── Brain crown ──
      const brainColors = ["#8bc8a0","#6aaa84","#4e9068","#7abea0"];
      [
        { bx: headCX,      by: headCY - 42, rx: 22, ry: 18 },
        { bx: headCX - 26, by: headCY - 34, rx: 16, ry: 13 },
        { bx: headCX + 26, by: headCY - 34, rx: 16, ry: 13 },
        { bx: headCX - 14, by: headCY - 50, rx: 13, ry: 10 },
        { bx: headCX + 14, by: headCY - 50, rx: 13, ry: 10 },
      ].forEach(({ bx, by, rx, ry }, i) => {
        ctx.fillStyle = brainColors[i % brainColors.length];
        ctx.beginPath(); ctx.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
        // brain fold lines
        ctx.strokeStyle = "#3a7854";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(bx, by, rx * 0.6, ry * 0.5, 0.3, 0, Math.PI * 2); ctx.stroke();
        // glow
        const bg = ctx.createRadialGradient(bx, by, 0, bx, by, rx);
        bg.addColorStop(0, `rgba(60,255,180,${0.25 + pulse * 0.2})`);
        bg.addColorStop(1, "transparent");
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
      });

      // ── Forehead eye ──
      glowEye(headCX, headCY - 4, 18, 14, pulse);

      // ── Tentacle beard ──
      const tentOffsets = [-38, -22, -6, 10, 26, 42];
      tentOffsets.forEach((ox, i) => {
        const sw = Math.sin(t * 0.035 + i * 1.1) * 10;
        const len = 48 + i * 3;
        ctx.strokeStyle = skinDark;
        ctx.lineWidth = 6 - i * 0.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(headCX + ox, headCY + 48);
        ctx.bezierCurveTo(
          headCX + ox + sw, headCY + 48 + len * 0.35,
          headCX + ox - sw, headCY + 48 + len * 0.7,
          headCX + ox + sw * 0.4, headCY + 48 + len
        );
        ctx.stroke();
        // tentacle tip bulb
        ctx.fillStyle = skinDark;
        ctx.beginPath();
        ctx.ellipse(headCX + ox + sw * 0.4, headCY + 48 + len, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        // teal tip glow
        ctx.fillStyle = `rgba(40,220,160,${0.4 + pulse * 0.25})`;
        ctx.beginPath();
        ctx.ellipse(headCX + ox + sw * 0.4, headCY + 48 + len, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Left arm ──
      const lsX = cx - 70, lsY = torsoTop + 16 + breathe;
      const lelX = cx - 160 + Math.sin(t * 0.02) * 5;
      const lelY = torsoTop + 10 + Math.cos(t * 0.018) * 6;
      const lhX = cx - 195 + Math.sin(t * 0.022) * 6;
      const lhY = torsoTop - 20 + Math.cos(t * 0.02) * 5;

      // upper arm
      ctx.strokeStyle = skin;
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lsX, lsY);
      ctx.quadraticCurveTo(lelX + 20, lelY + 20, lelX, lelY);
      ctx.stroke();
      ctx.strokeStyle = skinDark;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lsX, lsY);
      ctx.quadraticCurveTo(lelX + 20, lelY + 20, lelX, lelY);
      ctx.stroke();
      // forearm
      ctx.strokeStyle = skin;
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.moveTo(lelX, lelY);
      ctx.quadraticCurveTo(lhX + 15, lhY + 30, lhX, lhY);
      ctx.stroke();

      // Left hand / palm
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.ellipse(lhX, lhY, 30, 24, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = skinDark;
      ctx.beginPath();
      ctx.ellipse(lhX, lhY, 28, 22, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      // fingers
      [[-22,-18],[-10,-26],[6,-26],[20,-20],[28,-8]].forEach(([fx, fy], fi) => {
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.ellipse(lhX + fx, lhY + fy, 5, 10, Math.atan2(fy, fx), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = skinShad;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      // palm eye
      glowEye(lhX, lhY, 14, 11, pulse);

      // ── Right arm ──
      const rsX = cx + 70, rsY = torsoTop + 16 + breathe;
      const relX = cx + 160 + Math.sin(t * 0.019 + 1) * 5;
      const relY = torsoTop + 12 + Math.cos(t * 0.021 + 1) * 6;
      const rhX = cx + 195 + Math.sin(t * 0.021 + 1) * 6;
      const rhY = torsoTop - 18 + Math.cos(t * 0.019 + 1) * 5;

      ctx.strokeStyle = skin;
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(rsX, rsY);
      ctx.quadraticCurveTo(relX - 20, relY + 20, relX, relY);
      ctx.stroke();
      ctx.strokeStyle = skinDark;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rsX, rsY);
      ctx.quadraticCurveTo(relX - 20, relY + 20, relX, relY);
      ctx.stroke();
      ctx.strokeStyle = skin;
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.moveTo(relX, relY);
      ctx.quadraticCurveTo(rhX - 15, rhY + 30, rhX, rhY);
      ctx.stroke();

      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.ellipse(rhX, rhY, 30, 24, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = skinDark;
      ctx.beginPath();
      ctx.ellipse(rhX, rhY, 28, 22, 0.3, 0, Math.PI * 2);
      ctx.stroke();
      [[22,-18],[10,-26],[-6,-26],[-20,-20],[-28,-8]].forEach(([fx, fy]) => {
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.ellipse(rhX + fx, rhY + fy, 5, 10, Math.atan2(fy, fx), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = skinShad;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      glowEye(rhX, rhY, 14, 11, pulse);
    }

    function loop() {
      // Background — deep space purple
      ctx.fillStyle = "#06020f";
      ctx.fillRect(0, 0, W, H);

      drawMoonLord(s.frame);

      // Ground — dark purple stone
      ctx.fillStyle = "#0e0818";
      ctx.fillRect(0, GROUND + 10, W, H - GROUND - 10);
      ctx.fillStyle = "#2a1040";
      ctx.fillRect(0, GROUND + 10, W, 4);

      groundOffset = (groundOffset + (s.started && !s.dead ? s.speed : 0)) % 60;
      ctx.fillStyle = "#3d1a5a";
      for (let gx = -groundOffset; gx < W; gx += 60) {
        ctx.fillRect(gx, GROUND + 12, 30, 2);
        ctx.fillRect(gx + 15, GROUND + 16, 20, 1);
      }

      if (!s.started) {
        ctx.fillStyle = "#c9a84c";
        ctx.font = "bold 18px serif";
        ctx.textAlign = "center";
        ctx.fillText("— PRESS SPACE TO BEGIN YOUR JOURNEY —", W / 2, H / 2 - 8);
        ctx.fillStyle = "rgba(201,168,76,0.5)";
        ctx.font = "13px serif";
        ctx.fillText("click canvas or press space / arrow up to jump", W / 2, H / 2 + 16);
      }

      if (s.started && !s.dead) {
        s.frame++;
        s.score++;
        s.speed = 4 + Math.floor(s.score / 300) * 0.6;

        const last = s.obstacles[s.obstacles.length - 1];
        const gap = 300 + Math.random() * 220;
        if (!last || last.x < W - gap) {
          const h = 35 + Math.random() * 35;
          s.obstacles.push({ x: W, w: 28 + Math.random() * 16, h });
        }

        s.obstacles = s.obstacles
          .map(o => ({ ...o, x: o.x - s.speed }))
          .filter(o => o.x > -80);

        s.dinoVY += GRAVITY;
        s.dinoY += s.dinoVY;
        if (s.dinoY >= GROUND) { s.dinoY = GROUND; s.dinoVY = 0; s.onGround = true; }

        for (const o of s.obstacles) {
          const kx = 60, kw = 26, kh = 44;
          if (
            kx + kw - 6 > o.x + 4 &&
            kx + 6 < o.x + o.w - 4 &&
            s.dinoY - kh + 6 < GROUND - o.h + o.h &&
            s.dinoY > GROUND - o.h - 4
          ) { s.dead = true; }
        }
      }

      for (const o of s.obstacles) drawEnemy(o);
      drawKnight(60, s.dinoY, s.dead, s.frame);

      // Score — rune counter style
      ctx.fillStyle = "#c9a84c";
      ctx.font = "bold 15px serif";
      ctx.textAlign = "right";
      ctx.fillText(`⚜ ${Math.floor(s.score / 10).toString().padStart(5, "0")}`, W - 14, 26);

      if (s.dead) {
        // YOU DIED overlay
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#8b1a1a";
        ctx.font = "bold 48px serif";
        ctx.textAlign = "center";
        ctx.fillText("YOU DIED", W / 2, H / 2 + 4);
        ctx.fillStyle = "#c9a84c";
        ctx.font = "13px serif";
        ctx.fillText("press space / click to try again", W / 2, H / 2 + 30);
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
      style={{ zIndex: 200, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "#0d0a06",
          border: "1px solid #c9a84c55",
          boxShadow: "0 0 80px rgba(201,168,76,0.18), 0 0 0 1px #8b1a1a44",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full p-1.5 transition-colors hover:bg-white/10"
          style={{ color: "#c9a84c88" }}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="px-5 pt-4 pb-1 flex items-center gap-2">
          <span style={{ color: "#c9a84c", fontSize: 13, fontFamily: "serif", letterSpacing: "0.1em" }}>
            ⚜ ELDEN RING
          </span>
          <span style={{ color: "#8b1a1a", fontSize: 11, fontFamily: "serif" }}>— secret passage</span>
        </div>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block cursor-pointer"
          style={{ maxWidth: "min(700px, 92vw)", height: "auto" }}
        />
        <div className="px-5 py-2 text-center" style={{ color: "#c9a84c55", fontSize: 11, fontFamily: "serif" }}>
          SPACE / ↑ to jump · click to play
        </div>
      </motion.div>
    </motion.div>
  );
}

export { AnimatePresence };
