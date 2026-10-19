/**
 * The Starlight Nexus - 3D Circular Portals Engine
 * Aman Sharma: The Young Worldsmith Portfolio
 * Powered by Three.js (r128) & Web Audio API
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // 1. Audio Engine for 3D Portals
  // -------------------------------------------------------------
  let audioCtx = null;
  let isMuted = localStorage.getItem('aman_muted') === 'true';

  const muteBtn = document.getElementById('mute-toggle-btn');
  const muteIcon = document.getElementById('mute-icon');
  const muteLabel = document.getElementById('mute-label');

  function updateMuteUI() {
    if (isMuted) {
      if (muteIcon) muteIcon.textContent = '🔇';
      if (muteLabel) muteLabel.textContent = 'Muted';
    } else {
      if (muteIcon) muteIcon.textContent = '🔔';
      if (muteLabel) muteLabel.textContent = 'Sound On';
    }
  }
  updateMuteUI();

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      localStorage.setItem('aman_muted', isMuted);
      updateMuteUI();
      if (!isMuted) playPortalTone(523.25, 0.25);
    });
  }

  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPortalTone(freq = 440, duration = 0.4, type = 'sine') {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function playWarpArpeggio(base = 523.25) {
    if (isMuted) return;
    const notes = [1, 1.25, 1.5, 2];
    notes.forEach((ratio, idx) => {
      setTimeout(() => playPortalTone(base * ratio, 0.75, 'sine'), idx * 75);
    });
  }

  // -------------------------------------------------------------
  // 2. The 6 Realms of Aman's Worldsmith Universe
  // -------------------------------------------------------------
  const PORTALS = [
    {
      id: 'myrail',
      name: "MyRail Orbit",
      badge: "Realm 01 · Infrastructure",
      desc: "Intelligent train transit and route navigation console connecting commuters across railway distances.",
      color: 0x00f5ff,
      colorHex: '#00f5ff',
      glowHex: 'rgba(0, 245, 255, 0.45)',
      symbol: "🚆",
      targetUrl: '/portal/myrail',
    },
    {
      id: 'inventra',
      name: "INVENTRA Vault",
      badge: "Realm 02 · Enterprise Core",
      desc: "Full-stack inventory management architecture orchestrating warehouse databases, suppliers, and dashboards.",
      color: 0xa855f7,
      colorHex: '#a855f7',
      glowHex: 'rgba(168, 85, 247, 0.45)',
      symbol: "📦",
      targetUrl: '/portal/inventra',
    },
    {
      id: 'civicconnect',
      name: "CivicConnect Pulse",
      badge: "Realm 03 · Public Good",
      desc: "Citizen reporting and municipal accountability platform empowering communities to demand real change.",
      color: 0x10b981,
      colorHex: '#10b981',
      glowHex: 'rgba(16, 185, 129, 0.45)',
      symbol: "🏛️",
      targetUrl: '/portal/civicconnect',
    },
    {
      id: 'codex',
      name: "The Worldsmith Codex",
      badge: "Realm 04 · Origin Chronicle",
      desc: "The 9-chapter story of a boy with too many dreams, learning that becoming someone is not a single event, but a process.",
      color: 0xfbbf24,
      colorHex: '#fbbf24',
      glowHex: 'rgba(251, 191, 36, 0.45)',
      symbol: "📖",
      targetUrl: '/portal/story',
    },
    {
      id: 'forge',
      name: "The Tech Forge",
      badge: "Realm 05 · Character Core",
      desc: "Meet Aman, The Young Worldsmith. Coding with C, Python, SQL, and Web Dev while carrying love for family.",
      color: 0xff759f,
      colorHex: '#ff759f',
      glowHex: 'rgba(255, 117, 159, 0.45)',
      symbol: "🪄",
      targetUrl: '/portal/about',
    },
    {
      id: 'beacon',
      name: "The Dreamers' Beacon",
      badge: "Realm 06 · Live Beacon",
      desc: "Persistent SQLite beacon where travelers leave thoughts, advice, and sparks of encouragement.",
      color: 0x38bdf8,
      colorHex: '#38bdf8',
      glowHex: 'rgba(56, 189, 248, 0.45)',
      symbol: "✨",
      targetUrl: '/portal/guestbook',
    },
  ];

  // -------------------------------------------------------------
  // 3. Three.js Scene Setup
  // -------------------------------------------------------------
  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060914, 0.00085);

  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 3000);
  camera.position.set(0, 35, 520);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const centerLight = new THREE.PointLight(0x00f5ff, 2.5, 900);
  centerLight.position.set(0, 0, 0);
  scene.add(centerLight);

  // Starfield
  const starsCount = 2400;
  const starsGeo = new THREE.BufferGeometry();
  const starsPos = new Float32Array(starsCount * 3);
  const starsColors = new Float32Array(starsCount * 3);

  const starColors = [
    new THREE.Color(0x00f5ff),
    new THREE.Color(0xa855f7),
    new THREE.Color(0xfbbf24),
    new THREE.Color(0xff759f),
    new THREE.Color(0xffffff),
  ];

  for (let i = 0; i < starsCount; i++) {
    const i3 = i * 3;
    const r = 400 + Math.random() * 1150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starsPos[i3] = r * Math.sin(phi) * Math.cos(theta);
    starsPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starsPos[i3 + 2] = r * Math.cos(phi);

    const c = starColors[Math.floor(Math.random() * starColors.length)];
    starsColors[i3] = c.r;
    starsColors[i3 + 1] = c.g;
    starsColors[i3 + 2] = c.b;
  }

  starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
  starsGeo.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

  const starsMat = new THREE.PointsMaterial({ size: 2.2, vertexColors: true, transparent: true, opacity: 0.85 });
  const starsMesh = new THREE.Points(starsGeo, starsMat);
  scene.add(starsMesh);

  // Central Starlight Octahedron Crystal
  const crystalGeo = new THREE.OctahedronGeometry(24, 0);
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0x00f5ff,
    emissive: 0x00f5ff,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true,
  });
  const centerCrystal = new THREE.Mesh(crystalGeo, crystalMat);
  scene.add(centerCrystal);

  // -------------------------------------------------------------
  // 4. Procedural Swirling Nebula Canvas Texture
  // -------------------------------------------------------------
  const vortexCanvas = document.createElement('canvas');
  vortexCanvas.width = 256;
  vortexCanvas.height = 256;
  const vortexCtx = vortexCanvas.getContext('2d');
  const vortexTexture = new THREE.CanvasTexture(vortexCanvas);

  let vortexTick = 0;
  function updateVortex() {
    vortexTick += 0.04;
    const cx = 128;
    const cy = 128;
    vortexCtx.clearRect(0, 0, 256, 256);

    const grad = vortexCtx.createRadialGradient(cx, cy, 10, cx, cy, 120);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.25, '#00f5ff');
    grad.addColorStop(0.55, '#a855f7');
    grad.addColorStop(0.85, '#0c1024');
    grad.addColorStop(1, '#060914');

    vortexCtx.fillStyle = grad;
    vortexCtx.beginPath();
    vortexCtx.arc(cx, cy, 125, 0, Math.PI * 2);
    vortexCtx.fill();

    // Spiral Nebula Arms
    vortexCtx.lineWidth = 3;
    for (let arm = 0; arm < 4; arm++) {
      vortexCtx.strokeStyle = `rgba(255, 255, 255, ${0.35 + 0.15 * Math.sin(vortexTick + arm)})`;
      vortexCtx.beginPath();
      for (let r = 5; r < 110; r += 4) {
        const theta = vortexTick * 1.5 + r * 0.08 + (arm * Math.PI) / 2;
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;
        if (r === 5) vortexCtx.moveTo(x, y);
        else vortexCtx.lineTo(x, y);
      }
      vortexCtx.stroke();
    }
    vortexTexture.needsUpdate = true;
  }

  // -------------------------------------------------------------
  // 5. Build 3D Circular Portal Carousel
  // -------------------------------------------------------------
  const carouselGroup = new THREE.Group();
  scene.add(carouselGroup);

  const RADIUS = 340;
  const portalMeshes = [];

  PORTALS.forEach((portal, idx) => {
    const portalGroup = new THREE.Group();
    const angle = (idx / PORTALS.length) * Math.PI * 2;

    portalGroup.position.x = Math.sin(angle) * RADIUS;
    portalGroup.position.z = Math.cos(angle) * RADIUS;
    portalGroup.position.y = 0;
    portalGroup.rotation.y = angle;

    // Torus Ring
    const ringGeo = new THREE.TorusGeometry(52, 4.2, 18, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: portal.color,
      emissive: portal.color,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.85,
    });
    portalGroup.add(new THREE.Mesh(ringGeo, ringMat));

    // Swirling Vortex Disc
    const discGeo = new THREE.CircleGeometry(48, 48);
    const discMat = new THREE.MeshBasicMaterial({
      map: vortexTexture,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    discMesh.position.z = -0.5;
    portalGroup.add(discMesh);

    // Floating Emoji Emblem Plane
    const emblemCanvas = document.createElement('canvas');
    emblemCanvas.width = 128;
    emblemCanvas.height = 128;
    const eCtx = emblemCanvas.getContext('2d');
    eCtx.font = '68px sans-serif';
    eCtx.textAlign = 'center';
    eCtx.textBaseline = 'middle';
    eCtx.fillText(portal.symbol, 64, 68);

    const emblemTex = new THREE.CanvasTexture(emblemCanvas);
    const emblemMat = new THREE.MeshBasicMaterial({ map: emblemTex, transparent: true, side: THREE.DoubleSide });
    const emblemMesh = new THREE.Mesh(new THREE.PlaneGeometry(42, 42), emblemMat);
    emblemMesh.position.z = 2.5;
    portalGroup.add(emblemMesh);

    portalGroup.userData = { index: idx, data: portal, angle: angle };
    carouselGroup.add(portalGroup);
    portalMeshes.push(portalGroup);
  });

  // -------------------------------------------------------------
  // 6. Interaction, Drag & Touch Physics
  // -------------------------------------------------------------
  let isDragging = false;
  let previousMouseX = 0;
  let targetRotationY = 0;
  let currentRotationY = 0;
  let activeIndex = 0;
  let isWarping = false;
  let lastUserInteraction = Date.now();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerDown(e) {
    if (isWarping) return;
    isDragging = true;
    previousMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    lastUserInteraction = Date.now();
  }

  function onPointerMove(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    if (!isDragging || isWarping) return;

    const deltaX = clientX - previousMouseX;
    previousMouseX = clientX;
    targetRotationY += deltaX * 0.0055;
    lastUserInteraction = Date.now();
  }

  function onPointerUp() {
    isDragging = false;
  }

  window.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  window.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (isWarping) return;
    if (e.key === 'ArrowRight') rotateToPortalIndex((activeIndex + 1) % PORTALS.length);
    else if (e.key === 'ArrowLeft') rotateToPortalIndex((activeIndex - 1 + PORTALS.length) % PORTALS.length);
    else if (e.key === 'Enter') warpIntoPortal(PORTALS[activeIndex]);
  });

  window.addEventListener('click', (e) => {
    if (isWarping || e.target.closest('.portal-ui-layer') || e.target.closest('button')) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(carouselGroup.children, true);

    if (intersects.length > 0) {
      let topObj = intersects[0].object;
      while (topObj.parent && topObj.parent !== carouselGroup) topObj = topObj.parent;
      if (topObj.userData && typeof topObj.userData.index === 'number') {
        const clickedIdx = topObj.userData.index;
        if (clickedIdx === activeIndex) warpIntoPortal(PORTALS[clickedIdx]);
        else rotateToPortalIndex(clickedIdx);
      }
    }
  });

  function rotateToPortalIndex(idx) {
    activeIndex = idx;
    const targetAngle = -((idx / PORTALS.length) * Math.PI * 2);

    let diff = (targetAngle - targetRotationY) % (Math.PI * 2);
    if (diff > Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;

    targetRotationY += diff;
    lastUserInteraction = Date.now();

    playPortalTone(400 + idx * 80, 0.35);
    updateHUD(PORTALS[idx]);
  }

  // -------------------------------------------------------------
  // 7. HUD & Navigation Bar
  // -------------------------------------------------------------
  const hudBadge = document.getElementById('hud-badge');
  const hudName = document.getElementById('hud-name');
  const hudDesc = document.getElementById('hud-desc');
  const hudCard = document.getElementById('portal-hud-card');
  const warpBtn = document.getElementById('hud-warp-btn');
  const pillsContainer = document.getElementById('portal-pills-row');

  if (pillsContainer) {
    pillsContainer.innerHTML = '';
    PORTALS.forEach((portal, idx) => {
      const pill = document.createElement('button');
      pill.className = `portal-dot-pill ${idx === 0 ? 'active' : ''}`;
      pill.style.setProperty('--pill-color', portal.colorHex);
      pill.style.setProperty('--pill-glow', portal.glowHex);
      pill.innerHTML = `<span>${portal.symbol}</span> ${portal.name}`;
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        rotateToPortalIndex(idx);
      });
      pillsContainer.appendChild(pill);
    });
  }

  function updateHUD(portal) {
    if (!portal) return;
    if (hudBadge) hudBadge.textContent = portal.badge;
    if (hudName) hudName.textContent = portal.name;
    if (hudDesc) hudDesc.textContent = portal.desc;

    if (hudCard) {
      hudCard.style.setProperty('--current-accent', portal.colorHex);
      hudCard.style.setProperty('--current-glow', portal.glowHex);
    }
    if (warpBtn) {
      warpBtn.style.setProperty('--current-accent', portal.colorHex);
      warpBtn.style.setProperty('--current-glow', portal.glowHex);
    }

    if (pillsContainer) {
      pillsContainer.querySelectorAll('.portal-dot-pill').forEach((p, i) => {
        if (i === activeIndex) p.classList.add('active');
        else p.classList.remove('active');
      });
    }
  }
  updateHUD(PORTALS[0]);

  if (warpBtn) {
    warpBtn.addEventListener('click', () => warpIntoPortal(PORTALS[activeIndex]));
  }

  // -------------------------------------------------------------
  // 8. Cinematic Warp Dive
  // -------------------------------------------------------------
  const warpOverlay = document.getElementById('warp-tunnel-overlay');

  function warpIntoPortal(portal) {
    if (isWarping || !portal) return;
    isWarping = true;

    playWarpArpeggio(523.25);

    const targetZ = 120;
    const startZ = camera.position.z;
    const startTime = performance.now();
    const duration = 850;

    if (warpOverlay) {
      setTimeout(() => warpOverlay.classList.add('active'), 400);
    }

    function animateWarp(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = Math.pow(progress, 3);

      camera.position.z = startZ + (targetZ - startZ) * ease;
      camera.fov = 52 + 45 * ease;
      camera.updateProjectionMatrix();

      if (progress < 1) {
        requestAnimationFrame(animateWarp);
      } else {
        let dest = portal.targetUrl;
        if (window.location.pathname.includes('/pip-port/')) {
          dest = '/pip-port' + dest + '/';
        }
        window.location.href = dest;
      }
    }
    requestAnimationFrame(animateWarp);
  }

  // -------------------------------------------------------------
  // 9. Main Animation Loop
  // -------------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);

    updateVortex();

    starsMesh.rotation.y += 0.0003;
    starsMesh.rotation.x += 0.0001;

    centerCrystal.rotation.x += 0.01;
    centerCrystal.rotation.y += 0.015;

    if (!isDragging && !isWarping && Date.now() - lastUserInteraction > 3500) {
      targetRotationY += 0.0012;
    }

    currentRotationY += (targetRotationY - currentRotationY) * 0.075;
    carouselGroup.rotation.y = currentRotationY;

    if (!isDragging) {
      let closestIdx = 0;
      let maxZ = -Infinity;

      portalMeshes.forEach((mesh, idx) => {
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        if (worldPos.z > maxZ) {
          maxZ = worldPos.z;
          closestIdx = idx;
        }
      });

      if (closestIdx !== activeIndex && !isWarping) {
        activeIndex = closestIdx;
        updateHUD(PORTALS[activeIndex]);
      }
    }

    const time = performance.now() * 0.0015;
    portalMeshes.forEach((mesh, i) => {
      mesh.position.y = Math.sin(time + i * 1.05) * 6;
      mesh.rotation.z = Math.sin(time + i) * 0.02;
    });

    if (!isWarping) {
      camera.position.x += (mouse.x * 35 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 25 + 35 - camera.position.y) * 0.04;
      camera.lookAt(0, 10, 0);
    }

    renderer.render(scene, camera);
  }
  // -------------------------------------------------------------
  // Custom Magic Wand Cursor & Stardust Trail
  // -------------------------------------------------------------
  const wandCursor = document.getElementById('magic-wand-cursor');
  let prevX = 0, prevY = 0;
  let wandTilt = -15;
  const sparkleRunes = ['{ }', '</>', '✦', '★', '✧', '⋆', '=>', '01', '⚡', '✨', '☁'];
  const sparkleColors = ['#00f5ff', '#a855f7', '#fbbf24', '#ff759f', '#38bdf8'];
  let lastSparkleTime = 0;

  window.addEventListener('mousemove', (e) => {
    const curX = e.clientX;
    const curY = e.clientY;

    if (wandCursor) {
      const velocityX = curX - prevX;
      wandTilt = Math.max(-45, Math.min(25, -15 + velocityX * 1.5));
      wandCursor.style.left = `${curX}px`;
      wandCursor.style.top = `${curY}px`;
      wandCursor.style.transform = `translate(-12%, -12%) rotate(${wandTilt}deg)`;
    }

    prevX = curX;
    prevY = curY;

    const now = Date.now();
    if (now - lastSparkleTime > 50) {
      lastSparkleTime = now;
      spawnWandSparkle(curX, curY);
    }
  });

  function spawnWandSparkle(x, y) {
    const sparkle = document.createElement('span');
    sparkle.className = 'magic-sparkle';
    sparkle.textContent = sparkleRunes[Math.floor(Math.random() * sparkleRunes.length)];

    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    sparkle.style.color = color;
    sparkle.style.textShadow = `0 0 10px ${color}`;
    sparkle.style.left = `${x + (Math.random() * 16 - 8)}px`;
    sparkle.style.top = `${y + (Math.random() * 16 - 8)}px`;

    const twX = (Math.random() * 60 - 30) + 'px';
    const twY = (-30 - Math.random() * 40) + 'px';
    sparkle.style.setProperty('--tw-x', twX);
    sparkle.style.setProperty('--tw-y', twY);

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 850);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
