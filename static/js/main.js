/**
 * Pip's Dream Portfolio - Interactive JavaScript Engine
 * haX.baby 48-Hour Hackathon (October 2026)
 * Features: Eye Tracking, Web Audio Synth, Sparkle Trail, Day/Night Toggle, SQLite AJAX
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. Audio Engine (Web Audio API with Mute Toggle)
  // -------------------------------------------------------------
  let audioCtx = null;
  let isMuted = localStorage.getItem('pip_muted') === 'true';

  const muteBtn = document.getElementById('mute-toggle-btn');
  const muteIcon = document.getElementById('mute-icon');
  const muteLabel = document.getElementById('mute-label');

  function updateMuteUI() {
    if (isMuted) {
      muteIcon.textContent = '🔇';
      muteLabel.textContent = 'Muted';
      muteBtn.classList.add('muted');
    } else {
      muteIcon.textContent = '🔔';
      muteLabel.textContent = 'Sound On';
      muteBtn.classList.remove('muted');
    }
  }
  updateMuteUI();

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      localStorage.setItem('pip_muted', isMuted);
      updateMuteUI();
      if (!isMuted) playChime(0); // Pleasant feedback chime when unmuting
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

  // Pentatonic scale notes in Hz (C5, D5, E5, G5, A5, C6)
  const PENTATONIC_SCALE = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

  function playChime(index = 0) {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    const freq = PENTATONIC_SCALE[index % PENTATONIC_SCALE.length];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine'; // Soft, warm music box chime
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Natural chime envelope: quick attack, soft harmonic ring, exponential decay
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.25);
  }

  // Generic soft UI button click chime
  document.querySelectorAll('button:not(#mute-toggle-btn), .btn-pill, .nav-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      playChime(Math.floor(Math.random() * 4));
    });
  });

  // -------------------------------------------------------------
  // 2. Interactive Eye-Tracking for Pip Avatar
  // -------------------------------------------------------------
  const avatarFrame = document.querySelector('.avatar-frame');
  const leftEye = document.querySelector('.eye-pinprick.left');
  const rightEye = document.querySelector('.eye-pinprick.right');

  if (avatarFrame && leftEye && rightEye) {
    window.addEventListener('mousemove', (e) => {
      const rect = avatarFrame.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY), 380);

      // Max pupil offset of 4.5 pixels keeps Pip looking gentle and focused
      const travel = (distance / 380) * 4.5;
      const offsetX = Math.cos(angle) * travel;
      const offsetY = Math.sin(angle) * travel;

      leftEye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      rightEye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    // Gentle idle blink/gaze animation for mobile or touch
    let idleAngle = 0;
    setInterval(() => {
      if (window.innerWidth < 768) {
        idleAngle += 0.08;
        const ox = Math.cos(idleAngle) * 3;
        const oy = Math.sin(idleAngle) * 2;
        leftEye.style.transform = `translate(${ox}px, ${oy}px)`;
        rightEye.style.transform = `translate(${ox}px, ${oy}px)`;
      }
    }, 50);
  }

  // -------------------------------------------------------------
  // 3. Retro Sparkle Cursor Trail (+2 Bonus Points)
  // -------------------------------------------------------------
  const sparkleSymbols = ['✦', '★', '✧', '⋆', '☁', '•'];
  const sparkleColors = ['#f59e0b', '#ff759f', '#a34063', '#8b5cf6', '#38bdf8'];

  let lastSparkleTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < 55) return; // Smooth 18fps particle emission
    lastSparkleTime = now;

    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle-particle';
    sparkle.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
    sparkle.style.left = `${e.clientX + (Math.random() * 14 - 7)}px`;
    sparkle.style.top = `${e.clientY + (Math.random() * 14 - 7)}px`;
    sparkle.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 750);
  });

  // -------------------------------------------------------------
  // 4. Day / Night Theme Mood Shift
  // -------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '🌙';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.textContent = '☀️';
    }
  }

  const savedTheme = localStorage.getItem('pip_theme') || 'light';
  applyTheme(savedTheme === 'dark');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const nextDark = !isCurrentlyDark;
      applyTheme(nextDark);
      localStorage.setItem('pip_theme', nextDark ? 'dark' : 'light');
      playChime(nextDark ? 4 : 1);
    });
  }

  // -------------------------------------------------------------
  // 5. Interactive Project 1: The Lullaby Lab Music Box
  // -------------------------------------------------------------
  const lullabyKeys = document.querySelectorAll('.lullaby-key');
  lullabyKeys.forEach((key) => {
    key.addEventListener('click', () => {
      const noteIdx = parseInt(key.getAttribute('data-note'), 10) || 0;
      playChime(noteIdx);
      key.classList.add('active');
      setTimeout(() => key.classList.remove('active'), 250);
    });
  });

  const playLullabyBtn = document.getElementById('play-lullaby-btn');
  let isPlayingLullaby = false;
  let lullabyInterval = null;

  if (playLullabyBtn) {
    playLullabyBtn.addEventListener('click', () => {
      if (isPlayingLullaby) {
        clearInterval(lullabyInterval);
        isPlayingLullaby = false;
        playLullabyBtn.textContent = '▶ Play Lullaby';
        return;
      }

      isPlayingLullaby = true;
      playLullabyBtn.textContent = '⏹ Stop Melody';

      // Classic bedtime nursery sequence: C - E - G - E - A - G - E - C
      const sequence = [0, 2, 3, 2, 4, 3, 2, 0];
      let step = 0;

      lullabyInterval = setInterval(() => {
        const noteIndex = sequence[step % sequence.length];
        playChime(noteIndex);

        // Highlight matching key
        lullabyKeys.forEach((k) => k.classList.remove('active'));
        if (lullabyKeys[noteIndex]) {
          lullabyKeys[noteIndex].classList.add('active');
          setTimeout(() => lullabyKeys[noteIndex].classList.remove('active'), 300);
        }

        step++;
        if (step >= sequence.length * 2) {
          clearInterval(lullabyInterval);
          isPlayingLullaby = false;
          playLullabyBtn.textContent = '▶ Play Lullaby';
        }
      }, 480);
    });
  }

  // -------------------------------------------------------------
  // 6. Interactive Project 2: Nightlight Collection (Lantern Shelf)
  // -------------------------------------------------------------
  const lanternCards = document.querySelectorAll('.lantern-card-item');
  lanternCards.forEach((card) => {
    card.addEventListener('click', async () => {
      const lanternId = card.getAttribute('data-lantern-id');
      card.classList.toggle('lit');
      playChime(card.classList.contains('lit') ? 3 : 1);

      // Send sparkle touch to backend SQLite database
      try {
        const res = await fetch('/api/lantern/sparkle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lantern_id: lanternId }),
        });
        const data = await res.json();
        if (data.status === 'ok') {
          const sparkleCounter = card.querySelector('.sparkle-num');
          if (sparkleCounter) {
            sparkleCounter.textContent = data.sparkle_count;
          }
        }
      } catch (err) {
        console.warn('Sparkle API offline; running in local preview mode');
      }
    });
  });

  // -------------------------------------------------------------
  // 7. Interactive Project 3: Dream Flight Rooftop Map
  // -------------------------------------------------------------
  const flightMarkers = document.querySelectorAll('.flight-marker');
  const routeTooltip = document.getElementById('route-tooltip');

  flightMarkers.forEach((marker) => {
    marker.addEventListener('click', () => {
      const destination = marker.getAttribute('data-dest') || 'Sleepy Hollow';
      playChime(5);
      if (routeTooltip) {
        routeTooltip.textContent = `☁ Delivered dream to: ${destination}!`;
        routeTooltip.classList.add('highlight');
        setTimeout(() => routeTooltip.classList.remove('highlight'), 2200);
      }
    });
  });

  // -------------------------------------------------------------
  // 8. Live Dream Guestbook Wall (SQLite AJAX)
  // -------------------------------------------------------------
  const guestbookForm = document.getElementById('guestbook-form');
  const wishesList = document.getElementById('wishes-list');

  if (guestbookForm && wishesList) {
    guestbookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author = document.getElementById('guest-author').value.trim() || 'Sleepy Friend';
      const wish = document.getElementById('guest-wish').value.trim();
      const mood = document.getElementById('guest-mood').value || '🌙 Sweet Dreams';

      if (!wish) {
        alert('Please write a warm dream wish for Pip!');
        return;
      }

      const submitBtn = guestbookForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Weaving Dream...';

      try {
        const response = await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author_name: author, dream_wish: wish, mood_badge: mood }),
        });

        const result = await response.json();
        if (result.status === 'ok' && result.entry) {
          // Optimistically insert new note card at the top of the wall
          const noteCard = document.createElement('div');
          noteCard.className = 'wish-sticky-note animate-fade-in';
          noteCard.innerHTML = `
            <span class="wish-badge">${result.entry.mood_badge}</span>
            <p class="wish-body">“${escapeHtml(result.entry.dream_wish)}”</p>
            <div class="wish-author">— ${escapeHtml(result.entry.author_name)}</div>
            <div class="wish-date">Just now</div>
          `;
          wishesList.insertBefore(noteCard, wishesList.firstChild);

          // Reset form & play happy celebration chime
          guestbookForm.reset();
          playChime(0);
          setTimeout(() => playChime(2), 120);
          setTimeout(() => playChime(4), 240);

          // Update odometer counter by 1
          const odoEl = document.getElementById('odometer-val');
          if (odoEl) {
            const currentCount = parseInt(odoEl.textContent.replace(/,/g, ''), 10) || 1482;
            odoEl.textContent = (currentCount + 1).toLocaleString();
          }
        }
      } catch (err) {
        console.error('Failed to submit guestbook wish:', err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Wish to Nursery ✨';
      }
    });
  }

  // -------------------------------------------------------------
  // 9. Hidden Easter Egg Trigger (Nightcap Star Bow)
  // -------------------------------------------------------------
  const easterStar = document.querySelector('.easter-egg-star');
  const easterModal = document.getElementById('easter-egg-modal');
  let easterClicks = 0;

  if (easterStar) {
    easterStar.addEventListener('click', (e) => {
      e.stopPropagation();
      easterClicks++;
      playChime(easterClicks % 6);

      if (easterClicks >= 3) {
        easterClicks = 0;
        triggerEasterCelebration();
      }
    });
  }

  function triggerEasterCelebration() {
    if (easterModal) {
      easterModal.classList.remove('hidden');
    }
    // Play celebratory ascending lullaby arpeggio
    [0, 2, 4, 5].forEach((note, i) => {
      setTimeout(() => playChime(note), i * 140);
    });
  }

  const closeEasterBtn = document.getElementById('close-easter-btn');
  if (closeEasterBtn && easterModal) {
    closeEasterBtn.addEventListener('click', () => {
      easterModal.classList.add('hidden');
    });
  }

  // -------------------------------------------------------------
  // 10. Record Visit and Fetch Initial Stats
  // -------------------------------------------------------------
  async function syncVisitStats() {
    try {
      const res = await fetch('/api/stats/visit', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'ok') {
        const odoEl = document.getElementById('odometer-val');
        if (odoEl) odoEl.textContent = Number(data.dreams_delivered).toLocaleString();
      }
    } catch (e) {
      console.log('Running in offline/static fallback mode');
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
