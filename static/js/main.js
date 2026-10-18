/**
 * Aman: The Young Worldsmith · Interactive Experience Engine
 * Built for haX.baby 48-Hour Hackathon (Track 2: Your Own Baby)
 * 
 * Features:
 * - Tier 1: Character Cursor Tilt & Eye-Tracking, Day/Night Mood Toggle, Scroll Story, Easter Egg
 * - Tier 2: Generative Lullaby Synth (Web Audio), Torch Mode Mask Canvas, Scroll-Synced Transit Map, 3D Flipbook, Arcade Mini-game
 * - Tier 3: Returning Visitor Memory, Floating Chat Console (/api/chat), 3D Portals Integration
 * - Side Quests: Magic Wand Sparkles (+2), SQLite Odometer (+1), Audio Chimes with Mute Switch (+3), Live Wall (+2), Chaos Badges (+5)
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
  // 2. Custom Magic Wand Cursor & Stardust Runes (Side Quest 2)
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

    // Eye Tracking (Tier 1)
    updateEyeTracking(curX, curY);
    // 3D Card Perspective Tilt (Tier 1)
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
  // 3. Tier 1: Character Eye-Tracking & 3D Perspective Tilt
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
  // 4. Tier 1: Day / Night Mood Toggle (Changes Character Expression & Palette)
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
  // 5. Tier 1: Discoverable Hidden Easter Egg
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

  // Keyboard shortcut secret: type 'hax' or 'aman'
  let keyHistory = '';
  window.addEventListener('keydown', (e) => {
    keyHistory += e.key.toLowerCase();
    if (keyHistory.length > 8) keyHistory = keyHistory.slice(-8);
    if (keyHistory.includes('hax') || keyHistory.includes('aman')) {
      if (!eggRevealed) triggerEasterEgg();
    }
  });

  // =========================================================================
  // 6. Tier 2: Flashlight / Torch Cursor Mode (Canvas Destination-Out Mask)
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
  // 7. Tier 2: Scroll-Synced Dream Delivery & Transit Route Map
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
  // 8. Tier 2: Generative Lullaby Synthesizer (Web Audio API)
  // =========================================================================
  const synthPlayBtn = document.getElementById('synth-play-btn');
  const synthPlayIcon = document.getElementById('synth-play-icon');
  const synthPlayLabel = document.getElementById('synth-play-label');
  const synthVizColumns = document.querySelectorAll('.synth-viz-column');
  let synthPlaying = false;
  let synthTimer = null;
  let synthStep = 0;

  const LULLABY_SCALES = {
    midnight: [261.63, 329.63, 392.00, 440.00, 523.25, 659.25], // C major pentatonic
    coder: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00],    // A minor pentatonic
    starlight: [329.63, 392.00, 440.00, 493.88, 587.33, 659.25] // E minor pentatonic
  };
  let currentPreset = 'midnight';

  function playSynthArpeggioStep() {
    if (!synthPlaying || isMuted) return;
    initAudio();
    if (!audioCtx) return;

    const scale = LULLABY_SCALES[currentPreset] || LULLABY_SCALES.midnight;
    const note = scale[synthStep % scale.length];
    synthStep++;

    playWandChime(note, 0.7, 'triangle');

    // Visualizer bounce
    synthVizColumns.forEach((col, idx) => {
      const heightPct = idx === (synthStep % synthVizColumns.length) ? 90 : Math.max(15, Math.random() * 65);
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
    synthTimer = setInterval(playSynthArpeggioStep, 450);
  }

  function stopLullabySynth() {
    synthPlaying = false;
    if (synthTimer) clearInterval(synthTimer);
    if (synthPlayIcon) synthPlayIcon.textContent = '▶';
    if (synthPlayLabel) synthPlayLabel.textContent = 'Play Generative Lullaby';
    synthVizColumns.forEach(c => c.style.height = '12%');
  }

  if (synthPlayBtn) {
    synthPlayBtn.addEventListener('click', () => {
      if (synthPlaying) stopLullabySynth();
      else startLullabySynth();
    });
  }

  // Presets
  const presetButtons = [
    { id: 'synth-preset-midnight', key: 'midnight' },
    { id: 'synth-preset-coder', key: 'coder' },
    { id: 'synth-preset-starlight', key: 'starlight' },
  ];
  presetButtons.forEach(({ id, key }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        currentPreset = key;
        presetButtons.forEach(b => {
          const el = document.getElementById(b.id);
          if (el) el.classList.remove('active');
        });
        btn.classList.add('active');
        playWandChime(587.33, 0.4);
      });
    }
  });

  // =========================================================================
  // 9. Tier 2: Interactive 3D Flipbook Storybook
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
  // 10. Tier 2: Playable Arcade Mini-Game: Catch the Code Sparks
  // =========================================================================
  const gameCanvas = document.getElementById('minigame-canvas');
  const gameStartBtn = document.getElementById('game-start-btn');
  const gameScoreEl = document.getElementById('game-score');
  const gameHighEl = document.getElementById('game-high-score');

  let gameCtx = gameCanvas ? gameCanvas.getContext('2d') : null;
  let gameRunning = false;
  let gameScore = 0;
  let gameHighScore = parseInt(localStorage.getItem('aman_game_high') || '0', 10);
  if (gameHighEl) gameHighEl.textContent = gameHighScore;

  let paddleX = 350;
  const paddleWidth = 100;
  const paddleHeight = 16;
  let sparks = [];
  let gameAnimFrame = null;
  let lastSparkSpawn = 0;

  function spawnGameSpark() {
    if (!gameCanvas) return;
    const runes = ['{ }', '</>', '01', '⚡', '★', '★', '✦', '=>'];
    const colors = ['#00f5ff', '#a855f7', '#fbbf24', '#ff759f', '#38bdf8'];
    sparks.push({
      x: 30 + Math.random() * (gameCanvas.width - 60),
      y: 0,
      speed: 1.8 + Math.random() * 2.2,
      rune: runes[Math.floor(Math.random() * runes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 16 + Math.random() * 6
    });
  }

  function gameLoop(time) {
    if (!gameRunning || !gameCtx || !gameCanvas) return;

    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw basket / paddle
    gameCtx.fillStyle = '#00f5ff';
    gameCtx.shadowColor = '#00f5ff';
    gameCtx.shadowBlur = 12;
    gameCtx.beginPath();
    gameCtx.roundRect(paddleX - paddleWidth / 2, gameCanvas.height - 24, paddleWidth, paddleHeight, 8);
    gameCtx.fill();
    gameCtx.shadowBlur = 0;

    // Paddle gem indicator
    gameCtx.fillStyle = '#fbbf24';
    gameCtx.beginPath();
    gameCtx.arc(paddleX, gameCanvas.height - 16, 5, 0, Math.PI * 2);
    gameCtx.fill();

    // Spawn sparks periodically
    if (time - lastSparkSpawn > 600) {
      lastSparkSpawn = time;
      spawnGameSpark();
    }

    // Update and draw falling sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.y += s.speed;

      gameCtx.font = `bold ${s.size}px 'Fredoka Variable', sans-serif`;
      gameCtx.fillStyle = s.color;
      gameCtx.shadowColor = s.color;
      gameCtx.shadowBlur = 8;
      gameCtx.fillText(s.rune, s.x, s.y);
      gameCtx.shadowBlur = 0;

      // Check collision with paddle
      const paddleTop = gameCanvas.height - 24;
      if (s.y >= paddleTop && s.y <= paddleTop + paddleHeight + 10) {
        if (s.x >= paddleX - paddleWidth / 2 - 10 && s.x <= paddleX + paddleWidth / 2 + 10) {
          // Spark caught!
          gameScore += 10;
          if (gameScoreEl) gameScoreEl.textContent = gameScore;
          if (gameScore > gameHighScore) {
            gameHighScore = gameScore;
            localStorage.setItem('aman_game_high', gameHighScore);
            if (gameHighEl) gameHighEl.textContent = gameHighScore;
          }
          playWandChime(PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)], 0.25);
          sparks.splice(i, 1);
          continue;
        }
      }

      // Spark fell off screen
      if (s.y > gameCanvas.height + 20) {
        sparks.splice(i, 1);
      }
    }

    gameAnimFrame = requestAnimationFrame(gameLoop);
  }

  if (gameCanvas) {
    gameCanvas.addEventListener('mousemove', (e) => {
      const rect = gameCanvas.getBoundingClientRect();
      const scaleX = gameCanvas.width / rect.width;
      paddleX = Math.max(paddleWidth / 2, Math.min(gameCanvas.width - paddleWidth / 2, (e.clientX - rect.left) * scaleX));
    });

    gameCanvas.addEventListener('touchmove', (e) => {
      if (!e.touches[0]) return;
      const rect = gameCanvas.getBoundingClientRect();
      const scaleX = gameCanvas.width / rect.width;
      paddleX = Math.max(paddleWidth / 2, Math.min(gameCanvas.width - paddleWidth / 2, (e.touches[0].clientX - rect.left) * scaleX));
    }, { passive: true });
  }

  if (gameStartBtn) {
    gameStartBtn.addEventListener('click', () => {
      if (gameRunning) {
        gameRunning = false;
        gameStartBtn.textContent = 'Resume Game 🎮';
        if (gameAnimFrame) cancelAnimationFrame(gameAnimFrame);
      } else {
        gameRunning = true;
        gameStartBtn.textContent = 'Pause Game ⏸';
        gameAnimFrame = requestAnimationFrame(gameLoop);
      }
    });
  }

  // =========================================================================
  // 11. Tier 3: Returning Visitor Memory (localStorage)
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
  // 12. Tier 3: Floating "Chat with Aman" Console (/api/chat)
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
