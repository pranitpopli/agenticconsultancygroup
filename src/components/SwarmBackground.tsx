import { useRef, useEffect, useCallback } from "react";

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  blur: number;
}

const BOID_COUNT = 60;
const MAX_SPEED = 1.8;
const PERCEPTION = 80;
const SEPARATION_DIST = 30;
const COHESION_WEIGHT = 0.003;
const ALIGNMENT_WEIGHT = 0.04;
const SEPARATION_WEIGHT = 0.06;
const MOUSE_REPEL = 120;
const EDGE_MARGIN = 60;

function createBoid(w: number, h: number): Boid {
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * (0.5 + Math.random()),
    vy: Math.sin(angle) * (0.5 + Math.random()),
    size: 2 + Math.random() * 3,
    opacity: 0.15 + Math.random() * 0.45,
    blur: Math.random() > 0.5 ? 1 + Math.random() * 3 : 0,
  };
}

function clampSpeed(vx: number, vy: number, max: number) {
  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed > max) {
    return { vx: (vx / speed) * max, vy: (vy / speed) * max };
  }
  return { vx, vy };
}

const SwarmBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boids = useRef<Boid[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const raf = useRef<number>(0);
  const dims = useRef({ w: 0, h: 0 });

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
    boids.current = Array.from({ length: BOID_COUNT }, () => createBoid(w, h));

    const handleResize = () => {
      resize();
    };

    const handleMouse = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
    };

    const handleLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleLeave);

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { w, h } = dims.current;

      ctx.clearRect(0, 0, w, h);

      const bs = boids.current;

      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];
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

            if (dist < SEPARATION_DIST) {
              sepX -= dx / dist;
              sepY -= dy / dist;
            }
          }
        }

        if (neighbors > 0) {
          // Cohesion
          avgX /= neighbors;
          avgY /= neighbors;
          b.vx += (avgX - b.x) * COHESION_WEIGHT;
          b.vy += (avgY - b.y) * COHESION_WEIGHT;

          // Alignment
          avgVx /= neighbors;
          avgVy /= neighbors;
          b.vx += (avgVx - b.vx) * ALIGNMENT_WEIGHT;
          b.vy += (avgVy - b.vy) * ALIGNMENT_WEIGHT;

          // Separation
          b.vx += sepX * SEPARATION_WEIGHT;
          b.vy += sepY * SEPARATION_WEIGHT;
        }

        // Mouse repel
        const mdx = b.x - mouse.current.x;
        const mdy = b.y - mouse.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_REPEL && mdist > 0) {
          const force = (MOUSE_REPEL - mdist) / MOUSE_REPEL;
          b.vx += (mdx / mdist) * force * 0.8;
          b.vy += (mdy / mdist) * force * 0.8;
        }

        // Edge steering
        if (b.x < EDGE_MARGIN) b.vx += 0.15;
        if (b.x > w - EDGE_MARGIN) b.vx -= 0.15;
        if (b.y < EDGE_MARGIN) b.vy += 0.15;
        if (b.y > h - EDGE_MARGIN) b.vy -= 0.15;

        const clamped = clampSpeed(b.vx, b.vy, MAX_SPEED);
        b.vx = clamped.vx;
        b.vy = clamped.vy;

        b.x += b.vx;
        b.y += b.vy;

        // Wrap
        if (b.x < -20) b.x = w + 20;
        if (b.x > w + 20) b.x = -20;
        if (b.y < -20) b.y = h + 20;
        if (b.y > h + 20) b.y = -20;
      }

      // Draw
      for (const b of bs) {
        ctx.save();
        if (b.blur > 0) {
          ctx.filter = `blur(${b.blur}px)`;
        }
        ctx.globalAlpha = b.opacity;
        ctx.fillStyle = "hsl(0 0% 10%)";
        ctx.beginPath();
        
        // Draw elongated shape in direction of velocity
        const angle = Math.atan2(b.vy, b.vx);
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        const stretch = 1 + speed * 0.8;
        
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.ellipse(0, 0, b.size * stretch, b.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw a few accent particles (cyan-ish)
      for (let i = 0; i < 3; i++) {
        const b = bs[i];
        ctx.save();
        ctx.filter = `blur(${4 + i * 2}px)`;
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "hsl(185 80% 55%)";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 6 + i * 2, 0, Math.PI * 2);
        ctx.fill();
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
  }, [resize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

export default SwarmBackground;
