"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface GrasshopperMascotProps {
  isRaining?: boolean;
}

type BabycoMood = 
  | "idle" 
  | "sprinting" 
  | "hover_glide" 
  | "corkscrew" 
  | "peekaboo" 
  | "inspecting" 
  | "sleeping" 
  | "orbiting" 
  | "happy_bounce" 
  | "drawing_umbrella"
  | "holding_umbrella"
  | "stowing_umbrella"
  | "scroll_surf";

const BABYCO_GREETINGS = [
  "Hi, I'm Babyco! 👋 Welcome to Ignito!",
  "Babyco is orbiting your cursor! 🛸✨",
  "Woohoo! 3D Corkscrew leap! 🌪️🦗",
  "Peekaboo! Babyco found you! 🙈✨",
  "Surfing the website clouds with Babyco! 🏄‍♂️☁️",
  "Need a quick project quote? Tap the form! 📋✨",
  "Babyco loves smart enterprise code! 💻🚀",
  "Chat with our team on WhatsApp! Babyco says hi! 💬",
  "Look at Babyco's 360° aerodynamics! 🪂✨",
];

const RAIN_GREETINGS = [
  "Oh look! It's raining! 🌧️ Babyco popped her umbrella! ☂️✨",
  "Staying cozy & dry under my umbrella! 🌧️☂️",
  "Listen to the raindrops on the clouds! 🌧️🎵",
  "Babyco loves rainy day coding! ☕💻🌧️",
];

