import { useRef, useEffect, useCallback } from "react";
import { useTheme } from "@/hooks/use-theme";

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  trail: { x: number; y: number }[];
  group: number; // 0 = dark, 1 = accent
}

const BOID_COUNT = 120;
const MAX_SPEED = 2.2;
const MIN_SPEED = 0.6;
const PERCEPTION = 100;
const SEPARATION_DIST = 24;
const COHESION_WEIGHT = 0.005;
const ALIGNMENT_WEIGHT = 0.06;
const SEPARATION_WEIGHT = 0.08;
const MOUSE_ATTRACT = 200;
const EDGE_MARGIN = 80;
const TRAIL_LENGTH = 8;
const CONNECTION_DIST = 50;

function createBoid(w: number, h: number, centerBias: boolean): Boid {
  const angle = Math.random() * Math.PI * 2;
  const cx = w / 2;
  const cy = h / 2;
  const spread = Math.min(w, h) * (centerBias ? 0.25 : 0.4);
  const x = cx + (Math.random() - 0.5) * spread * 2;
  const y = cy + (Math.random() - 0.5) * spread * 2;

  return {
    x,
    y,
    vx: Math.cos(angle) * (0.8 + Math.random() * 1.2),
    vy: Math.sin(angle) * (0.8 + Math.random() * 1.2),
    size: 1.5 + Math.random() * 2.5,
    opacity: 0.3 + Math.random() * 0.5,
    trail: [],
    group: Math.random() < 0.06 ? 1 : 0,
  };
}

function clampSpeed(vx: number, vy: number, min: number, max: number) {
  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed > max) return { vx: (vx / speed) * max, vy: (vy / speed) * max };
  if (speed < min && speed > 0) return { vx: (vx / speed) * min, vy: (vy / speed) * min };
  return { vx, vy };
}

const SwarmBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boids = useRef<Boid[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const raf = useRef<number>(0);
  const dims = useRef({ w: 0, h: 0 });
  const initialized = useRef(false);
  const { theme } = useTheme();

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    dims.current = { w: rect.width, h: rect.height };
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    resize();
    const { w, h } = dims.current;

    if (!initialized.current) {
      boids.current = Array.from({ length: BOID_COUNT }, (_, i) =>
        createBoid(w, h, i < BOID_COUNT * 0.7)
      );
      initialized.current = true;
    }

    const handleResize = () => resize();
    const handleMouse = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouse.current = { x: -1000, y: -1000 }; };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleLeave);

    const isDark = theme === "dark";
    const particleColor = isDark ? "210, 30%, 85%" : "0, 0%, 10%";
    const accentColor = isDark ? "185, 70%, 55%" : "185, 80%, 48%";
    const lineColor = isDark ? "rgba(180,195,210," : "rgba(26,26,26,";

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { w, h } = dims.current;

      // Fade trail effect
      ctx.fillStyle = isDark
        ? "hsla(220, 15%, 10%, 0.15)"
        : "hsla(40, 33%, 97%, 0.15)";
      ctx.fillRect(0, 0, w, h);

      const bs = boids.current;
      const cx = w / 2;
      const cy = h / 2;

      // Update boids
      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];

        // Store trail
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > TRAIL_LENGTH) b.trail.shift();

        let avgX = 0, avgY = 0, avgVx = 0, avgVy = 0;
        let sepX = 0, sepY = 0;
        let neighbors = 0;

        for (let j = 0; j < bs.length; j++) {
          if (i === j) continue;
          const dx = bs[j].x - b.x;
          const dy = bs[j].y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < PERCEPTION) {
            avgX += bs[j].x;
            avgY += bs[j].y;
            avgVx += bs[j].vx;
            avgVy += bs[j].vy;
            neighbors++;

            if (dist < SEPARATION_DIST && dist > 0) {
              sepX -= dx / dist;
              sepY -= dy / dist;
            }
          }
        }

        if (neighbors > 0) {
          avgX /= neighbors;
          avgY /= neighbors;
          b.vx += (avgX - b.x) * COHESION_WEIGHT;
          b.vy += (avgY - b.y) * COHESION_WEIGHT;

          avgVx /= neighbors;
          avgVy /= neighbors;
          b.vx += (avgVx - b.vx) * ALIGNMENT_WEIGHT;
          b.vy += (avgVy - b.vy) * ALIGNMENT_WEIGHT;

          b.vx += sepX * SEPARATION_WEIGHT;
          b.vy += sepY * SEPARATION_WEIGHT;
        }

        // Gentle center gravity to keep swarm visible
        const dcx = cx - b.x;
        const dcy = cy - b.y;
        const centerDist = Math.sqrt(dcx * dcx + dcy * dcy);
        const maxDrift = Math.min(w, h) * 0.4;
        if (centerDist > maxDrift) {
          b.vx += (dcx / centerDist) * 0.08;
          b.vy += (dcy / centerDist) * 0.08;
        }

        // Mouse attraction (gentle orbit)
        const mdx = mouse.current.x - b.x;
        const mdy = mouse.current.y - b.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_ATTRACT && mdist > 30) {
          // Attract but also orbit — perpendicular force
          const force = ((MOUSE_ATTRACT - mdist) / MOUSE_ATTRACT) * 0.3;
          b.vx += (mdx / mdist) * force * 0.4;
          b.vy += (mdy / mdist) * force * 0.4;
          // Perpendicular
          b.vx += (-mdy / mdist) * force * 0.3;
          b.vy += (mdx / mdist) * force * 0.3;
        } else if (mdist <= 30 && mdist > 0) {
          // Repel if too close
          b.vx -= (mdx / mdist) * 1.5;
          b.vy -= (mdy / mdist) * 1.5;
        }

        // Edge steering
        if (b.x < EDGE_MARGIN) b.vx += 0.2;
        if (b.x > w - EDGE_MARGIN) b.vx -= 0.2;
        if (b.y < EDGE_MARGIN) b.vy += 0.2;
        if (b.y > h - EDGE_MARGIN) b.vy -= 0.2;

        const clamped = clampSpeed(b.vx, b.vy, MIN_SPEED, MAX_SPEED);
        b.vx = clamped.vx;
        b.vy = clamped.vy;

        b.x += b.vx;
        b.y += b.vy;

        // Wrap
        if (b.x < -30) b.x = w + 30;
        if (b.x > w + 30) b.x = -30;
        if (b.y < -30) b.y = h + 30;
        if (b.y > h + 30) b.y = -30;
      }

      // Draw connections (thin lines between close boids)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < bs.length; i++) {
        for (let j = i + 1; j < bs.length; j++) {
          const dx = bs[j].x - bs[i].x;
          const dy = bs[j].y - bs[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.beginPath();
            ctx.moveTo(bs[i].x, bs[i].y);
            ctx.lineTo(bs[j].x, bs[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw trails
      for (const b of bs) {
        if (b.trail.length < 2) continue;
        const isAccent = b.group === 1;
        const color = isAccent ? accentColor : particleColor;

        ctx.beginPath();
        ctx.moveTo(b.trail[0].x, b.trail[0].y);
        for (let t = 1; t < b.trail.length; t++) {
          ctx.lineTo(b.trail[t].x, b.trail[t].y);
        }
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${color}, ${b.opacity * (isAccent ? 0.6 : 0.3)})`;
        ctx.lineWidth = b.size * 0.4;
        ctx.stroke();
      }

      // Draw particles
      for (const b of bs) {
        const isAccent = b.group === 1;
        const color = isAccent ? accentColor : particleColor;
        const angle = Math.atan2(b.vy, b.vx);
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        const stretch = 1 + speed * 0.6;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.globalAlpha = b.opacity;

        if (isAccent) {
          // Glow for accent particles
          ctx.filter = "blur(6px)";
          ctx.fillStyle = `hsl(${accentColor})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, b.size * 3, b.size * 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.filter = "none";

          ctx.fillStyle = `hsl(${accentColor})`;
          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          ctx.arc(0, 0, b.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `hsl(${color})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, b.size * stretch, b.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [resize, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
};

export default SwarmBackground;
