/**
 * Aman Sharma: The Young Worldsmith · Interactive Experience Engine
 * Software Developer Portfolio & Creative Living World
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Web Audio Engine & Mute Switch (Strictly Enforced)
  // =========================================================================
  let audioCtx = null;
  let isMuted = localStorage.getItem('aman_muted') === 'true';

  const muteBtn = document.getElementById('mute-toggle-btn');
  const muteIcon = document.getElementById('mute-icon');
  const muteLabel = document.getElementById('mute-label');

  function updateMuteUI() {
    if (isMuted) {
      if (muteIcon) muteIcon.textContent = '🔇';
      if (muteLabel) muteLabel.textContent = 'Muted';
      if (synthPlaying) stopLullabySynth();
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
      if (!isMuted) playWandChime(523.25);
    });
  }

  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playWandChime(freq = 523.25, duration = 0.45, type = 'sine') {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

  // =========================================================================
  // 2. Custom Magic Wand Cursor & Stardust Runes
  // =========================================================================
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

    // Emit Stardust particles
    const now = Date.now();
    if (now - lastSparkleTime > 45) {
      lastSparkleTime = now;
      spawnWandSparkle(curX, curY);
    }

    // Eye Tracking & Perspective Tilt
    updateEyeTracking(curX, curY);
    updateCharacterCardTilt(curX, curY);
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

  // Chime feedback on clickable UI elements
  document.querySelectorAll('button, .btn-pill, a, .project-card, .chapter-card, .retro-badge-88x31').forEach((el) => {
    el.addEventListener('click', () => {
      const note = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
      playWandChime(note, 0.35);
    });
  });

  // =========================================================================
  // 3. Character Eye-Tracking & 3D Perspective Tilt
  // =========================================================================
  const leftPupil = document.getElementById('left-pupil');
  const rightPupil = document.getElementById('right-pupil');
  const leftEye = document.getElementById('left-eye');
  const rightEye = document.getElementById('right-eye');
  const holoCard = document.getElementById('character-holo-card');

  function updateEyeTracking(mouseX, mouseY) {
    [
      { eye: leftEye, pupil: leftPupil },
      { eye: rightEye, pupil: rightPupil }
    ].forEach(({ eye, pupil }) => {
      if (!eye || !pupil) return;
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = mouseX - eyeCenterX;
      const deltaY = mouseY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const maxDistance = 6; // Max pupil travel radius inside eye socket
      const dist = Math.min(maxDistance, Math.hypot(deltaX, deltaY) / 25);

      const offsetX = Math.cos(angle) * dist;
      const offsetY = Math.sin(angle) * dist;

      pupil.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    });
  }

  function updateCharacterCardTilt(mouseX, mouseY) {
    if (!holoCard) return;
    const rect = holoCard.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const diffX = (mouseX - cardCenterX) / (window.innerWidth / 2);
    const diffY = (mouseY - cardCenterY) / (window.innerHeight / 2);

    const tiltX = Math.max(-12, Math.min(12, -diffY * 12));
    const tiltY = Math.max(-12, Math.min(12, diffX * 12));

    holoCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  }

  // =========================================================================
  // 4. Day / Night Ambience Toggle (Changes Character Expression & Palette)
  // =========================================================================
  const moodBtn = document.getElementById('mood-toggle-btn');
  const moodIcon = document.getElementById('mood-icon');
  const moodLabel = document.getElementById('mood-label');
  const characterMoodStatus = document.getElementById('character-mood-status');
  let currentMood = localStorage.getItem('aman_mood') || 'night';

  function applyMood(mood) {
    if (mood === 'dawn') {
      document.body.classList.add('theme-dawn');
      if (moodIcon) moodIcon.textContent = '☀️';
      if (moodLabel) moodLabel.textContent = 'Dawn';
      if (characterMoodStatus) {
        characterMoodStatus.textContent = '☀️ Mode: Dawn Awakening Architect · Bringing Code to Light';
      }
    } else {
      document.body.classList.remove('theme-dawn');
      if (moodIcon) moodIcon.textContent = '🌙';
      if (moodLabel) moodLabel.textContent = 'Night';
      if (characterMoodStatus) {
        characterMoodStatus.textContent = '🌙 Mode: Midnight Sleepless Coder · Building in the Quiet Hours';
      }
    }
    localStorage.setItem('aman_mood', mood);
  }
  applyMood(currentMood);

  if (moodBtn) {
    moodBtn.addEventListener('click', () => {
      currentMood = currentMood === 'night' ? 'dawn' : 'night';
      applyMood(currentMood);
      playWandChime(783.99, 0.4);
    });
  }

  // =========================================================================
  // 5. Discoverable Hidden Easter Egg
  // =========================================================================
  const wandGemBtn = document.getElementById('secret-wand-gem');
  const eggBanner = document.getElementById('easter-egg-banner');
  let eggRevealed = false;

  function triggerEasterEgg() {
    if (eggBanner) {
      eggBanner.classList.add('revealed');
      eggBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Celebratory stardust explosion
    for (let i = 0; i < 24; i++) {
      setTimeout(() => {
        spawnWandSparkle(
          window.innerWidth * (0.2 + Math.random() * 0.6),
          window.innerHeight * (0.2 + Math.random() * 0.6)
        );
      }, i * 40);
    }
    // High celebratory harmonic chord
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => playWandChime(freq, 0.6), idx * 100);
    });
    eggRevealed = true;
  }

  if (wandGemBtn) {
    wandGemBtn.addEventListener('click', triggerEasterEgg);
  }

  // Keyboard shortcut secret: type 'code' or 'aman'
  let keyHistory = '';
  window.addEventListener('keydown', (e) => {
    keyHistory += e.key.toLowerCase();
    if (keyHistory.length > 8) keyHistory = keyHistory.slice(-8);
    if (keyHistory.includes('code') || keyHistory.includes('aman')) {
      if (!eggRevealed) triggerEasterEgg();
    }
  });

  // =========================================================================
  // 6. Flashlight / Torch Focus Mode (Canvas Destination-Out Mask)
  // =========================================================================
  const torchBtn = document.getElementById('torch-toggle-btn');
  const torchIcon = document.getElementById('torch-icon');
  const torchLabel = document.getElementById('torch-label');
  const torchCanvas = document.getElementById('torch-overlay-canvas');
  let isTorchOn = false;
  let torchCtx = null;

  if (torchCanvas) {
    torchCtx = torchCanvas.getContext('2d');
    function resizeTorch() {
      torchCanvas.width = window.innerWidth;
      torchCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeTorch);
    resizeTorch();
  }

  function drawTorchBeam(x, y) {
    if (!isTorchOn || !torchCtx || !torchCanvas) return;
    const w = torchCanvas.width;
    const h = torchCanvas.height;

    torchCtx.clearRect(0, 0, w, h);
    // Draw semi-opaque dark shroud
    torchCtx.fillStyle = 'rgba(6, 9, 20, 0.94)';
    torchCtx.fillRect(0, 0, w, h);

    // Carve out illuminated circular spotlight
    torchCtx.globalCompositeOperation = 'destination-out';
    const radius = 160;
    const grad = torchCtx.createRadialGradient(x, y, 20, x, y, radius);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    torchCtx.fillStyle = grad;
    torchCtx.beginPath();
    torchCtx.arc(x, y, radius, 0, Math.PI * 2);
    torchCtx.fill();

    torchCtx.globalCompositeOperation = 'source-over';
  }

  if (torchBtn) {
    torchBtn.addEventListener('click', () => {
      isTorchOn = !isTorchOn;
      document.body.classList.toggle('torch-active', isTorchOn);
      if (torchIcon) torchIcon.textContent = isTorchOn ? '🔦' : '🕯️';
      if (torchLabel) torchLabel.textContent = isTorchOn ? 'Torch: On' : 'Torch: Off';
      playWandChime(isTorchOn ? 880.0 : 440.0, 0.4);
      if (isTorchOn) drawTorchBeam(prevX || window.innerWidth / 2, prevY || window.innerHeight / 2);
    });
  }

  window.addEventListener('mousemove', (e) => {
    if (isTorchOn) drawTorchBeam(e.clientX, e.clientY);
  });

  // =========================================================================
  // 7. Scroll-Synced Transit Route Map
  // =========================================================================
  const transitPath = document.getElementById('transit-path');
  const transitTrainGroup = document.getElementById('transit-train-group');
  const transitSection = document.getElementById('dream-transit-map');

  function updateTransitScroll() {
    if (!transitPath || !transitTrainGroup || !transitSection) return;
    const rect = transitSection.getBoundingClientRect();
    const winH = window.innerHeight;

    // Calculate progression through the section (-1 to 1)
    const start = winH;
    const end = -rect.height;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

    const pathLen = transitPath.getTotalLength();
    const point = transitPath.getPointAtLength(progress * pathLen);

    transitTrainGroup.setAttribute('transform', `translate(${point.x}, ${point.y})`);
  }
  window.addEventListener('scroll', updateTransitScroll, { passive: true });
  updateTransitScroll();

  // =========================================================================
  // 8. Multi-Voice Generative Lullaby Synthesizer (Web Audio API)
  // =========================================================================
  const synthPlayBtn = document.getElementById('synth-play-btn');
  const synthPlayIcon = document.getElementById('synth-play-icon');
  const synthPlayLabel = document.getElementById('synth-play-label');
  const synthDroneToggle = document.getElementById('synth-drone-toggle');
  const droneStatusText = document.getElementById('drone-status-text');
  const synthVizColumns = document.querySelectorAll('.synth-viz-column');
  
  let synthPlaying = false;
  let synthTimer = null;
  let synthStep = 0;
  let isDroneOn = false;
  let droneOsc = null;
  let droneGain = null;
  let currentTempoMs = 450;
  let currentTexture = 'bells';

  // 7 Unique Musical Scales & Harmonic Mood Variations
  const LULLABY_SCALES = {
    midnight: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25], // C major pentatonic + 9th
    coder: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25],    // A minor pentatonic
    starlight: [164.81, 196.00, 246.94, 329.63, 392.00, 493.88, 587.33, 659.25], // E minor ethereal
    aurora: [174.61, 220.00, 261.63, 329.63, 392.00, 440.00, 523.25],   // F Lydian dream
    raindrop: [146.83, 155.56, 196.00, 220.00, 261.63, 293.66, 392.00], // Akebono / Japanese Zen
    cosmic: [277.18, 311.13, 369.99, 415.30, 466.16, 554.37, 622.25],   // C# Pentatonic cluster
    retro: [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]              // Warm 8-Bit Vintage
  };
  let currentPreset = 'midnight';

  // Advanced Synthesizer Voice Generator
  function playMultiVoiceNote(freq) {
    if (isMuted || !audioCtx) return;
    initAudio();

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Texture Waveform & Filter Shaping
      if (currentTexture === 'pad') {
        osc.type = 'triangle';
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 1.2);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        osc.connect(filter);
        filter.connect(gain);
      } else if (currentTexture === 'harp') {
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
        osc.connect(gain);

        // Add subtle harmonic octave overtone
        const overtone = audioCtx.createOscillator();
        const overGain = audioCtx.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2, now);
        overGain.gain.setValueAtTime(0.0001, now);
        overGain.gain.linearRampToValueAtTime(0.08, now + 0.01);
        overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        overtone.connect(overGain);
        overGain.connect(audioCtx.destination);
        overtone.start(now);
        overtone.stop(now + 0.5);
      } else if (currentTexture === 'chiptune') {
        osc.type = 'square';
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.connect(gain);
      } else {
        // 'bells' (Default crystal chime)
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
        osc.connect(gain);
      }

      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(freq, now);
      osc.start(now);
      osc.stop(now + 1.5);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Sub-Bass Ambient Continuous Drone Engine
  function startSubBassDrone() {
    if (droneOsc || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      droneOsc = audioCtx.createOscillator();
      droneGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      droneOsc.type = 'triangle';
      // Low sub root note (around 65Hz - 110Hz based on scale)
      const scale = LULLABY_SCALES[currentPreset] || LULLABY_SCALES.midnight;
      droneOsc.frequency.setValueAtTime(scale[0] / 4, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      droneGain.gain.setValueAtTime(0.0001, now);
      droneGain.gain.linearRampToValueAtTime(0.12, now + 0.8);

      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(audioCtx.destination);

      droneOsc.start(now);
    } catch (e) {}
  }

  function stopSubBassDrone() {
    if (droneOsc && droneGain && audioCtx) {
      try {
        const now = audioCtx.currentTime;
        droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        droneOsc.stop(now + 0.6);
      } catch (e) {}
      droneOsc = null;
      droneGain = null;
    }
  }

  // Generative Melodic Stepping
  function playSynthArpeggioStep() {
    if (!synthPlaying || isMuted) return;
    initAudio();
    if (!audioCtx) return;

    const scale = LULLABY_SCALES[currentPreset] || LULLABY_SCALES.midnight;
    
    // 10% chance for a breath rest for organic calming cadence
    if (Math.random() < 0.1) {
      synthVizColumns.forEach(c => c.style.height = '14%');
      return;
    }

    // Generative note walk
    if (Math.random() < 0.45) {
      synthStep = (synthStep + (Math.random() > 0.5 ? 1 : -1) + scale.length) % scale.length;
    } else {
      synthStep = Math.floor(Math.random() * scale.length);
    }

    let note = scale[synthStep];
    // 20% chance for octave jump
    if (Math.random() < 0.22) note *= 2;

    playMultiVoiceNote(note);

    // Update drone pitch gently with scale root
    if (isDroneOn && droneOsc && Math.random() < 0.15) {
      droneOsc.frequency.linearRampToValueAtTime(scale[0] / 4, audioCtx.currentTime + 0.5);
    }

    // Organic visualizer animation
    synthVizColumns.forEach((col, idx) => {
      const isPeak = idx === (synthStep % synthVizColumns.length);
      const heightPct = isPeak ? Math.min(95, 70 + Math.random() * 25) : Math.max(14, Math.random() * 55);
      col.style.height = `${heightPct}%`;
    });
  }

  function startLullabySynth() {
    if (isMuted) {
      alert("Sound is currently muted! Unmute via the bell icon in navigation to hear the lullaby.");
      return;
    }
    initAudio();
    synthPlaying = true;
    if (synthPlayIcon) synthPlayIcon.textContent = '⏸';
    if (synthPlayLabel) synthPlayLabel.textContent = 'Pause Lullaby';
    if (isDroneOn) startSubBassDrone();
    document.querySelectorAll('#lullaby-box-visual, #lullaby-box-visual-index').forEach(b => b.classList.add('playing'));
    synthTimer = setInterval(playSynthArpeggioStep, currentTempoMs);
  }

  function stopLullabySynth() {
    synthPlaying = false;
    if (synthTimer) clearInterval(synthTimer);
    if (synthPlayIcon) synthPlayIcon.textContent = '▶';
    if (synthPlayLabel) synthPlayLabel.textContent = 'Play Generative Lullaby';
    stopSubBassDrone();
    document.querySelectorAll('#lullaby-box-visual, #lullaby-box-visual-index').forEach(b => b.classList.remove('playing'));
    synthVizColumns.forEach(c => c.style.height = '12%');
  }

  if (synthPlayBtn) {
    synthPlayBtn.addEventListener('click', () => {
      if (synthPlaying) stopLullabySynth();
      else startLullabySynth();
    });
  }

  if (synthDroneToggle) {
    synthDroneToggle.addEventListener('click', () => {
      isDroneOn = !isDroneOn;
      if (droneStatusText) droneStatusText.textContent = isDroneOn ? 'ON' : 'OFF';
      synthDroneToggle.style.background = isDroneOn ? 'rgba(168, 85, 247, 0.25)' : '';
      if (synthPlaying) {
        if (isDroneOn) startSubBassDrone();
        else stopSubBassDrone();
      }
      playWandChime(isDroneOn ? 440 : 220, 0.2);
    });
  }

  // Presets Switching
  const PRESET_MAP = {
    'synth-preset-midnight': 'midnight',
    'synth-preset-coder': 'coder',
    'synth-preset-starlight': 'starlight',
    'synth-preset-aurora': 'aurora',
    'synth-preset-raindrop': 'raindrop',
    'synth-preset-cosmic': 'cosmic',
    'synth-preset-retro': 'retro'
  };

  Object.entries(PRESET_MAP).forEach(([btnId, key]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        currentPreset = key;
        document.querySelectorAll('[id^="synth-preset-"]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playWandChime(LULLABY_SCALES[key][0], 0.35);
      });
    }
  });

  // Tempo Selection
  document.querySelectorAll('.synth-tempo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.tempo;
      document.querySelectorAll('.synth-tempo-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTempoMs = t === 'slow' ? 650 : (t === 'fast' ? 320 : 450);
      if (synthPlaying) {
        clearInterval(synthTimer);
        synthTimer = setInterval(playSynthArpeggioStep, currentTempoMs);
      }
    });
  });

  // Texture Selection
  document.querySelectorAll('.synth-texture-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.synth-texture-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTexture = btn.dataset.texture || 'bells';
      playMultiVoiceNote(440);
    });
  });

  // =========================================================================
  // 9. Interactive 3D Flipbook Storybook
  // =========================================================================
  const flipPages = document.querySelectorAll('.flipbook-page');
  const prevPageBtn = document.getElementById('flipbook-prev-btn');
  const nextPageBtn = document.getElementById('flipbook-next-btn');
  const pageIndicator = document.getElementById('flipbook-page-indicator');
  let currentFlipIndex = 0;
  const totalPages = flipPages.length;

  function setFlipPage(idx) {
    if (idx < 0) idx = totalPages - 1;
    if (idx >= totalPages) idx = 0;
    currentFlipIndex = idx;

    flipPages.forEach((page, i) => {
      page.classList.toggle('active', i === currentFlipIndex);
    });

    if (pageIndicator) {
      pageIndicator.textContent = `Chapter ${currentFlipIndex + 1} of ${totalPages}`;
    }
    playWandChime(PENTATONIC[currentFlipIndex % PENTATONIC.length], 0.35);
  }

  if (prevPageBtn) prevPageBtn.addEventListener('click', () => setFlipPage(currentFlipIndex - 1));
  if (nextPageBtn) nextPageBtn.addEventListener('click', () => setFlipPage(currentFlipIndex + 1));

  // Keyboard navigation (ArrowLeft & ArrowRight)
  window.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
      setFlipPage(currentFlipIndex - 1);
    } else if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
      setFlipPage(currentFlipIndex + 1);
    }
  });

  // =========================================================================
  // 10. Cyber-Pong Arcade: Player vs Aman AI (Ping Pong Engine)
  // =========================================================================
  const pongCanvas = document.getElementById('pingpong-canvas') || document.getElementById('minigame-canvas');
  const pongStartBtn = document.getElementById('pong-start-btn') || document.getElementById('game-start-btn');
  const pongResetBtn = document.getElementById('pong-reset-btn');
  const playerValEl = document.getElementById('pong-player-score') || document.getElementById('game-score');
  const aiValEl = document.getElementById('pong-ai-score');
  const highRallyEl = document.getElementById('pong-high-rally') || document.getElementById('game-high-score');
  const diffBtns = document.querySelectorAll('.pong-diff-btn');

  let pongCtx = pongCanvas ? pongCanvas.getContext('2d') : null;
  let pongRunning = false;
  let pongAnimFrame = null;

  // Scores & Rally
  let playerScore = 0;
  let aiScore = 0;
  let currentRally = 0;
  let highRally = parseInt(localStorage.getItem('aman_pong_high_rally') || '0', 10);
  if (highRallyEl) highRallyEl.textContent = highRally;

  // Difficulty & Dimensions
  let botSpeedMax = 4.4; // normal
  const paddleWidth = 14;
  const paddleHeight = 78;

  // Paddle Positions
  let playerY = 150;
  let aiY = 150;

  // Ball
  let ballX = 400;
  let ballY = 180;
  let ballRadius = 8;
  let ballSpeed = 5.2;
  let ballVx = 5.2;
  let ballVy = 2.4;

  // Particle Sparks & Ball Trail
  let pongParticles = [];
  let ballTrail = [];

  function resetBall(serveTowardsPlayer = false) {
    if (!pongCanvas) return;
    ballX = pongCanvas.width / 2;
    ballY = pongCanvas.height / 2;
    ballSpeed = 5.2;
    const angle = (Math.random() * 0.8 - 0.4); // Random deflection angle
    const dir = serveTowardsPlayer ? -1 : 1;
    ballVx = dir * ballSpeed * Math.cos(angle);
    ballVy = ballSpeed * Math.sin(angle);
    ballTrail = [];
    currentRally = 0;
  }

  function spawnPongParticles(x, y, color = '#00f5ff', count = 10) {
    for (let i = 0; i < count; i++) {
      pongParticles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1.0,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
  }

  function playPongTone(freq = 600, duration = 0.09, type = 'sine') {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function pongLoop() {
    if (!pongRunning || !pongCtx || !pongCanvas) return;

    const w = pongCanvas.width;
    const h = pongCanvas.height;

    // Clear with retro trail fade
    pongCtx.fillStyle = 'rgba(6, 9, 20, 0.35)';
    pongCtx.fillRect(0, 0, w, h);

    // Center Dashed Court Line
    pongCtx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
    pongCtx.lineWidth = 2;
    pongCtx.setLineDash([8, 8]);
    pongCtx.beginPath();
    pongCtx.moveTo(w / 2, 0);
    pongCtx.lineTo(w / 2, h);
    pongCtx.stroke();
    pongCtx.setLineDash([]);

    // Center Court Ring
    pongCtx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
    pongCtx.lineWidth = 2;
    pongCtx.beginPath();
    pongCtx.arc(w / 2, h / 2, 45, 0, Math.PI * 2);
    pongCtx.stroke();

    // 1. Move AI Paddle with smooth anticipation
    const aiTarget = ballY - paddleHeight / 2;
    const aiDelta = aiTarget - aiY;
    aiY += Math.sign(aiDelta) * Math.min(Math.abs(aiDelta), botSpeedMax);
    aiY = Math.max(0, Math.min(h - paddleHeight, aiY));

    // 2. Move Ball
    ballX += ballVx;
    ballY += ballVy;

    // Record Trail
    ballTrail.push({ x: ballX, y: ballY });
    if (ballTrail.length > 7) ballTrail.shift();

    // Top / Bottom Wall Collision
    if (ballY - ballRadius <= 0) {
      ballY = ballRadius;
      ballVy = -ballVy;
      playPongTone(320, 0.06, 'triangle');
      spawnPongParticles(ballX, ballY, '#fbbf24', 4);
    } else if (ballY + ballRadius >= h) {
      ballY = h - ballRadius;
      ballVy = -ballVy;
      playPongTone(320, 0.06, 'triangle');
      spawnPongParticles(ballX, ballY, '#fbbf24', 4);
    }

    // 3. Player Paddle Collision (Left side: x = 20)
    const playerPaddleX = 24;
    if (ballX - ballRadius <= playerPaddleX + paddleWidth && ballX + ballRadius >= playerPaddleX) {
      if (ballY >= playerY - 4 && ballY <= playerY + paddleHeight + 4) {
        ballX = playerPaddleX + paddleWidth + ballRadius;
        // Angle deflection based on hit position
        const hitOffset = (ballY - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeed = Math.min(11.5, ballSpeed * 1.04); // Speed up volley
        ballVx = ballSpeed * Math.cos(hitOffset * 0.7);
        ballVy = ballSpeed * Math.sin(hitOffset * 0.7);

        currentRally++;
        if (currentRally > highRally) {
          highRally = currentRally;
          localStorage.setItem('aman_pong_high_rally', highRally);
          if (highRallyEl) highRallyEl.textContent = highRally;
        }

        playPongTone(659.25, 0.1, 'sine');
        spawnPongParticles(ballX, ballY, '#00f5ff', 12);
      }
    }

    // 4. AI Paddle Collision (Right side: x = w - 24 - paddleWidth)
    const aiPaddleX = w - 24 - paddleWidth;
    if (ballX + ballRadius >= aiPaddleX && ballX - ballRadius <= aiPaddleX + paddleWidth) {
      if (ballY >= aiY - 4 && ballY <= aiY + paddleHeight + 4) {
        ballX = aiPaddleX - ballRadius;
        const hitOffset = (ballY - (aiY + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeed = Math.min(11.5, ballSpeed * 1.04);
        ballVx = -ballSpeed * Math.cos(hitOffset * 0.7);
        ballVy = ballSpeed * Math.sin(hitOffset * 0.7);

        currentRally++;
        if (currentRally > highRally) {
          highRally = currentRally;
          localStorage.setItem('aman_pong_high_rally', highRally);
          if (highRallyEl) highRallyEl.textContent = highRally;
        }

        playPongTone(523.25, 0.1, 'sine');
        spawnPongParticles(ballX, ballY, '#ff759f', 12);
      }
    }

    // 5. Point Scored
    if (ballX < 0) {
      // AI scores
      aiScore++;
      if (aiValEl) aiValEl.textContent = aiScore;
      playPongTone(240, 0.25, 'sawtooth');
      resetBall(true);
    } else if (ballX > w) {
      // Player scores!
      playerScore++;
      if (playerValEl) playerValEl.textContent = playerScore;
      [523.25, 659.25, 783.99].forEach((f, i) => setTimeout(() => playPongTone(f, 0.12), i * 80));
      spawnPongParticles(w / 2, h / 2, '#fbbf24', 20);
      resetBall(false);
    }

    // Draw Ball Trail
    ballTrail.forEach((pt, i) => {
      pongCtx.fillStyle = `rgba(251, 191, 36, ${(i + 1) / (ballTrail.length * 2)})`;
      pongCtx.beginPath();
      pongCtx.arc(pt.x, pt.y, ballRadius * (0.5 + 0.5 * (i / ballTrail.length)), 0, Math.PI * 2);
      pongCtx.fill();
    });

    // Draw Ball
    pongCtx.fillStyle = '#ffffff';
    pongCtx.shadowColor = '#fbbf24';
    pongCtx.shadowBlur = 14;
    pongCtx.beginPath();
    pongCtx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    pongCtx.fill();
    pongCtx.shadowBlur = 0;

    // Draw Player Paddle (Cyan)
    pongCtx.fillStyle = '#00f5ff';
    pongCtx.shadowColor = '#00f5ff';
    pongCtx.shadowBlur = 14;
    pongCtx.beginPath();
    pongCtx.roundRect(playerPaddleX, playerY, paddleWidth, paddleHeight, 6);
    pongCtx.fill();
    pongCtx.shadowBlur = 0;

    // Draw AI Paddle (Rose/Violet)
    pongCtx.fillStyle = '#ff759f';
    pongCtx.shadowColor = '#ff759f';
    pongCtx.shadowBlur = 14;
    pongCtx.beginPath();
    pongCtx.roundRect(aiPaddleX, aiY, paddleWidth, paddleHeight, 6);
    pongCtx.fill();
    pongCtx.shadowBlur = 0;

    // Update & Draw Particles
    for (let i = pongParticles.length - 1; i >= 0; i--) {
      const p = pongParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.035;

      if (p.life <= 0) {
        pongParticles.splice(i, 1);
        continue;
      }

      pongCtx.fillStyle = p.color;
      pongCtx.globalAlpha = p.life;
      pongCtx.beginPath();
      pongCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pongCtx.fill();
      pongCtx.globalAlpha = 1.0;
    }

    pongAnimFrame = requestAnimationFrame(pongLoop);
  }

  // Mouse & Touch Controls for Left Paddle
  if (pongCanvas) {
    pongCanvas.addEventListener('mousemove', (e) => {
      const rect = pongCanvas.getBoundingClientRect();
      const scaleY = pongCanvas.height / rect.height;
      playerY = Math.max(0, Math.min(pongCanvas.height - paddleHeight, (e.clientY - rect.top) * scaleY - paddleHeight / 2));
    });

    pongCanvas.addEventListener('touchmove', (e) => {
      if (!e.touches[0]) return;
      const rect = pongCanvas.getBoundingClientRect();
      const scaleY = pongCanvas.height / rect.height;
      playerY = Math.max(0, Math.min(pongCanvas.height - paddleHeight, (e.touches[0].clientY - rect.top) * scaleY - paddleHeight / 2));
    }, { passive: true });
  }

  // Keyboard Controls (W/S and Up/Down arrows)
  window.addEventListener('keydown', (e) => {
    if (!pongRunning || !pongCanvas) return;
    const step = 28;
    if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
      playerY = Math.max(0, playerY - step);
    } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
      playerY = Math.min(pongCanvas.height - paddleHeight, playerY + step);
    }
  });

  if (pongStartBtn) {
    pongStartBtn.addEventListener('click', () => {
      if (pongRunning) {
        pongRunning = false;
        pongStartBtn.textContent = 'Resume Game 🏓';
        if (pongAnimFrame) cancelAnimationFrame(pongAnimFrame);
      } else {
        pongRunning = true;
        pongStartBtn.textContent = 'Pause Game ⏸';
        if (!ballVx && !ballVy) resetBall(false);
        pongAnimFrame = requestAnimationFrame(pongLoop);
      }
    });
  }

  if (pongResetBtn) {
    pongResetBtn.addEventListener('click', () => {
      playerScore = 0;
      aiScore = 0;
      currentRally = 0;
      if (playerValEl) playerValEl.textContent = '0';
      if (aiValEl) aiValEl.textContent = '0';
      resetBall(false);
      playWandChime(440, 0.2);
    });
  }

  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      botSpeedMax = btn.dataset.diff === 'master' ? 6.5 : 4.4;
      playWandChime(botSpeedMax > 5 ? 784 : 523, 0.25);
    });
  });

  // =========================================================================
  // 11. Returning Visitor Memory (localStorage)
  // =========================================================================
  const visitorBadge = document.getElementById('visitor-memory-badge');
  const visitorText = document.getElementById('visitor-memory-text');

  function initVisitorMemory() {
    let count = parseInt(localStorage.getItem('aman_visit_count') || '0', 10) + 1;
    localStorage.setItem('aman_visit_count', count);
    const lastVisit = localStorage.getItem('aman_last_visit');
    const now = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    localStorage.setItem('aman_last_visit', now);

    if (visitorText) {
      if (count === 1) {
        visitorText.textContent = `✦ Welcome, voyager! Your journey with the Worldsmith begins today 🌟`;
      } else {
        visitorText.textContent = `✦ Welcome back, traveler! Visit #${count} · Aman remembers your return 🌟`;
      }
    }
  }
  initVisitorMemory();

  // =========================================================================
  // 12. Interactive "Chat with Aman" Dialogue Console (/api/chat)
  // =========================================================================
  const chatTogglePill = document.getElementById('chat-toggle-pill');
  const chatPanel = document.getElementById('chat-console-panel');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-user-input');
  const chatScroll = document.getElementById('chat-messages-scroll');
  const quickPrompts = document.querySelectorAll('.quick-prompt-chip');

  if (chatTogglePill && chatPanel) {
    chatTogglePill.addEventListener('click', () => {
      chatPanel.classList.toggle('hidden');
      if (!chatPanel.classList.contains('hidden') && chatInput) {
        chatInput.focus();
        playWandChime(659.25, 0.4);
      }
    });
  }

  if (closeChatBtn && chatPanel) {
    closeChatBtn.addEventListener('click', () => chatPanel.classList.add('hidden'));
  }

  async function sendChatMessage(msgText) {
    if (!msgText.trim()) return;

    // Append User Message Bubble
    appendChatBubble(msgText, 'user');
    if (chatInput) chatInput.value = '';
    playWandChime(587.33, 0.3);

    // Typing Placeholder
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble aman';
    typingBubble.style.opacity = '0.7';
    typingBubble.textContent = 'Aman is weaving a thought...';
    chatScroll.appendChild(typingBubble);
    chatScroll.scrollTop = chatScroll.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText })
      });
      const data = await res.json();
      typingBubble.remove();
      appendChatBubble(data.reply || "Let's keep building together!", 'aman');
      playWandChime(880.0, 0.5);
    } catch (e) {
      typingBubble.remove();
      appendChatBubble("I'm always learning and building! Let's keep exploring.", 'aman');
    }
  }

  function appendChatBubble(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    chatScroll.appendChild(bubble);
    chatScroll.scrollTop = chatScroll.scrollHeight;
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (chatInput) sendChatMessage(chatInput.value);
    });
  }

  quickPrompts.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      sendChatMessage(prompt);
    });
  });

  // =========================================================================
  // 13. Project Star Tracker & SQLite Guestbook Wall (Persistent Backend)
  // =========================================================================
  document.querySelectorAll('.star-project-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project');
      const starNum = btn.querySelector('.star-num');

      playWandChime(1046.5, 0.5);

      try {
        const res = await fetch('/api/project/star', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_id: projectId }),
        });
        const data = await res.json();
        if (data.status === 'ok' && starNum) {
          starNum.textContent = data.stars_count;
          btn.style.transform = 'scale(1.18)';
          setTimeout(() => (btn.style.transform = 'scale(1)'), 200);
        }
      } catch (err) {
        console.warn('Project star API offline; preview fallback');
      }
    });
  });

  const guestbookForm = document.getElementById('guestbook-form');
  const wishesList = document.getElementById('wishes-list');

  if (guestbookForm && wishesList) {
    guestbookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author = document.getElementById('guest-author').value.trim() || 'Fellow Explorer';
      const wish = document.getElementById('guest-wish').value.trim();
      const mood = document.getElementById('guest-mood').value || '✨ Dream Builder';

      if (!wish) {
        alert('Please leave an inspiring message for Aman!');
        return;
      }

      const submitBtn = guestbookForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting Message...';

      try {
        const response = await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author_name: author, dream_wish: wish, mood_badge: mood }),
        });

        const result = await response.json();
        if (result.status === 'ok' && result.entry) {
          const card = document.createElement('div');
          card.className = 'wish-card';
          card.innerHTML = `
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--neon-cyan); margin-bottom: 0.4rem;">${result.entry.mood_badge}</div>
            <p style="font-size: 0.92rem; color: #fff; line-height: 1.5; margin-bottom: 0.85rem;">“${escapeHtml(result.entry.dream_wish)}”</p>
            <div style="font-family: var(--font-bubbly); font-size: 0.82rem; font-weight: 700; color: var(--solar-gold);">— ${escapeHtml(result.entry.author_name)}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted); opacity: 0.8;">Just now</div>
          `;
          wishesList.insertBefore(card, wishesList.firstChild);

          guestbookForm.reset();
          [0, 2, 4].forEach((idx, i) => {
            setTimeout(() => playWandChime(PENTATONIC[idx], 0.5), i * 120);
          });

          // Update odometer counter by 1
          const odoEl = document.getElementById('odometer-val');
          if (odoEl) {
            const current = parseInt(odoEl.textContent.replace(/,/g, ''), 10) || 2840;
            odoEl.textContent = (current + 1).toLocaleString();
          }
        }
      } catch (err) {
        console.error('Failed to submit message:', err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Broadcast Message ✦';
      }
    });
  }

  // Story Codex Modal
  const openStoryModalBtn = document.getElementById('open-story-codex-btn');
  const openStoryModalBtn2 = document.getElementById('open-story-codex-btn-2');
  const storyModal = document.getElementById('story-codex-modal');
  const closeStoryModalBtn = document.getElementById('close-story-codex-btn');

  [openStoryModalBtn, openStoryModalBtn2].forEach((btn) => {
    if (btn && storyModal) {
      btn.addEventListener('click', () => {
        storyModal.classList.remove('hidden');
        playWandChime(659.25);
      });
    }
  });

  if (closeStoryModalBtn && storyModal) {
    closeStoryModalBtn.addEventListener('click', () => storyModal.classList.add('hidden'));
  }

  // Sync Live Visit Stat
  async function syncVisitStats() {
    try {
      const res = await fetch('/api/stats/visit', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        const odoEl = document.getElementById('odometer-val');
        if (odoEl) odoEl.textContent = Number(data.dreams_delivered).toLocaleString();
      }
    } catch (e) {
      // Local preview fallback
    }
  }
  syncVisitStats();

  // =========================================================================
  // 18. Floating Superhero Baby Mascot & Character Asset Vault Controller
  // =========================================================================
  const companionBtn = document.getElementById('companion-trigger-btn');
  const companionBubble = document.getElementById('companion-speech-bubble');
  const closeCompanionBtn = document.getElementById('close-companion-bubble');
  const companionAvatarImg = document.getElementById('companion-avatar-img');
  const companionNameText = document.getElementById('companion-name-text');
  const companionDialogueText = document.getElementById('companion-dialogue-text');
  const switchToIronmanBtn = document.getElementById('switch-to-ironman');
  const switchToHulkBtn = document.getElementById('switch-to-hulk');

  const MASCOT_PROFILES = {
    ironman: {
      name: 'Baby Tony (Iron Man)',
      icon: '🚀',
      img: '/static/assets/baby_ironman_cloud.png',
      color: '#00f5ff',
      borderColor: 'var(--neon-cyan)',
      boxShadow: '0 8px 24px rgba(0, 245, 255, 0.4)',
      quotes: [
        '“Jarvis said sleep is for mortals, but Aman coded me a starlight lullaby! Want to hear an arc-reactor synth beat or explore the realms?”',
        '“Building MyRail, INVENTRA, and CivicConnect takes pure arc-reactor focus. What realm should we warp to?”',
        '“I might be tiny, but my suit runs on 3000 horsepower and 0 compiler errors! Let\'s build something great!”',
        '“Did you check out the Starlight Ping Pong game? Aman built an AI bot that anticipates your paddle spin!”'
      ]
    },
    hulk: {
      name: 'Baby Bruce (Baby Hulk)',
      icon: '💚',
      img: '/static/assets/baby_hulk_cloud.png',
      color: '#10b981',
      borderColor: '#10b981',
      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
      quotes: [
        '“HULK SMASH... BUGS! Baby Hulk protects Aman\'s database tables from runtime crashes!”',
        '“Green is for gamma... and for 100% passed unit tests! Happy code makes Hulk happy!”',
        '“Baby Hulk loves peaceful starlight lullabies! Play the Arc Reactor Music Box for me?”',
        '“Don\'t make me hungry! Let\'s file a community report in CivicConnect or check warehouse stock in INVENTRA!”'
      ]
    }
  };

  let activeMascot = localStorage.getItem('active_mascot') || 'ironman';
  let quoteIndex = 0;

  function applyMascot(type, playChime = true) {
    if (!MASCOT_PROFILES[type]) type = 'ironman';
    activeMascot = type;
    localStorage.setItem('active_mascot', type);
    const profile = MASCOT_PROFILES[type];

    if (companionAvatarImg) {
      companionAvatarImg.src = profile.img;
      companionAvatarImg.alt = profile.name;
    }
    if (companionBtn) {
      companionBtn.style.borderColor = profile.borderColor;
      companionBtn.style.boxShadow = profile.boxShadow;
    }
    if (companionNameText) companionNameText.textContent = profile.name;
    if (companionDialogueText) companionDialogueText.textContent = profile.quotes[quoteIndex % profile.quotes.length];

    if (switchToIronmanBtn && switchToHulkBtn) {
      switchToIronmanBtn.classList.toggle('active', type === 'ironman');
      switchToHulkBtn.classList.toggle('active', type === 'hulk');
    }

    if (playChime) {
      playWandChime(type === 'ironman' ? 587.33 : 440, 0.25);
    }
  }

  // Initial load
  applyMascot(activeMascot, false);

  if (companionBtn && companionBubble) {
    companionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = companionBubble.classList.contains('hidden');
      if (isHidden) {
        companionBubble.classList.remove('hidden');
        const profile = MASCOT_PROFILES[activeMascot];
        quoteIndex = (quoteIndex + 1) % profile.quotes.length;
        if (companionDialogueText) companionDialogueText.textContent = profile.quotes[quoteIndex];
        playWandChime(659.25, 0.2);
      } else {
        companionBubble.classList.add('hidden');
      }
    });

    companionBubble.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('click', () => {
      if (!companionBubble.classList.contains('hidden')) {
        companionBubble.classList.add('hidden');
      }
    });
  }

  if (closeCompanionBtn && companionBubble) {
    closeCompanionBtn.addEventListener('click', () => {
      companionBubble.classList.add('hidden');
    });
  }

  if (switchToIronmanBtn) {
    switchToIronmanBtn.addEventListener('click', () => applyMascot('ironman', true));
  }
  if (switchToHulkBtn) {
    switchToHulkBtn.addEventListener('click', () => applyMascot('hulk', true));
  }

  // Card 1 Cloud Hero Swap Controls (in /portal/about and /portfolio)
  const toggleCloudHeroBtn = document.getElementById('btn-toggle-cloud-hero');
  const toggleCloudHeroIndexBtn = document.getElementById('btn-toggle-cloud-hero-index');
  const cloudHeroImg = document.getElementById('asset-cloud-img');
  const cloudHeroIndexImg = document.getElementById('asset-cloud-img-index');
  let currentCardHero = 'ironman';

  function toggleCardCloudHero() {
    currentCardHero = currentCardHero === 'ironman' ? 'hulk' : 'ironman';
    const isHulk = currentCardHero === 'hulk';
    const newSrc = isHulk ? '/static/assets/baby_hulk_cloud.png' : '/static/assets/baby_ironman_cloud.png';
    const newAlt = isHulk ? 'Baby Hulk Waving on Cloud' : 'Baby Iron Man Waving on Cloud';
    const btnLabel = isHulk ? '⇄ Swap to Baby Iron Man' : '⇄ Swap to Baby Hulk';

    if (cloudHeroImg) {
      cloudHeroImg.src = newSrc;
      cloudHeroImg.alt = newAlt;
    }
    if (cloudHeroIndexImg) {
      cloudHeroIndexImg.src = newSrc;
      cloudHeroIndexImg.alt = newAlt;
    }
    if (toggleCloudHeroBtn) toggleCloudHeroBtn.textContent = btnLabel;
    if (toggleCloudHeroIndexBtn) toggleCloudHeroIndexBtn.textContent = btnLabel;

    playWandChime(isHulk ? 440 : 523.25, 0.25);
  }

  if (toggleCloudHeroBtn) toggleCloudHeroBtn.addEventListener('click', toggleCardCloudHero);
  if (toggleCloudHeroIndexBtn) toggleCloudHeroIndexBtn.addEventListener('click', toggleCardCloudHero);

  // Card 3 Lantern Ignite Controls
  const lanternIgniteBtn = document.getElementById('btn-lantern-ignite');
  const lanternIgniteIndexBtn = document.getElementById('btn-lantern-ignite-index');

  function triggerLanternIgnite(btn) {
    playWandChime(783.99, 0.4);
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '✨ Lantern Glowing!';
      btn.style.background = 'rgba(251, 191, 36, 0.25)';
      btn.style.borderColor = 'var(--solar-gold)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 2200);
    }
    // Subtle ambient flash
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.background = 'radial-gradient(circle at center, rgba(251, 191, 36, 0.18), transparent 70%)';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '9999';
    flash.style.transition = 'opacity 1.2s ease';
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 1200);
    }, 400);
  }

  if (lanternIgniteBtn) lanternIgniteBtn.addEventListener('click', () => triggerLanternIgnite(lanternIgniteBtn));
  if (lanternIgniteIndexBtn) lanternIgniteIndexBtn.addEventListener('click', () => triggerLanternIgnite(lanternIgniteIndexBtn));

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    }[tag] || tag));
  }
});
