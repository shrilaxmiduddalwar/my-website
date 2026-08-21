"use client";

import React, { useEffect, useRef, useState } from "react";

interface RainWeatherFXProps {
  isRaining: boolean;
  onToggleRain?: () => void;
}

interface LightningBolt {
  segments: { x1: number; y1: number; x2: number; y2: number; width: number; alpha: number }[];
  branches: { x1: number; y1: number; x2: number; y2: number; width: number; alpha: number }[];
  createdAt: number;
  duration: number;
}

export const RainWeatherFX: React.FC<RainWeatherFXProps> = ({ isRaining, onToggleRain }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flashIntensity, setFlashIntensity] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // =========================================================
    // 1. RAINDROPS & SPLASH PARTICLES
    // =========================================================
    const dropCount = Math.min(220, Math.floor(window.innerWidth / 6));
    const drops = Array.from({ length: dropCount }).map(() => ({
      x: Math.random() * (width + 200),
      y: Math.random() * height,
      length: Math.random() * 24 + 18,
      speed: Math.random() * 16 + 18,
      opacity: Math.random() * 0.45 + 0.35,
      thickness: Math.random() * 1.3 + 0.9,
    }));

    interface Splash {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }
    const splashes: Splash[] = [];

    // =========================================================
    // 2. PROCEDURAL FRACTAL LIGHTNING GENERATOR
    // =========================================================
    let activeBolts: LightningBolt[] = [];
    let nextLightningTime = performance.now() + 3500;

    const generateLightningBolt = (startX?: number): LightningBolt => {
      const sx = startX ?? Math.random() * (width * 0.7) + width * 0.15;
      const sy = 0;
      const targetX = sx + (Math.random() - 0.5) * (width * 0.4);
      const targetY = height * (0.6 + Math.random() * 0.35);

      const segments: LightningBolt["segments"] = [];
      const branches: LightningBolt["branches"] = [];

      let curX = sx;
      let curY = sy;
      const steps = 18;
      const dy = (targetY - sy) / steps;

      for (let i = 0; i < steps; i++) {
        const nextY = curY + dy;
        const sway = (Math.random() - 0.5) * 55;
        const nextX = curX + (targetX - curX) / (steps - i) + sway;

        segments.push({
          x1: curX,
          y1: curY,
          x2: nextX,
          y2: nextY,
          width: Math.max(1.8, 4.5 * (1 - i / steps)),
          alpha: 1.0,
        });

        // Spawn branching forks off main trunk
        if (Math.random() < 0.38 && i > 3 && i < steps - 2) {
          let bX = nextX;
          let bY = nextY;
          const bSteps = Math.floor(Math.random() * 5 + 3);
          const bDir = Math.random() < 0.5 ? -1 : 1;

          for (let j = 0; j < bSteps; j++) {
            const nbY = bY + dy * 0.7;
            const nbX = bX + bDir * (Math.random() * 35 + 15) + (Math.random() - 0.5) * 20;

            branches.push({
              x1: bX,
              y1: bY,
              x2: nbX,
              y2: nbY,
              width: Math.max(0.8, 2.2 * (1 - j / bSteps)),
              alpha: 0.85,
            });

            bX = nbX;
            bY = nbY;
          }
        }

        curX = nextX;
        curY = nextY;
      }

      return {
        segments,
        branches,
        createdAt: performance.now(),
        duration: 380, // 380ms multi-strobe lifetime
      };
    };

    const triggerThunderStrike = () => {
      // 1. Spawn primary and optional twin secondary bolt
      const bolt1 = generateLightningBolt();
      activeBolts.push(bolt1);

      if (Math.random() < 0.4) {
        setTimeout(() => {
          activeBolts.push(generateLightningBolt());
        }, 80);
      }

      // 2. Realistic 3-Step Strobe Flash Sequence (Initial -> Return Peak -> Fade)
      setFlashIntensity(0.85);
      setTimeout(() => setFlashIntensity(0.2), 60);
      setTimeout(() => setFlashIntensity(1.0), 120); // Peak return stroke!
      setTimeout(() => setFlashIntensity(0.35), 200);
      setTimeout(() => setFlashIntensity(0), 380);
    };

    // =========================================================
    // 3. MAIN RENDER LOOP
    // =========================================================
    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      ctx.clearRect(0, 0, width, height);

      if (!isRaining) return;

      // Draw Rain Drops
      ctx.lineCap = "round";

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.lineWidth = d.thickness;
        ctx.strokeStyle = `rgba(186, 230, 253, ${d.opacity})`;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 5, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x -= 2.2; // wind slant

        if (d.y > height - 10) {
          if (Math.random() < 0.4 && splashes.length < 40) {
            splashes.push({
              x: d.x,
              y: d.y,
              radius: 1,
              maxRadius: Math.random() * 10 + 5,
              opacity: 0.7,
            });
          }
          d.y = -d.length;
          d.x = Math.random() * (width + 200);
        }
      }

      // Draw Splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${s.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        s.radius += 0.9;
        s.opacity -= 0.04;

        if (s.opacity <= 0 || s.radius >= s.maxRadius) {
          splashes.splice(i, 1);
        }
      }

      // =========================================================
      // DRAW GLOWING FORKED LIGHTNING BOLTS
      // =========================================================
      const now = performance.now();
      for (let bIdx = activeBolts.length - 1; bIdx >= 0; bIdx--) {
        const bolt = activeBolts[bIdx];
        const age = now - bolt.createdAt;
        if (age > bolt.duration) {
          activeBolts.splice(bIdx, 1);
          continue;
        }

        // Strobe flicker calculation
        const flicker = Math.sin(age * 0.1) > -0.3 ? (1 - age / bolt.duration) : 0.2;

        ctx.save();
        ctx.lineJoin = "miter";
        ctx.lineCap = "round";

        // 1. Electric Outer Blue Glow Pass
        ctx.shadowColor = "rgba(56, 189, 248, 0.95)";
        ctx.shadowBlur = 24;

        // Draw main segments (Electric Cyan Glow)
        for (let i = 0; i < bolt.segments.length; i++) {
          const seg = bolt.segments[i];
          ctx.lineWidth = seg.width * 2.2;
          ctx.strokeStyle = `rgba(56, 189, 248, ${flicker * 0.8})`;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // 2. Pure White Core Hot Bolt Pass
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ffffff";

        for (let i = 0; i < bolt.segments.length; i++) {
          const seg = bolt.segments[i];
          ctx.lineWidth = seg.width;
          ctx.strokeStyle = `rgba(255, 255, 255, ${flicker * 0.98})`;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // 3. Draw Fork Branches
        for (let i = 0; i < bolt.branches.length; i++) {
          const br = bolt.branches[i];
          ctx.lineWidth = br.width;
          ctx.strokeStyle = `rgba(186, 230, 253, ${flicker * br.alpha})`;
          ctx.beginPath();
          ctx.moveTo(br.x1, br.y1);
          ctx.lineTo(br.x2, br.y2);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Spontaneous Lightning Strike Scheduler
      if (time > nextLightningTime) {
        triggerThunderStrike();
        nextLightningTime = time + 4500 + Math.random() * 5500; // Strikes every 4.5 - 10s
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isRaining]);

  return (
    <>
      {/* Fullscreen Canvas for Lightning Bolts, Raindrops & Splashes */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-1000 ${
          isRaining ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Atmospheric Dark Storm Clouds Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none z-10 transition-colors duration-1000 ${
          isRaining
            ? "bg-slate-950/30 backdrop-saturate-[1.15] backdrop-brightness-[0.9]"
            : "bg-transparent"
        }`}
      />

      {/* Full-Sky Thunder Lighting Flash (Electric Blue / White Flash) */}
      <div
        className="fixed inset-0 pointer-events-none z-20 transition-opacity duration-75"
        style={{
          backgroundColor: "rgba(224, 242, 254, 0.42)",
          opacity: isRaining ? flashIntensity : 0,
          mixBlendMode: "screen",
        }}
      />

      {/* Interactive Weather Controller Pill Badge */}
      <div className="fixed top-20 right-4 md:top-24 md:right-8 z-30 pointer-events-auto">
        <button
          onClick={onToggleRain}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
            isRaining
              ? "bg-slate-900/95 text-cyan-300 border-cyan-400 shadow-cyan-500/30 animate-pulse"
              : "bg-white/85 text-slate-700 border-slate-200/80 hover:bg-white"
          }`}
          title="Click to toggle rain and see dramatic lightning and Babyco's umbrella! ⚡🌧️☂️"
        >
          <span>{isRaining ? "⚡ Rain & Thunder (On)" : "☀️ Sunny (Click for Thunder)"}</span>
          <span className="text-sm">{isRaining ? "⚡🌧️" : "☀️"}</span>
        </button>
      </div>
    </>
  );
};
