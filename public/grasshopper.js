/**
 * =======================================================================
 * IGNITO CORPORATION - BABYCO 3D MASCOT WITH DRAMATIC LIGHTNING & RAIN ⚡🌧️☂️
 * =======================================================================
 * Features:
 * - High-Voltage Procedural Branching Lightning Bolts & Strobe Flashes
 * - Smooth Multi-Stage Umbrella Extraction & Spring Blossom
 * - 3D Corkscrew Barrel Roll Leaps & Hover Glides
 * - Cursor Orbit Halo Mode & Peekaboo
 */

(function () {
  'use strict';

  const BABYCO_GREETINGS = [
    "Hi, I'm Babyco! 👋 Welcome to Ignito!",
    "Babyco is orbiting your cursor! 🛸✨",
    "Woohoo! 3D Corkscrew leap! 🌪️🦗",
    "Peekaboo! Babyco found you! 🙈✨",
    "Surfing the website clouds with Babyco! 🏄‍♂️☁️",
    "Need a quick project quote? Tap the form! 📋✨",
    "Babyco loves smart enterprise code! 💻🚀",
    "Chat with our team on WhatsApp! Babyco says hi! 💬",
    "Look at Babyco's 360° aerodynamics! 🪂✨"
  ];

  const RAIN_GREETINGS = [
    "⚡ Whoa! Look at that lightning strike! ⚡🌧️",
    "Staying cozy & dry under my umbrella! 🌧️☂️",
    "Listen to the thunder in the clouds! ⚡🌧️🎵",
    "Babyco loves rainy day coding! ☕💻🌧️"
  ];

  let greetingIndex = 0;
  let clickCount = 0;
  let speechBubbleEl = null;
  let sleepBubbleEl = null;
  let speechTimeout = null;
  let isSleepingState = false;
  let initialWelcomeTriggered = false;
  let isRainingGlobal = false;

  const MASCOT_CONFIG = {
    width: 200,
    height: 200,
    lerpSpeed: 0.08,
    mouseSensitivity: 2.4
  };

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobileOrTouch = ('ontouchstart' in window) || (window.innerWidth < 768);

  const ROAM_DESTINATIONS = [
    { x: 0, y: 0, heading: -0.45 },
    { x: -80, y: -140, heading: Math.PI * 0.8 },
    { x: -40, y: -280, heading: -Math.PI * 0.5 },
    { x: -130, y: -420, heading: Math.PI },
    { x: -180, y: -200, heading: Math.PI * 0.35 },
    { x: 40, y: -90, heading: -Math.PI * 0.8 }
  ];

  function showSpeechBubble(text, duration = 4000) {
    if (!speechBubbleEl || isSleepingState) return;
    speechBubbleEl.innerHTML = `<span style="font-size: 1.1rem; flex-shrink:0;">🦗</span> <div><span style="display:block; font-size:10px; font-weight:800; color:#16a34a; text-transform:uppercase; margin-bottom:2px;">Babyco says:</span><span>${text}</span></div><div class="mascot-speech-tail"></div>`;
    speechBubbleEl.classList.add('visible');

    if (speechTimeout) clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
      speechBubbleEl.classList.remove('visible');
    }, duration);
  }

  // --- High-Voltage Procedural Lightning & Rain Engine ---
  function initRainAndLightningFX() {
    const canvas = document.createElement('canvas');
    canvas.id = 'static-rain-lightning-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '15';
    canvas.style.transition = 'opacity 1s ease';
    canvas.style.opacity = '0';
    document.body.appendChild(canvas);

    const flashOverlay = document.createElement('div');
    flashOverlay.id = 'static-lightning-flash';
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.inset = '0';
    flashOverlay.style.pointerEvents = 'none';
    flashOverlay.style.zIndex = '16';
    flashOverlay.style.backgroundColor = 'rgba(224, 242, 254, 0.42)';
    flashOverlay.style.mixBlendMode = 'screen';
    flashOverlay.style.opacity = '0';
    flashOverlay.style.transition = 'opacity 0.08s ease';
    document.body.appendChild(flashOverlay);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const dropCount = Math.min(220, Math.floor(window.innerWidth / 6));
    const drops = Array.from({ length: dropCount }).map(() => ({
      x: Math.random() * (width + 200),
      y: Math.random() * height,
      length: Math.random() * 24 + 18,
      speed: Math.random() * 16 + 18,
      opacity: Math.random() * 0.45 + 0.35,
      thickness: Math.random() * 1.3 + 0.9
    }));

    const splashes = [];
    const activeBolts = [];
    let nextLightningTime = performance.now() + 3500;

    function generateLightningBolt() {
      const sx = Math.random() * (width * 0.7) + width * 0.15;
      const sy = 0;
      const targetX = sx + (Math.random() - 0.5) * (width * 0.4);
      const targetY = height * (0.6 + Math.random() * 0.35);

      const segments = [];
      const branches = [];
      let curX = sx;
      let curY = sy;
      const steps = 18;
      const dy = (targetY - sy) / steps;

      for (let i = 0; i < steps; i++) {
        const nextY = curY + dy;
        const sway = (Math.random() - 0.5) * 55;
        const nextX = curX + (targetX - curX) / (steps - i) + sway;

        segments.push({
          x1: curX, y1: curY, x2: nextX, y2: nextY,
          width: Math.max(1.8, 4.5 * (1 - i / steps)),
          alpha: 1.0
        });

        if (Math.random() < 0.38 && i > 3 && i < steps - 2) {
          let bX = nextX;
          let bY = nextY;
          const bSteps = Math.floor(Math.random() * 5 + 3);
          const bDir = Math.random() < 0.5 ? -1 : 1;

          for (let j = 0; j < bSteps; j++) {
            const nbY = bY + dy * 0.7;
            const nbX = bX + bDir * (Math.random() * 35 + 15) + (Math.random() - 0.5) * 20;
            branches.push({
              x1: bX, y1: bY, x2: nbX, y2: nbY,
              width: Math.max(0.8, 2.2 * (1 - j / bSteps)),
              alpha: 0.85
            });
            bX = nbX;
            bY = nbY;
          }
        }
        curX = nextX;
        curY = nextY;
      }

      return { segments, branches, createdAt: performance.now(), duration: 380 };
    }

    function triggerThunderStrike() {
      activeBolts.push(generateLightningBolt());
      if (Math.random() < 0.4) {
        setTimeout(() => activeBolts.push(generateLightningBolt()), 80);
      }
      flashOverlay.style.opacity = '0.85';
      setTimeout(() => { flashOverlay.style.opacity = '0.2'; }, 60);
      setTimeout(() => { flashOverlay.style.opacity = '1.0'; }, 120);
      setTimeout(() => { flashOverlay.style.opacity = '0.35'; }, 200);
      setTimeout(() => { flashOverlay.style.opacity = '0'; }, 380);
    }

    window.toggleStaticWeather = function() {
      isRainingGlobal = !isRainingGlobal;
      const btnText = document.getElementById('static-weather-btn-text');
      const btnIcon = document.getElementById('static-weather-btn-icon');
      const btn = document.getElementById('static-weather-toggle-btn');
      
      if (btnText && btnIcon) {
        if (isRainingGlobal) {
          btnText.textContent = '⚡ Rain & Thunder (On)';
          btnIcon.textContent = '⚡🌧️';
          if (btn) {
            btn.style.background = 'rgba(15, 23, 42, 0.95)';
            btn.style.color = '#67e8f9';
            btn.style.borderColor = '#38bdf8';
          }
          showSpeechBubble("Oh look! It's raining! 🌧️ Babyco popped her umbrella! ☂️✨", 4000);
        } else {
          btnText.textContent = '☀️ Sunny (Click for Thunder)';
          btnIcon.textContent = '☀️';
          if (btn) {
            btn.style.background = 'rgba(255, 255, 255, 0.9)';
            btn.style.color = '#334155';
            btn.style.borderColor = 'rgba(203,213,225,0.8)';
          }
          showSpeechBubble("The rain stopped! ☀️ Back to sunny skies! 🦗✨", 3500);
        }
      }
    };

    function renderWeather(time) {
      requestAnimationFrame(renderWeather);
      ctx.clearRect(0, 0, width, height);

      if (!isRainingGlobal) {
        canvas.style.opacity = '0';
        flashOverlay.style.opacity = '0';
        return;
      }
      canvas.style.opacity = '1';

      // Rain
      ctx.lineCap = 'round';
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.lineWidth = d.thickness;
        ctx.strokeStyle = `rgba(186, 230, 253, ${d.opacity})`;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 5, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x -= 2.2;

        if (d.y > height - 10) {
          if (Math.random() < 0.4 && splashes.length < 40) {
            splashes.push({ x: d.x, y: d.y, radius: 1, maxRadius: Math.random() * 10 + 5, opacity: 0.7 });
          }
          d.y = -d.length;
          d.x = Math.random() * (width + 200);
        }
      }

      // Splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${s.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        s.radius += 0.9;
        s.opacity -= 0.04;
        if (s.opacity <= 0 || s.radius >= s.maxRadius) splashes.splice(i, 1);
      }

      // Lightning
      const now = performance.now();
      for (let bIdx = activeBolts.length - 1; bIdx >= 0; bIdx--) {
        const bolt = activeBolts[bIdx];
        const age = now - bolt.createdAt;
        if (age > bolt.duration) {
          activeBolts.splice(bIdx, 1);
          continue;
        }

        const flicker = Math.sin(age * 0.1) > -0.3 ? (1 - age / bolt.duration) : 0.2;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.95)';
        ctx.shadowBlur = 24;

        // Glow
        for (let i = 0; i < bolt.segments.length; i++) {
          const seg = bolt.segments[i];
          ctx.lineWidth = seg.width * 2.2;
          ctx.strokeStyle = `rgba(56, 189, 248, ${flicker * 0.8})`;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // White Core
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        for (let i = 0; i < bolt.segments.length; i++) {
          const seg = bolt.segments[i];
          ctx.lineWidth = seg.width;
          ctx.strokeStyle = `rgba(255, 255, 255, ${flicker * 0.98})`;
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // Branches
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

      if (time > nextLightningTime) {
        triggerThunderStrike();
        nextLightningTime = time + 4500 + Math.random() * 5500;
      }
    }
    renderWeather();
  }

  function initGrasshopperMascot() {
    if (typeof THREE === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = initGrasshopperMascot;
      document.head.appendChild(script);
      return;
    }

    initRainAndLightningFX();

    let wrapper = document.getElementById('grasshopper-mascot-root');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'grasshopper-mascot-root';
      wrapper.className = 'grasshopper-mascot-container';
      wrapper.setAttribute('aria-label', 'Babyco 🦗✨ - 3D Interactive Mascot');
      wrapper.setAttribute('title', "Hi, I'm Babyco! Tap me for 3D corkscrew spins, lightning reactions, and surfing! 🦗✨");

      sleepBubbleEl = document.createElement('div');
      sleepBubbleEl.className = 'mascot-sleep-bubble';
      sleepBubbleEl.innerHTML = '<span>💤</span> <span>Babyco is sleeping...</span>';
      wrapper.appendChild(sleepBubbleEl);

      speechBubbleEl = document.createElement('div');
      speechBubbleEl.className = 'mascot-speech-bubble';
      wrapper.appendChild(speechBubbleEl);

      document.body.appendChild(wrapper);
    } else {
      speechBubbleEl = wrapper.querySelector('.mascot-speech-bubble');
      sleepBubbleEl = wrapper.querySelector('.mascot-sleep-bubble');
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, MASCOT_CONFIG.width / MASCOT_CONFIG.height, 0.1, 100);
    camera.position.set(0, 0.35, 3.6);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(MASCOT_CONFIG.width, MASCOT_CONFIG.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (renderer.outputEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    } else if (THREE.SRGBColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    if (THREE.ACESFilmicToneMapping) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
    }
    renderer.shadowMap.enabled = true;
    wrapper.appendChild(renderer.domElement);

    // Studio Lights - Ultra Vibrant High-Key Illumination
    const ambientLight = new THREE.AmbientLight(0xf0fdf4, 2.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.4);
    mainLight.position.set(3, 5, 4);
    scene.add(mainLight);

    const backRimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    backRimLight.position.set(-3, 3, -4);
    scene.add(backRimLight);

    const leftFillLight = new THREE.DirectionalLight(0x4ade80, 1.8);
    leftFillLight.position.set(-4, 2, 2);
    scene.add(leftFillLight);

    const bottomWarmFill = new THREE.PointLight(0xfef08a, 1.4, 10);
    bottomWarmFill.position.set(0, -1, 2);
    scene.add(bottomWarmFill);

    const mascotGroup = new THREE.Group();
    scene.add(mascotGroup);

    // High-Vibrancy Pixar-Grade 3D Materials
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: 0x22c55e, 
      emissive: 0x064e3b, 
      emissiveIntensity: 0.28, 
      roughness: 0.2, 
      metalness: 0.12 
    });
    const bellyMat = new THREE.MeshStandardMaterial({ 
      color: 0xa7f3d0, 
      emissive: 0x047857, 
      emissiveIntensity: 0.22, 
      roughness: 0.25, 
      metalness: 0.05 
    });
    const carapaceMat = new THREE.MeshStandardMaterial({ 
      color: 0x15803d, 
      emissive: 0x064e3b, 
      emissiveIntensity: 0.25, 
      roughness: 0.18, 
      metalness: 0.2 
    });
    const accentMat = new THREE.MeshStandardMaterial({ 
      color: 0x166534, 
      emissive: 0x052e16, 
      emissiveIntensity: 0.3, 
      roughness: 0.25 
    });
    const eyeMat = new THREE.MeshStandardMaterial({ 
      color: 0x090d16, 
      roughness: 0.02, 
      metalness: 0.95 
    });
    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const wingMat = new THREE.MeshStandardMaterial({ 
      color: 0x4ade80, 
      emissive: 0x059669, 
      emissiveIntensity: 0.3, 
      roughness: 0.08, 
      metalness: 0.2, 
      transparent: true, 
      opacity: 0.92 
    });
    const underWingMat = new THREE.MeshStandardMaterial({ 
      color: 0x6ee7b7, 
      emissive: 0x047857, 
      emissiveIntensity: 0.25, 
      roughness: 0.08, 
      transparent: true, 
      opacity: 0.75 
    });

    // Torso
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

    const createAntenna = (isLeft) => {
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

    // Legs
    const frontLegGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.28);
    const leftFrontLeg = new THREE.Mesh(frontLegGeo, accentMat);
    leftFrontLeg.position.set(0.24, -0.12, 0.18);
    leftFrontLeg.rotation.set(0.4, 0, -0.5);
    thorax.add(leftFrontLeg);
    const rightFrontLeg = new THREE.Mesh(frontLegGeo, accentMat);
    rightFrontLeg.position.set(-0.24, -0.12, 0.18);
    rightFrontLeg.rotation.set(0.4, 0, 0.5);
    thorax.add(rightFrontLeg);

    const midLegGeo = new THREE.CylinderGeometry(0.018, 0.014, 0.3);
    const leftMidLeg = new THREE.Mesh(midLegGeo, accentMat);
    leftMidLeg.position.set(0.26, -0.1, 0);
    leftMidLeg.rotation.set(0, 0, -0.6);
    thorax.add(leftMidLeg);
    const rightMidLeg = new THREE.Mesh(midLegGeo, accentMat);
    rightMidLeg.position.set(-0.26, -0.1, 0);
    rightMidLeg.rotation.set(0, 0, 0.6);
    thorax.add(rightMidLeg);

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

    const shadowGeo = new THREE.CircleGeometry(0.48, 24);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.25 });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.position.set(0, -0.28, 0);
    scene.add(groundShadow);

    // 3D UMBRELLA RIG
    const umbrellaGroup = new THREE.Group();
    umbrellaGroup.position.set(0.1, -0.15, -0.25);
    umbrellaGroup.rotation.set(-0.4, 0.2, -0.3);
    thorax.add(umbrellaGroup);

    const canopyPivot = new THREE.Group();
    canopyPivot.position.set(0, 0.44, 0);
    umbrellaGroup.add(canopyPivot);

    const canopyGeo = new THREE.ConeGeometry(0.48, 0.22, 18, 1, true);
    canopyGeo.scale(1, 1.15, 1);
    const canopyMat = new THREE.MeshStandardMaterial({ 
      color: 0xf59e0b, 
      emissive: 0xd97706, 
      emissiveIntensity: 0.35, 
      roughness: 0.15, 
      metalness: 0.15 
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopyPivot.add(canopy);

    const finial = new THREE.Mesh(
      new THREE.SphereGeometry(0.032, 12, 12), 
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.5, roughness: 0.2 })
    );
    finial.position.set(0, 0.12, 0);
    canopyPivot.add(finial);

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

    canopyPivot.scale.set(0.12, 1, 0.12);
    umbrellaGroup.scale.setScalar(0.001);

    mascotGroup.position.set(0, 0, 0);
    mascotGroup.rotation.y = -0.45;

    // Dynamics
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

    let actionType = "idle";
    let actionStartTime = 0;
    let actionDuration = 600;

    let currentPosOffsetX = 0;
    let currentPosOffsetY = 0;
    let targetPosOffsetX = 0;
    let targetPosOffsetY = 0;

    let umbrellaDrawProgress = 0;
    let umbrellaTargetProgress = 0;
    let umbrellaTwirlAngle = 0;

    let lastActivityTime = performance.now();
    let nextSpontaneousActionTime = performance.now() + 4500;
    let nextRainScheduleTime = performance.now() + 25000;
    let lastScrollY = window.scrollY;

    const entryStartTime = performance.now();
    const entryDuration = 1800;

    const wakeUpBabyco = () => {
      lastActivityTime = performance.now();
      if (isSleepingState) {
        isSleepingState = false;
        if (sleepBubbleEl) sleepBubbleEl.classList.remove('visible');
        triggerCorkscrew();
        leftEyelid.scale.y = 0.01;
        rightEyelid.scale.y = 0.01;
        showSpeechBubble("Babyco is wide awake & energized! ⚡🦗", 2600);
      }
    };

    const triggerCorkscrew = () => {
      if (prefersReducedMotion || isRainingGlobal) return;
      actionType = "corkscrew";
      actionStartTime = performance.now();
      actionDuration = 1050;
    };

    const triggerSprint = () => {
      if (isRainingGlobal) return;
      actionType = "sprinting";
      actionStartTime = performance.now();
      actionDuration = 900;
    };

    const triggerHoverGlide = () => {
      if (prefersReducedMotion || isRainingGlobal) return;
      actionType = "hover_glide";
      actionStartTime = performance.now();
      actionDuration = 1400;
    };

    const triggerPeekaboo = () => {
      if (isRainingGlobal) return;
      actionType = "peekaboo";
      actionStartTime = performance.now();
      actionDuration = 1800;
      showSpeechBubble("Peekaboo! Babyco found you! 🙈✨", 2600);
    };

    const triggerInspect = () => {
      actionType = "inspecting";
      actionStartTime = performance.now();
      actionDuration = 2000;
      showSpeechBubble("Babyco inspecting code... 100% clean! 🧐💻", 2600);
    };

    const triggerHappyBounce = () => {
      actionType = "happy_bounce";
      actionStartTime = performance.now();
      actionDuration = 1200;
    };

    const triggerOrbit = () => {
      if (prefersReducedMotion || isMobileOrTouch || isRainingGlobal) return;
      wakeUpBabyco();
      actionType = "orbiting";
      actionStartTime = performance.now();
      actionDuration = 8000;
      showSpeechBubble("Babyco orbiting your cursor in 3D! 🛸✨", 3200);
    };

    const triggerSpontaneousStunt = () => {
      if (actionType !== "idle" || prefersReducedMotion || isMobileOrTouch || isSleepingState) return;

      const dest = ROAM_DESTINATIONS[Math.floor(Math.random() * ROAM_DESTINATIONS.length)];
      targetPosOffsetX = dest.x + (Math.random() - 0.5) * 45;
      targetPosOffsetY = dest.y + (Math.random() - 0.5) * 45;
      target360HeadingY = dest.heading;

      if (isRainingGlobal) {
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

      if (Math.random() < 0.3 && (!speechBubbleEl || !speechBubbleEl.classList.contains('visible'))) {
        const text = isRainingGlobal
          ? RAIN_GREETINGS[Math.floor(Math.random() * RAIN_GREETINGS.length)]
          : BABYCO_GREETINGS[Math.floor(Math.random() * BABYCO_GREETINGS.length)];
        showSpeechBubble(text, 3400);
      }
    };

    const handleTapBabyco = () => {
      wakeUpBabyco();
      clickCount += 1;

      if (isRainingGlobal) {
        umbrellaTwirlAngle += Math.PI * 2;
        const rainMsg = RAIN_GREETINGS[greetingIndex % RAIN_GREETINGS.length];
        greetingIndex += 1;
        showSpeechBubble(rainMsg, 3200);
        return;
      }

      if (clickCount % 6 === 1) {
        triggerOrbit();
      } else if (clickCount % 6 === 2) {
        triggerCorkscrew();
        showSpeechBubble("Look at Babyco's 3D Corkscrew leap! 🌪️✨", 2500);
      } else if (clickCount % 6 === 3) {
        triggerHoverGlide();
        showSpeechBubble("Babyco spreading wings to glide! 🪂✨", 2500);
      } else if (clickCount % 6 === 4) {
        triggerPeekaboo();
      } else if (clickCount % 6 === 5) {
        triggerHappyBounce();
        showSpeechBubble("Babyco is so happy to meet you! 🎉💃", 2600);
      } else {
        triggerInspect();
        const text = BABYCO_GREETINGS[greetingIndex % BABYCO_GREETINGS.length];
        greetingIndex += 1;
        showSpeechBubble(text, 3200);
      }
    };

    const handleScroll = () => {
      wakeUpBabyco();
      const currentScroll = window.scrollY;
      const scrollDiff = Math.abs(currentScroll - lastScrollY);
      lastScrollY = currentScroll;

      if (scrollDiff > 120 && actionType === "idle" && !isMobileOrTouch && !isRainingGlobal) {
        actionType = "scroll_surf";
        actionStartTime = performance.now();
        actionDuration = 950;
        targetPosOffsetY = Math.max(-440, Math.min(20, targetPosOffsetY + (Math.random() - 0.5) * 110));
      }
    };

    const handleMouseMove = (e) => {
      wakeUpBabyco();
      mousePixelX = e.clientX;
      mousePixelY = e.clientY;

      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angleToMouse = Math.atan2(dx, -dy);

      targetMouseX = Math.max(-1, Math.min(1, dx / window.innerWidth * 2.4));
      targetMouseY = Math.max(-0.8, Math.min(0.8, -dy / window.innerHeight * 2.4));

      if (actionType === "idle" && !isMobileOrTouch) {
        target360HeadingY = angleToMouse * 0.75 - 0.3;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    wrapper.addEventListener('pointerdown', handleTapBabyco);

    function animate(time) {
      requestAnimationFrame(animate);

      // Rain Scheduler
      if (time > nextRainScheduleTime) {
        isRainingGlobal = !isRainingGlobal;
        if (isRainingGlobal) {
          showSpeechBubble("⚡ Whoa! Look at that lightning strike! ⚡🌧️", 4000);
          nextRainScheduleTime = time + 20000;
        } else {
          showSpeechBubble("The rain stopped! ☀️ Back to sunny skies! 🦗✨", 3500);
          nextRainScheduleTime = time + 35000;
        }
      }

      // Smooth Umbrella Extraction & Spring Blossom
      umbrellaTargetProgress = isRainingGlobal ? 1.0 : 0.0;
      umbrellaDrawProgress = THREE.MathUtils.lerp(umbrellaDrawProgress, umbrellaTargetProgress, 0.065);

      if (umbrellaDrawProgress > 0.005) {
        umbrellaGroup.scale.setScalar(Math.min(1.0, umbrellaDrawProgress * 1.5));
        const p = umbrellaDrawProgress;
        const currentPosX = THREE.MathUtils.lerp(0.08, 0.22, p);
        const currentPosY = THREE.MathUtils.lerp(-0.15, 0.22, p);
        const currentPosZ = THREE.MathUtils.lerp(-0.25, 0.18, p);
        umbrellaGroup.position.set(currentPosX, currentPosY, currentPosZ);

        const rotX = THREE.MathUtils.lerp(-0.6, -0.15, p);
        const rotZ = THREE.MathUtils.lerp(-0.4, -0.18, p);
        umbrellaGroup.rotation.x = rotX;
        umbrellaGroup.rotation.z = rotZ;
        umbrellaGroup.rotation.y = THREE.MathUtils.lerp(umbrellaGroup.rotation.y, umbrellaTwirlAngle, 0.08);

        if (p > 0.55) {
          const openProgress = (p - 0.55) / 0.45;
          const springScale = Math.sin(openProgress * Math.PI * 0.5) * 1.0;
          canopyPivot.scale.set(Math.max(0.12, springScale), 1.0, Math.max(0.12, springScale));
        } else {
          canopyPivot.scale.set(0.12, 1.0, 0.12);
        }
        leftFrontLeg.rotation.set(-0.2 - p * 0.35, 0.2 + p * 0.15, -0.4 - p * 0.25);
      } else {
        umbrellaGroup.scale.setScalar(0.001);
        canopyPivot.scale.set(0.12, 1.0, 0.12);
        leftFrontLeg.rotation.set(0.4, 0, -0.5);
      }

      // Entry
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
          showSpeechBubble("Hi, I'm Babyco! 👋 Welcome to Ignito!", 4500);
          triggerCorkscrew();
        }
      }

      // Sleeping
      const idleTime = time - lastActivityTime;
      if (idleTime > 11000 && !isSleepingState && !isMobileOrTouch && actionType !== "orbiting" && !isRainingGlobal) {
        isSleepingState = true;
        if (speechBubbleEl) speechBubbleEl.classList.remove('visible');
        if (sleepBubbleEl) sleepBubbleEl.classList.add('visible');
      }

      // Spontaneous Stunts
      if (time > nextSpontaneousActionTime && !isMobileOrTouch && !isSleepingState && actionType === "idle") {
        triggerSpontaneousStunt();
        nextSpontaneousActionTime = time + 4500 + Math.random() * 4500;
      }

      // 3D ORBIT
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

          targetPosOffsetX = Math.max(-(window.innerWidth - 160), Math.min(20, desiredOffsetX));
          targetPosOffsetY = Math.max(-(window.innerHeight - 160), Math.min(20, desiredOffsetY));

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
          showSpeechBubble("Landed safely on a cozy card! 🪑✨", 2800);
        }
      }

      const lerpFactor = actionType === "orbiting" ? 0.065 : 0.05;
      currentPosOffsetX = THREE.MathUtils.lerp(currentPosOffsetX, targetPosOffsetX, lerpFactor);
      currentPosOffsetY = THREE.MathUtils.lerp(currentPosOffsetY, targetPosOffsetY, lerpFactor);
      wrapper.style.transform = `translate3d(${currentPosOffsetX}px, ${currentPosOffsetY}px, 0)`;

      if (isSleepingState) {
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

          if (isRainingGlobal) {
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

        if (actionType === "corkscrew") {
          const p = (time - actionStartTime) / actionDuration;
          if (p < 1) {
            const h = Math.sin(p * Math.PI) * 0.75;
            mascotGroup.position.y = h;
            mascotGroup.rotation.y = current360HeadingY + p * Math.PI * 2;
            mascotGroup.rotation.x = -Math.sin(p * Math.PI) * 0.8;
            mascotGroup.rotation.z = Math.sin(p * Math.PI * 2) * 0.6;
            const spread = Math.sin(p * Math.PI) * 0.8;
            leftWingRoot.rotation.z = -spread;
            rightWingRoot.rotation.z = spread;
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

        const breath = Math.sin(time * 0.003) * 0.02;
        thorax.position.y = 0.15 + breath;

        if (MASCOT_CONFIG.enableBlinking) {
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
      }

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
  }

  function loadMascotCSS() {
    if (!document.getElementById('grasshopper-mascot-css')) {
      const link = document.createElement('link');
      link.id = 'grasshopper-mascot-css';
      link.rel = 'stylesheet';
      link.href = 'grasshopper.css';
      document.head.appendChild(link);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadMascotCSS();
      initGrasshopperMascot();
    });
  } else {
    loadMascotCSS();
    initGrasshopperMascot();
  }
})();