export const GrasshopperMascot: React.FC<GrasshopperMascotProps> = ({ isRaining = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [speechText, setSpeechText] = useState("Hi, I'm Babyco! 👋 Welcome to Ignito!");
  const [speechVisible, setSpeechVisible] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; symbol: string }[]>([]);

  const moodRef = useRef<BabycoMood>("idle");
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const greetingIndexRef = useRef(0);
  const clickCountRef = useRef(0);
  const isRainingRef = useRef(isRaining);

  useEffect(() => {
    isRainingRef.current = isRaining;
  }, [isRaining]);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768 || "ontouchstart" in window;

    // =========================================================
    // 1. THREE.JS SCENE SETUP
    // =========================================================
    const width = 200;
    const height = 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 3.6);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Studio Lights - Exact Localhost
    const ambientLight = new THREE.AmbientLight(0xf0fdf4, 1.55);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.85);
    mainLight.position.set(3, 5, 4);
    scene.add(mainLight);

    const backRimLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    backRimLight.position.set(-3, 3, -4);
    scene.add(backRimLight);

    const leftFillLight = new THREE.DirectionalLight(0x4ade80, 1.3);
    leftFillLight.position.set(-4, 2, 2);
    scene.add(leftFillLight);

    const bottomWarmFill = new THREE.PointLight(0xfef08a, 0.95, 10);
    bottomWarmFill.position.set(0, -1, 2);
    scene.add(bottomWarmFill);

    // =========================================================
    // 2. 3D BABYCO PROCEDURAL MODEL
    // =========================================================
    const mascotGroup = new THREE.Group();
    scene.add(mascotGroup);

    // Exact Localhost Colors
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.26, metalness: 0.16 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.35, metalness: 0.08 });
    const carapaceMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.22, metalness: 0.25 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.32 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.05, metalness: 0.95 });
    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.12, metalness: 0.2, transparent: true, opacity: 0.88 });
    const underWingMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.1, transparent: true, opacity: 0.65 });

    // Torso / Thorax
    const thoraxGeo = new THREE.SphereGeometry(0.32, 24, 24);
    thoraxGeo.scale(1, 0.9, 1.25);
    const thorax = new THREE.Mesh(thoraxGeo, bodyMat);
    thorax.position.set(0, 0.15, 0);
    mascotGroup.add(thorax);

    const carapaceGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.52, 16);
    carapaceGeo.rotateX(Math.PI / 2);
    carapaceGeo.scale(1.05, 0.52, 1);
    const carapace = new THREE.Mesh(carapaceGeo, carapaceMat);
    carapace.position.set(0, 0.12, -0.05);
    thorax.add(carapace);

    const abdomenGeo = new THREE.ConeGeometry(0.24, 0.72, 20);
    abdomenGeo.rotateX(-Math.PI / 2.3);
    const abdomen = new THREE.Mesh(abdomenGeo, bellyMat);
    abdomen.position.set(0, 0.12, -0.42);
    thorax.add(abdomen);

    for (let i = 1; i <= 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.2 - i * 0.04, 0.012, 8, 20);
      ringGeo.rotateX(Math.PI / 2.3);
      const ring = new THREE.Mesh(ringGeo, accentMat);
      ring.position.set(0, 0.14 - i * 0.03, -0.28 - i * 0.1);
      thorax.add(ring);
    }

    // Wings
    const wingGeo = new THREE.CylinderGeometry(0.02, 0.16, 0.88, 16);
    wingGeo.rotateX(-Math.PI / 2.2);
    wingGeo.scale(1.4, 0.3, 1);

    const leftWingRoot = new THREE.Group();
    leftWingRoot.position.set(0.08, 0.18, -0.15);
    thorax.add(leftWingRoot);
    const leftOuterWing = new THREE.Mesh(wingGeo, wingMat);
    leftOuterWing.position.set(0, 0, -0.22);
    leftWingRoot.add(leftOuterWing);
    const leftInnerWing = new THREE.Mesh(wingGeo, underWingMat);
    leftInnerWing.position.set(0, -0.02, -0.2);
    leftInnerWing.scale.set(0.9, 0.25, 0.9);
    leftWingRoot.add(leftInnerWing);

    const rightWingRoot = new THREE.Group();
    rightWingRoot.position.set(-0.08, 0.18, -0.15);
    thorax.add(rightWingRoot);
    const rightOuterWing = new THREE.Mesh(wingGeo, wingMat);
    rightOuterWing.position.set(0, 0, -0.22);
    rightWingRoot.add(rightOuterWing);
    const rightInnerWing = new THREE.Mesh(wingGeo, underWingMat);
    rightInnerWing.position.set(0, -0.02, -0.2);
    rightInnerWing.scale.set(0.9, 0.25, 0.9);
    rightWingRoot.add(rightInnerWing);

    // Head
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.22, 0.32);
    thorax.add(headPivot);

    const headGeo = new THREE.SphereGeometry(0.26, 24, 24);
    headGeo.scale(1.05, 1.15, 1);
    const head = new THREE.Mesh(headGeo, bodyMat);
    headPivot.add(head);

    const cheekMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.45 });
    const cheekGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(0.18, -0.06, 0.18);
    head.add(leftCheek);
    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(-0.18, -0.06, 0.18);
    head.add(rightCheek);

    const eyeGeo = new THREE.SphereGeometry(0.095, 20, 20);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.16, 0.08, 0.18);
    head.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.16, 0.08, 0.18);
    head.add(rightEye);

    const highlightGeo = new THREE.SphereGeometry(0.028, 12, 12);
    const leftHighlight = new THREE.Mesh(highlightGeo, eyeHighlightMat);
    leftHighlight.position.set(0.03, 0.03, 0.08);
    leftEye.add(leftHighlight);
    const rightHighlight = new THREE.Mesh(highlightGeo, eyeHighlightMat);
    rightHighlight.position.set(-0.03, 0.03, 0.08);
    rightEye.add(rightHighlight);

    const eyelidGeo = new THREE.SphereGeometry(0.105, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    const leftEyelid = new THREE.Mesh(eyelidGeo, bodyMat);
    leftEyelid.position.copy(leftEye.position);
    leftEyelid.scale.set(1, 0.01, 1);
    leftEyelid.rotation.x = Math.PI / 3;
    head.add(leftEyelid);
    const rightEyelid = new THREE.Mesh(eyelidGeo, bodyMat);
    rightEyelid.position.copy(rightEye.position);
    rightEyelid.scale.set(1, 0.01, 1);
    rightEyelid.rotation.x = Math.PI / 3;
    head.add(rightEyelid);

    const createAntenna = (isLeft: boolean) => {
      const group = new THREE.Group();
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.06 : -0.06, 0.22, 0.08),
        new THREE.Vector3(isLeft ? 0.14 : -0.14, 0.42, 0.04),
        new THREE.Vector3(isLeft ? 0.18 : -0.18, 0.52, -0.04),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.012, 8, false);
      const tube = new THREE.Mesh(tubeGeo, accentMat);
      group.add(tube);
      const bulbGeo = new THREE.SphereGeometry(0.028, 12, 12);
      const bulb = new THREE.Mesh(bulbGeo, new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2 }));
      bulb.position.set(isLeft ? 0.18 : -0.18, 0.52, -0.04);
      group.add(bulb);
      return group;
    };

    const leftAntenna = createAntenna(true);
    leftAntenna.position.set(0.09, 0.22, 0.12);
    head.add(leftAntenna);
    const rightAntenna = createAntenna(false);
    rightAntenna.position.set(-0.09, 0.22, 0.12);
    head.add(rightAntenna);

    // Front Legs
    const frontLegGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.28);
    const leftFrontLeg = new THREE.Mesh(frontLegGeo, accentMat);
    leftFrontLeg.position.set(0.24, -0.12, 0.18);
    leftFrontLeg.rotation.set(0.4, 0, -0.5);
    thorax.add(leftFrontLeg);

    const rightFrontLeg = new THREE.Mesh(frontLegGeo, accentMat);
    rightFrontLeg.position.set(-0.24, -0.12, 0.18);
    rightFrontLeg.rotation.set(0.4, 0, 0.5);
    thorax.add(rightFrontLeg);

    // Mid Legs
    const midLegGeo = new THREE.CylinderGeometry(0.018, 0.014, 0.3);
    const leftMidLeg = new THREE.Mesh(midLegGeo, accentMat);
    leftMidLeg.position.set(0.26, -0.1, 0);
    leftMidLeg.rotation.set(0, 0, -0.6);
    thorax.add(leftMidLeg);
    const rightMidLeg = new THREE.Mesh(midLegGeo, accentMat);
    rightMidLeg.position.set(-0.26, -0.1, 0);
    rightMidLeg.rotation.set(0, 0, 0.6);
    thorax.add(rightMidLeg);

    // Hind Legs
    const femurGeo = new THREE.CylinderGeometry(0.065, 0.03, 0.55, 16);
    femurGeo.scale(0.8, 1, 1.3);
    const leftHindLegGroup = new THREE.Group();
    leftHindLegGroup.position.set(0.24, 0.15, -0.15);
    thorax.add(leftHindLegGroup);
    const leftFemur = new THREE.Mesh(femurGeo, bodyMat);
    leftFemur.rotation.set(-0.65, 0.2, 0.45);
    leftFemur.position.set(0.12, 0.18, -0.12);
    leftHindLegGroup.add(leftFemur);
    const leftTibia = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.5, 12), accentMat);
    leftTibia.position.set(0.22, -0.08, -0.26);
    leftTibia.rotation.set(0.7, 0, 0.15);
    leftHindLegGroup.add(leftTibia);

    const rightHindLegGroup = new THREE.Group();
    rightHindLegGroup.position.set(-0.24, 0.15, -0.15);
    thorax.add(rightHindLegGroup);
    const rightFemur = new THREE.Mesh(femurGeo, bodyMat);
    rightFemur.rotation.set(-0.65, -0.2, -0.45);
    rightFemur.position.set(-0.12, 0.18, -0.12);
    rightHindLegGroup.add(rightFemur);
    const rightTibia = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.5, 12), accentMat);
    rightTibia.position.set(-0.22, -0.08, -0.26);
    rightTibia.rotation.set(0.7, 0, -0.15);
    rightHindLegGroup.add(rightTibia);

    // Ground Shadow
    const shadowGeo = new THREE.CircleGeometry(0.48, 24);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.25 });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.position.set(0, -0.28, 0);
    scene.add(groundShadow);

    // =========================================================
    // 3. ARTICULATED 3D UMBRELLA (MULTI-STAGE OPEN/CLOSE RIG)
    // =========================================================
    const umbrellaGroup = new THREE.Group();
    // Default origin hidden behind Babyco's back
    umbrellaGroup.position.set(0.1, -0.15, -0.25);
    umbrellaGroup.rotation.set(-0.4, 0.2, -0.3);
    thorax.add(umbrellaGroup);

    // Canopy Pivot (expands outward on open)
    const canopyPivot = new THREE.Group();
    canopyPivot.position.set(0, 0.44, 0);
    umbrellaGroup.add(canopyPivot);

    const canopyGeo = new THREE.ConeGeometry(0.48, 0.22, 18, 1, true);
    canopyGeo.scale(1, 1.15, 1);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // Amber Yellow
      roughness: 0.18,
      metalness: 0.12,
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 0, 0);
    canopyPivot.add(canopy);

    // Canopy Finial
    const finialMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25 });
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), finialMat);
    finial.position.set(0, 0.12, 0);
    canopyPivot.add(finial);

    // Shaft & J-Hook Handle
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.38 });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.58, 8), shaftMat);
    shaft.position.set(0, 0.22, 0);
    umbrellaGroup.add(shaft);

    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.07, 0),
      new THREE.Vector3(0, -0.13, 0),
      new THREE.Vector3(0.04, -0.16, 0),
      new THREE.Vector3(0.075, -0.12, 0),
    ]);
    const handle = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 14, 0.014, 8, false), shaftMat);
    umbrellaGroup.add(handle);

    // Initial Umbrella State: Folded tight & hidden
    canopyPivot.scale.set(0.12, 1, 0.12);
    umbrellaGroup.scale.setScalar(0.001);

    mascotGroup.position.set(0, 0, 0);
    mascotGroup.rotation.y = -0.45;

    // =========================================================
    // 4. BUTTER-SMOOTH PHYSICS & PROCEDURAL TIMING
    // =========================================================
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    let mousePixelX = window.innerWidth - 120;
    let mousePixelY = window.innerHeight - 120;

    let target360HeadingY = -0.45;
    let current360HeadingY = -0.45;

    let isBlinking = false;
    let blinkProgress = 0;
    let nextBlinkTime = performance.now() + 2500;

    let actionType: BabycoMood = "idle";
    let actionStartTime = 0;
    let actionDuration = 600;

    let currentPosOffsetX = 0;
    let currentPosOffsetY = 0;
    let targetPosOffsetX = 0;
    let targetPosOffsetY = 0;

    // Smooth Multi-Stage Umbrella Extraction Progress (0 = hidden behind back, 1 = fully popped open above head)
    let umbrellaDrawProgress = 0;
    let umbrellaTargetProgress = 0;
    let umbrellaTwirlAngle = 0;

    let lastActivityTime = performance.now();
    let nextSpontaneousActionTime = performance.now() + 4500;
    let lastScrollY = window.scrollY;

    const entryStartTime = performance.now();
    const entryDuration = 1800;
    let initialWelcomeTriggered = false;

    const ROAM_DESTINATIONS = [
      { x: 0, y: 0, heading: -0.45 },
      { x: -80, y: -140, heading: Math.PI * 0.8 },
      { x: -40, y: -280, heading: -Math.PI * 0.5 },
      { x: -130, y: -420, heading: Math.PI },
      { x: -180, y: -200, heading: Math.PI * 0.35 },
      { x: 40, y: -90, heading: -Math.PI * 0.8 },
    ];

    const emitSparkles = (symbol = "✨") => {
      const symbols = ["✨", "💫", "⭐", "💧", "🌧️"];
      const newSparkles = Array.from({ length: 7 }).map((_, i) => ({
        id: Date.now() + i + Math.random(),
        x: (Math.random() - 0.5) * 70,
        y: (Math.random() - 0.5) * 50,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      }));
      setSparkles(newSparkles);
      setTimeout(() => setSparkles([]), 850);
    };

    const showSpeech = (text: string, duration = 4000) => {
      setSpeechText(text);
      setSpeechVisible(true);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      speechTimerRef.current = setTimeout(() => {
        setSpeechVisible(false);
      }, duration);
    };

    const wakeUpBabyco = () => {
      lastActivityTime = performance.now();
      if (moodRef.current === "sleeping") {
        moodRef.current = "idle";
        setIsSleeping(false);
        triggerCorkscrew();
        leftEyelid.scale.y = 0.01;
        rightEyelid.scale.y = 0.01;
        showSpeech("Babyco is wide awake & energized! ⚡🦗", 2600);
      }
    };

    const triggerCorkscrew = () => {
      if (prefersReducedMotion || isRainingRef.current) return;
      actionType = "corkscrew";
      actionStartTime = performance.now();
      actionDuration = 1050;
      emitSparkles("💫");
    };

    const triggerSprint = () => {
      if (isRainingRef.current) return;
      actionType = "sprinting";
      actionStartTime = performance.now();
      actionDuration = 900;
      emitSparkles("⚡");
    };

    const triggerHoverGlide = () => {
      if (prefersReducedMotion || isRainingRef.current) return;
      actionType = "hover_glide";
      actionStartTime = performance.now();
      actionDuration = 1400;
      emitSparkles("🪂");
    };

    const triggerPeekaboo = () => {
      if (isRainingRef.current) return;
      actionType = "peekaboo";
      actionStartTime = performance.now();
      actionDuration = 1800;
      showSpeech("Peekaboo! Babyco found you! 🙈✨", 2600);
    };

    const triggerInspect = () => {
      actionType = "inspecting";
      actionStartTime = performance.now();
      actionDuration = 2000;
      showSpeech("Babyco inspecting code... 100% clean! 🧐💻", 2600);
    };

    const triggerHappyBounce = () => {
      actionType = "happy_bounce";
      actionStartTime = performance.now();
      actionDuration = 1200;
      emitSparkles(isRainingRef.current ? "💧" : "⭐");
    };

    const triggerOrbit = () => {
      if (prefersReducedMotion || isMobile || isRainingRef.current) return;
      wakeUpBabyco();
      actionType = "orbiting";
      actionStartTime = performance.now();
      actionDuration = 8000;
      emitSparkles("🛸");
      showSpeech("Babyco orbiting your cursor in 3D! 🛸✨", 3200);
    };

    const triggerSpontaneousStunt = () => {
      if (actionType !== "idle" || prefersReducedMotion || isMobile || moodRef.current === "sleeping") return;

      const dest = ROAM_DESTINATIONS[Math.floor(Math.random() * ROAM_DESTINATIONS.length)];
      targetPosOffsetX = dest.x + (Math.random() - 0.5) * 45;
      targetPosOffsetY = dest.y + (Math.random() - 0.5) * 45;
      target360HeadingY = dest.heading;

      if (isRainingRef.current) {
        // In rain, subtle cute hops or umbrella spins
        if (Math.random() < 0.5) {
          triggerHappyBounce();
          umbrellaTwirlAngle += Math.PI * 2;
        } else {
          triggerInspect();
        }
      } else {
        const rnd = Math.random();
        if (rnd < 0.2) triggerCorkscrew();
        else if (rnd < 0.4) triggerHoverGlide();
        else if (rnd < 0.6) triggerSprint();
        else if (rnd < 0.75) triggerPeekaboo();
        else if (rnd < 0.9) triggerHappyBounce();
        else triggerInspect();
      }

      if (Math.random() < 0.3 && !speechVisible) {
        const text = isRainingRef.current 
          ? RAIN_GREETINGS[Math.floor(Math.random() * RAIN_GREETINGS.length)]
          : BABYCO_GREETINGS[Math.floor(Math.random() * BABYCO_GREETINGS.length)];
        showSpeech(text, 3400);
      }
    };

    const handleTapBabyco = () => {
      wakeUpBabyco();
      clickCountRef.current += 1;
      const count = clickCountRef.current;

      if (isRainingRef.current) {
        umbrellaTwirlAngle += Math.PI * 2; // Smooth continuous twirl
        emitSparkles("💧");
        const rainMsg = RAIN_GREETINGS[greetingIndexRef.current % RAIN_GREETINGS.length];
        greetingIndexRef.current += 1;
        showSpeech(rainMsg, 3200);
        return;
      }

      if (count % 6 === 1) {
        triggerOrbit();
      } else if (count % 6 === 2) {
        triggerCorkscrew();
        showSpeech("Look at Babyco's 3D Corkscrew leap! 🌪️✨", 2500);
      } else if (count % 6 === 3) {
        triggerHoverGlide();
        showSpeech("Babyco spreading wings to glide! 🪂✨", 2500);
      } else if (count % 6 === 4) {
        triggerPeekaboo();
      } else if (count % 6 === 5) {
        triggerHappyBounce();
        showSpeech("Babyco is so happy to meet you! 🎉💃", 2600);
      } else {
        triggerInspect();
        const text = BABYCO_GREETINGS[greetingIndexRef.current % BABYCO_GREETINGS.length];
        greetingIndexRef.current += 1;
        showSpeech(text, 3200);
      }
    };

    const handleScroll = () => {
      wakeUpBabyco();
      const currentScroll = window.scrollY;
      const scrollDiff = Math.abs(currentScroll - lastScrollY);
      lastScrollY = currentScroll;

      if (scrollDiff > 120 && actionType === "idle" && !isMobile && !isRainingRef.current) {
        actionType = "scroll_surf";
        actionStartTime = performance.now();
        actionDuration = 950;
        targetPosOffsetY = THREE.MathUtils.clamp(targetPosOffsetY + (Math.random() - 0.5) * 110, -440, 20);
        emitSparkles("🏄‍♂️");
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      wakeUpBabyco();
      mousePixelX = e.clientX;
      mousePixelY = e.clientY;

      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angleToMouse = Math.atan2(dx, -dy);

      targetMouseX = THREE.MathUtils.clamp((e.clientX - centerX) / window.innerWidth * 2.4, -1, 1);
      targetMouseY = THREE.MathUtils.clamp(-(e.clientY - centerY) / window.innerHeight * 2.4, -0.8, 0.8);

      if (actionType === "idle" && !isMobile) {
        target360HeadingY = angleToMouse * 0.75 - 0.3;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("pointerdown", handleTapBabyco);

    // =========================================================
    // 5. MAIN RENDER LOOP WITH BUTTER-SMOOTH EASE LERPING
    // =========================================================
    let animationFrameId: number;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // =========================================================
      // SMOOTH MULTI-STAGE UMBRELLA EXTRACTION & POP-OPEN PHYSICS
      // =========================================================
      umbrellaTargetProgress = isRainingRef.current ? 1.0 : 0.0;
      umbrellaDrawProgress = THREE.MathUtils.lerp(umbrellaDrawProgress, umbrellaTargetProgress, 0.065);

      if (umbrellaDrawProgress > 0.005) {
        // Umbrella is active
        umbrellaGroup.scale.setScalar(Math.min(1.0, umbrellaDrawProgress * 1.5));

        // Smooth arc path: Starts behind back (-0.25 Z) -> swings up over head (+0.18 Y, +0.22 Z)
        const p = umbrellaDrawProgress;
        const currentPosX = THREE.MathUtils.lerp(0.08, 0.22, p);
        const currentPosY = THREE.MathUtils.lerp(-0.15, 0.22, p);
        const currentPosZ = THREE.MathUtils.lerp(-0.25, 0.18, p);
        umbrellaGroup.position.set(currentPosX, currentPosY, currentPosZ);

        // Smooth rotation tilt
        const rotX = THREE.MathUtils.lerp(-0.6, -0.15, p);
        const rotZ = THREE.MathUtils.lerp(-0.4, -0.18, p);
        umbrellaGroup.rotation.x = rotX;
        umbrellaGroup.rotation.z = rotZ;
        umbrellaGroup.rotation.y = THREE.MathUtils.lerp(umbrellaGroup.rotation.y, umbrellaTwirlAngle, 0.08);

        // Canopy opening spring blossom: Opens only once drawn above head (p > 0.55)
        if (p > 0.55) {
          const openProgress = (p - 0.55) / 0.45;
          // Spring overshoot easing: s-curve with soft spring bounce
          const springScale = Math.sin(openProgress * Math.PI * 0.5) * 1.0;
          canopyPivot.scale.set(
            Math.max(0.12, springScale),
            1.0,
            Math.max(0.12, springScale)
          );
        } else {
          canopyPivot.scale.set(0.12, 1.0, 0.12); // Slim folded umbrella
        }

        // Arm reaches up to hold handle naturally
        leftFrontLeg.rotation.set(-0.2 - p * 0.35, 0.2 + p * 0.15, -0.4 - p * 0.25);
      } else {
        umbrellaGroup.scale.setScalar(0.001);
        canopyPivot.scale.set(0.12, 1.0, 0.12);
        leftFrontLeg.rotation.set(0.4, 0, -0.5);
      }

      // Initial Entry
      const entryElapsed = time - entryStartTime;
      if (entryElapsed < entryDuration && !prefersReducedMotion) {
        const progress = entryElapsed / entryDuration;
        if (progress < 0.4) {
          const p = progress / 0.4;
          mascotGroup.position.x = THREE.MathUtils.lerp(1.8, 0.6, p);
          mascotGroup.rotation.y = -0.8;
          headPivot.rotation.y = 0.4;
        } else {
          const p = (progress - 0.4) / 0.6;
          const hopArc = Math.sin(p * Math.PI) * 0.45;
          mascotGroup.position.x = THREE.MathUtils.lerp(0.6, 0, p);
          mascotGroup.position.y = hopArc;
          groundShadow.scale.setScalar(1 - hopArc * 0.5);
          groundShadow.material.opacity = 0.25 - hopArc * 0.15;
          mascotGroup.rotation.y = THREE.MathUtils.lerp(-0.8, -0.45, p);
        }
      } else {
        if (!initialWelcomeTriggered) {
          initialWelcomeTriggered = true;
          showSpeech("Hi, I'm Babyco! 👋 Welcome to Ignito!", 4500);
          triggerCorkscrew();
        }
      }

      // Sleeping
      const idleTime = time - lastActivityTime;
      if (idleTime > 11000 && moodRef.current !== "sleeping" && !isMobile && actionType !== "orbiting" && !isRainingRef.current) {
        moodRef.current = "sleeping";
        setIsSleeping(true);
        setSpeechVisible(false);
      }

      // Spontaneous Stunts
      if (time > nextSpontaneousActionTime && !isMobile && moodRef.current !== "sleeping" && actionType === "idle") {
        triggerSpontaneousStunt();
        nextSpontaneousActionTime = time + 4500 + Math.random() * 4500;
      }

      // Orbit
      if (actionType === "orbiting") {
        const orbitElapsed = time - actionStartTime;
        if (orbitElapsed < actionDuration) {
          const anchorX = window.innerWidth - 110;
          const anchorY = window.innerHeight - 110;

          const angle = orbitElapsed * 0.003;
          const orbitRadiusX = 85;
          const orbitRadiusY = 55;

          const desiredOffsetX = (mousePixelX - anchorX) + Math.cos(angle) * orbitRadiusX;
          const desiredOffsetY = (mousePixelY - anchorY) + Math.sin(angle) * orbitRadiusY;

          targetPosOffsetX = THREE.MathUtils.clamp(desiredOffsetX, -(window.innerWidth - 160), 20);
          targetPosOffsetY = THREE.MathUtils.clamp(desiredOffsetY, -(window.innerHeight - 160), 20);

          target360HeadingY = angle + Math.PI / 2;

          const flutter = Math.sin(time * 0.045) * 0.4;
          leftWingRoot.rotation.z = -0.55 + flutter;
          rightWingRoot.rotation.z = 0.55 - flutter;

          mascotGroup.position.y = Math.sin(orbitElapsed * 0.006) * 0.18 + 0.12;
        } else {
          actionType = "idle";
          leftWingRoot.rotation.set(0, 0, 0);
          rightWingRoot.rotation.set(0, 0, 0);
          mascotGroup.position.y = 0;
          triggerHappyBounce();
          showSpeech("Landed safely on a cozy card! 🪑✨", 2800);
        }
      }

      // Butter-Smooth Position Translation Lerp
      const lerpFactor = actionType === "orbiting" ? 0.065 : 0.05;
      currentPosOffsetX = THREE.MathUtils.lerp(currentPosOffsetX, targetPosOffsetX, lerpFactor);
      currentPosOffsetY = THREE.MathUtils.lerp(currentPosOffsetY, targetPosOffsetY, lerpFactor);
      wrapper.style.transform = `translate3d(${currentPosOffsetX}px, ${currentPosOffsetY}px, 0)`;

      // Dynamic Character Poses
      if (moodRef.current === "sleeping") {
        leftEyelid.scale.y = 1;
        rightEyelid.scale.y = 1;
        headPivot.rotation.x = 0.2;
        headPivot.rotation.y = 0;
        leftAntenna.rotation.z = -0.35;
        rightAntenna.rotation.z = 0.35;
        const sleepBreath = Math.sin(time * 0.002) * 0.04;
        thorax.position.y = 0.1 + sleepBreath;
        leftWingRoot.rotation.z = 0;
        rightWingRoot.rotation.z = 0;
      } else {
        if (actionType === "idle") {
          current360HeadingY = THREE.MathUtils.lerp(current360HeadingY, target360HeadingY, 0.06);
          mascotGroup.rotation.y = current360HeadingY;
          mascotGroup.rotation.z = THREE.MathUtils.lerp(mascotGroup.rotation.z, 0, 0.08);
          mascotGroup.rotation.x = THREE.MathUtils.lerp(mascotGroup.rotation.x, 0, 0.08);

          currentMouseX = THREE.MathUtils.lerp(currentMouseX, targetMouseX, 0.07);
          currentMouseY = THREE.MathUtils.lerp(currentMouseY, targetMouseY, 0.07);

          if (isRainingRef.current) {
            // In rain, looks slightly upward enjoying the rain shelter
            headPivot.rotation.y = currentMouseX * 0.45;
            headPivot.rotation.x = THREE.MathUtils.lerp(headPivot.rotation.x, -0.35 - currentMouseY * 0.25, 0.06);
            headPivot.rotation.z = currentMouseX * 0.1;
          } else {
            headPivot.rotation.y = currentMouseX * 0.65;
            headPivot.rotation.x = -currentMouseY * 0.45;
            headPivot.rotation.z = currentMouseX * 0.15;
          }

          leftAntenna.rotation.z = THREE.MathUtils.lerp(leftAntenna.rotation.z, -currentMouseX * 0.35, 0.08);
          rightAntenna.rotation.z = THREE.MathUtils.lerp(rightAntenna.rotation.z, -currentMouseX * 0.35, 0.08);
        }

        // Stunts
        if (actionType === "corkscrew") {
          const p = (time - actionStartTime) / actionDuration;
          if (p < 1) {
            const h = Math.sin(p * Math.PI) * 0.75;
            mascotGroup.position.y = h;
            mascotGroup.rotation.y = current360HeadingY + p * Math.PI * 2;
            mascotGroup.rotation.x = -Math.sin(p * Math.PI) * 0.8;
            mascotGroup.rotation.z = Math.sin(p * Math.PI * 2) * 0.6;
            const wingSpread = Math.sin(p * Math.PI) * 0.8;
            leftWingRoot.rotation.z = -wingSpread;
            rightWingRoot.rotation.z = wingSpread;
          } else {
            actionType = "idle";
            mascotGroup.position.y = 0;
            mascotGroup.rotation.set(0, current360HeadingY, 0);
            leftWingRoot.rotation.set(0, 0, 0);
            rightWingRoot.rotation.set(0, 0, 0);
          }
        } else if (actionType === "hover_glide") {
          const p = (time - actionStartTime) / actionDuration;
          if (p < 1) {
            const h = Math.sin(p * Math.PI) * 0.6;
            mascotGroup.position.y = h;
            const flutter = Math.sin(time * 0.045) * 0.4;
            leftWingRoot.rotation.z = -0.7 + flutter;
            rightWingRoot.rotation.z = 0.7 - flutter;
            mascotGroup.rotation.z = Math.sin(p * Math.PI * 2) * 0.25;
          } else {
            actionType = "idle";
            mascotGroup.position.y = 0;
            mascotGroup.rotation.z = 0;
            leftWingRoot.rotation.set(0, 0, 0);
            rightWingRoot.rotation.set(0, 0, 0);
          }
        } else if (actionType === "sprinting") {
          const p = (time - actionStartTime) / actionDuration;
          if (p < 1) {
            mascotGroup.rotation.x = 0.25;
            leftFrontLeg.rotation.x = Math.sin(p * Math.PI * 14) * 0.7;
            rightFrontLeg.rotation.x = -Math.sin(p * Math.PI * 14) * 0.7;
            leftHindLegGroup.rotation.x = -Math.sin(p * Math.PI * 14) * 0.5;
            rightHindLegGroup.rotation.x = Math.sin(p * Math.PI * 14) * 0.5;
            mascotGroup.position.y = Math.abs(Math.sin(p * Math.PI * 14)) * 0.1;
          } else {
            actionType = "idle";
            mascotGroup.rotation.x = 0;
            mascotGroup.position.y = 0;
            leftFrontLeg.rotation.set(0.4, 0, -0.5);
            rightFrontLeg.rotation.set(0.4, 0, 0.5);
            leftHindLegGroup.rotation.set(0, 0, 0);
            rightHindLegGroup.rotation.set(0, 0, 0);
          }
        } else if (actionType === "peekaboo") {
          const p = (time - actionStartTime) / actionDuration;
          if (p < 0.4) {
            mascotGroup.position.y = -p * 1.5;
            leftEyelid.scale.y = 0.8;
            rightEyelid.scale.y = 0.8;
          } else if (p < 0.6) {
            mascotGroup.position.y = -0.6;
          } else {
            const pop = (p - 0.6) / 0.4;
            mascotGroup.position.y = Math.sin(pop * Math.PI) * 0.4;
            leftEyelid.scale.y = 0.01;
            rightEyelid.scale.y = 0.01;
            leftFrontLeg.rotation.x = 0.8;
            rightFrontLeg.rotation.x = 0.8;
          }
          if (p >= 1) {
            actionType = "idle";
            mascotGroup.position.y = 0;
            leftFrontLeg.rotation.set(0.4, 0, -0.5);
            rightFrontLeg.rotation.set(0.4, 0, 0.5);
          }
        } else if (actionType === "happy_bounce") {
          const p = (time - actionStartTime) / actionDuration;
          if (p < 1) {
            mascotGroup.position.y = Math.abs(Math.sin(p * Math.PI * 4)) * 0.35;
            mascotGroup.rotation.y = current360HeadingY + Math.sin(p * Math.PI * 4) * 0.3;
            leftAntenna.rotation.z = -0.4 + Math.sin(p * Math.PI * 8) * 0.4;
            rightAntenna.rotation.z = 0.4 - Math.sin(p * Math.PI * 8) * 0.4;
          } else {
            actionType = "idle";
            mascotGroup.position.y = 0;
          }
        } else if (actionType === "scroll_surf") {
          const p = (time - actionStartTime) / actionDuration;
          if (p < 1) {
            mascotGroup.position.y = Math.sin(p * Math.PI) * 0.5;
            mascotGroup.rotation.z = Math.sin(p * Math.PI * 2) * 0.35;
            const flutter = Math.sin(time * 0.05) * 0.3;
            leftWingRoot.rotation.z = -0.6 + flutter;
            rightWingRoot.rotation.z = 0.6 - flutter;
          } else {
            actionType = "idle";
            mascotGroup.position.y = 0;
            mascotGroup.rotation.z = 0;
            leftWingRoot.rotation.set(0, 0, 0);
            rightWingRoot.rotation.set(0, 0, 0);
          }
        } else if (actionType === "inspecting") {
          const p = (time - actionStartTime) / actionDuration;
          if (p < 1) {
            headPivot.rotation.z = Math.sin(p * Math.PI * 4) * 0.35;
            headPivot.rotation.x = -0.3 + Math.sin(p * Math.PI * 2) * 0.2;
            leftFrontLeg.rotation.x = 0.4 + Math.sin(p * Math.PI * 8) * 0.3;
          } else {
            actionType = "idle";
            leftFrontLeg.rotation.set(0.4, 0, -0.5);
          }
        }

        // Natural Breathing & Blinking
        const breath = Math.sin(time * 0.003) * 0.02;
        thorax.position.y = 0.15 + breath;

        if (time > nextBlinkTime && !isBlinking && actionType === "idle") {
          isBlinking = true;
          blinkProgress = 0;
        }
        if (isBlinking) {
          blinkProgress += 0.18;
          const blinkScale = Math.sin(blinkProgress * Math.PI);
          leftEyelid.scale.y = Math.max(0.01, blinkScale * 1.1);
          rightEyelid.scale.y = Math.max(0.01, blinkScale * 1.1);
          if (blinkProgress >= 1) {
            isBlinking = false;
            leftEyelid.scale.y = 0.01;
            rightEyelid.scale.y = 0.01;
            nextBlinkTime = time + 3000 + Math.random() * 4000;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("pointerdown", handleTapBabyco);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 md:bottom-24 md:right-8 z-30 pointer-events-none select-none transition-transform duration-500 ease-out"
      aria-label="Babyco 🦗✨ - 3D Interactive Mascot"
    >
      {/* Particle Burst Sparkles */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute text-yellow-400 font-extrabold text-sm pointer-events-none animate-ping"
          style={{
            left: `calc(50% + ${sp.x}px)`,
            top: `calc(50% + ${sp.y}px)`,
            animationDuration: "0.7s",
          }}
        >
          {sp.symbol}
        </div>
      ))}

      {/* Sleeping Zzz Bubble */}
      {isSleeping && (
        <div
          className="absolute -top-8 right-12 flex items-center gap-1 font-extrabold text-blue-600 bg-white/95 px-3 py-1 rounded-full border border-blue-200 shadow-lg text-xs animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          <span>💤</span>
          <span>Babyco is sleeping...</span>
        </div>
      )}

      {/* Pop-up Speech Bubble with Babyco Avatar */}
      <div
        className={`absolute bottom-[145px] sm:bottom-[165px] right-2 sm:right-6 min-w-[210px] max-w-[265px] p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-300 shadow-2xl text-xs font-bold text-slate-800 transition-all duration-300 transform pointer-events-auto ${
          speechVisible && !isSleeping
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-75 translate-y-3 pointer-events-none"
        }`}
        style={{
          boxShadow: "0 14px 30px -4px rgba(34, 197, 94, 0.28), 0 4px 12px rgba(15, 23, 42, 0.12)",
        }}
      >
        <div className="flex items-start gap-2">
          <span className="text-base flex-shrink-0">🦗</span>
          <div className="leading-snug">
            <span className="block text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mb-0.5">Babyco says:</span>
            <span>{speechText}</span>
          </div>
        </div>
        <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white border-r border-b border-emerald-300 transform rotate-45" />
      </div>

      {/* Babyco's 3D Canvas Trigger */}
      <div
        ref={containerRef}
        className="w-[150px] h-[150px] sm:w-[175px] sm:h-[175px] md:w-[200px] md:h-[200px] pointer-events-auto cursor-pointer filter drop-shadow-[0_10px_20px_rgba(15,23,42,0.22)] transition-transform duration-300 hover:scale-105 active:scale-95"
        title="Hi, I'm Babyco! Tap me for 3D corkscrew spins, umbrella twirls, and surfing! 🦗✨"
      />
    </div>
  );
};
