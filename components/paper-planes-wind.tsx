"use client";

import React, { useEffect, useState } from "react";

export const PaperPlanesWind: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[4] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* =========================================================
          1. VISIBLE FLOWING WIND STREAMLINES / AIR CURRENTS
          ========================================================= */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1600 1000"
      >
        <defs>
          {/* Gradient for Wind Stream 1 */}
          <linearGradient id="wind-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#93c5fd" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Gradient for Wind Stream 2 */}
          <linearGradient id="wind-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Gradient for Trailing Vapor */}
          <linearGradient id="trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Current 1: Upper High-Altitude Thermal Gust */}
        <path
          d="M-100,160 C320,60 580,260 920,130 C1250,10 1480,210 1800,120"
          fill="none"
          stroke="url(#wind-grad-1)"
          strokeWidth="2.5"
          strokeDasharray="180 800"
          className="wind-flow-anim-1"
        />

        {/* Current 2: Mid-Sky Swoop Wave */}
        <path
          d="M-100,420 C280,280 520,580 880,380 C1220,180 1450,480 1800,320"
          fill="none"
          stroke="url(#wind-grad-2)"
          strokeWidth="3"
          strokeDasharray="240 900"
          className="wind-flow-anim-2"
        />

        {/* Current 3: Lower-Altitude Playful Breeze */}
        <path
          d="M-100,740 C340,820 620,590 980,720 C1300,850 1520,640 1800,690"
          fill="none"
          stroke="url(#wind-grad-1)"
          strokeWidth="2.5"
          strokeDasharray="200 850"
          className="wind-flow-anim-3"
        />

        {/* Current 4: Deep Sky Rising Thermal */}
        <path
          d="M-100,900 C300,920 650,750 1020,840 C1380,920 1580,780 1800,820"
          fill="none"
          stroke="url(#wind-grad-2)"
          strokeWidth="2"
          strokeDasharray="160 950"
          className="wind-flow-anim-4"
        />
      </svg>

      {/* =========================================================
          2. AERODYNAMIC PAPER PLANES RIDING THE AIRFLOW
          ========================================================= */}

      {/* Plane 1: High-Altitude Swooper (Riding Current 1) */}
      <div className="absolute plane-runner plane-track-1">
        <div className="plane-rotator plane-bank-1">
          <PaperPlaneSVG size={36} />
        </div>
      </div>

      {/* Plane 2: Mid-Sky Wave Glider (Riding Current 2) */}
      <div className="absolute plane-runner plane-track-2">
        <div className="plane-rotator plane-bank-2">
          <PaperPlaneSVG size={28} />
        </div>
      </div>

      {/* Plane 3: Lower Breeze Cruiser (Riding Current 3) */}
      <div className="absolute plane-runner plane-track-3">
        <div className="plane-rotator plane-bank-3">
          <PaperPlaneSVG size={32} />
        </div>
      </div>

      {/* Plane 4: Gentle High Drifter (Delayed on Current 1) */}
      <div className="absolute plane-runner plane-track-4">
        <div className="plane-rotator plane-bank-1">
          <PaperPlaneSVG size={22} />
        </div>
      </div>

      {/* Plane 5: Dynamic Dive & Recover (Riding Current 2 with offset) */}
      <div className="absolute plane-runner plane-track-5">
        <div className="plane-rotator plane-bank-2">
          <PaperPlaneSVG size={30} />
        </div>
      </div>

      {/* Plane 6: Low Thermal Drifter (Riding Current 4) */}
      <div className="absolute plane-runner plane-track-6">
        <div className="plane-rotator plane-bank-3">
          <PaperPlaneSVG size={26} />
        </div>
      </div>
    </div>
  );
};

// Realistic 3D-Shaded Origami Paper Airplane (Facing Right 0deg for perfect tangent alignment)
const PaperPlaneSVG: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size * 0.65}px` }}
      className="relative drop-shadow-[0_8px_16px_rgba(15,23,42,0.38)] plane-flutter"
    >
      <svg
        viewBox="0 0 48 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Underbody Keel Shadow Fold */}
        <polygon
          points="6,15 24,19 46,15 24,17"
          fill="#1e3a8a"
          fillOpacity="0.45"
        />

        {/* Lower Left Wing Underbody */}
        <polygon
          points="2,26 46,15 22,17"
          fill="#cbd5e1"
          fillOpacity="0.95"
        />

        {/* Main Upper Left Wing */}
        <polygon
          points="2,26 46,15 22,14"
          fill="#f8fafc"
          fillOpacity="1"
        />

        {/* Main Upper Right Wing (Illuminated Sunlight Top) */}
        <polygon
          points="46,15 2,4 22,14"
          fill="#ffffff"
          fillOpacity="1"
        />

        {/* Center Spine Ridge Highlight */}
        <line
          x1="22"
          y1="14"
          x2="46"
          y2="15"
          stroke="#3b82f6"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />

        {/* Wing Fold Contrast Line */}
        <line
          x1="2"
          y1="4"
          x2="46"
          y2="15"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
};
