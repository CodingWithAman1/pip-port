# 🪄 Aman: The Young Worldsmith · haX.baby Hackathon

> *“There is a difference between being lost and being unfinished. I am unfinished—and I am building myself.”*
> **Event:** haX.baby 48-Hour Online Hackathon (17–19 October 2026)  
> **Challenge:** "Baby's First Portfolio: Meet the Baby"  
> **Track Chosen:** **Track 2: Your Own Baby (Original Character & Universe)**  
> **Stack:** HTML5, CSS3, JavaScript (ES6+), Python 3.13, Flask 3.1, SQLite3, Three.js WebGL

---

## 🌟 The 5-Point Character Sheet (Track 2 Canon)

1. **Character Name:** **Aman, The Young Worldsmith** (The Code Weaver)
2. **What They Are:** A young computer science student and digital architect wrapped in a midnight hoodie with glowing circuit constellations, wielding a magic wand of code. Curious, fighting self-doubts, endlessly loyal to his family, and building to prove what is possible when given a genuine chance.
3. **What They Do:** Software Developer & World Creator. He architects real systems:
   - **MyRail:** Railway intelligence and commuter navigation system.
   - **INVENTRA:** Enterprise inventory engine with relational database dashboards.
   - **CivicConnect:** Citizen empowerment and municipal transparency platform.
4. **Their Story:** *“The Boy Who Was Building His Own World”* — A 9-chapter chronicle exploring the silent war against impatience, balancing family health hurdles, and discovering that becoming someone is not a single achievement, but a continuous decision to build.
5. **Tagline Motto:** *“The story wasn't about a boy who knew he would win. It was about a boy who chose to find out what he was capable of.”*

---

## 🌀 Interactive 3D Circular Portals Landing Page (Tier 3 Boss Level)

The landing page features a **cylindrical 3D carousel of 6 celestial portals** built with **Three.js (r128)**:
1. **MyRail Orbit** (`/portfolio#projects`) — Electric Cyan (`#00f5ff`)
2. **INVENTRA Vault** (`/portfolio#projects`) — Vivid Violet (`#a855f7`)
3. **CivicConnect Pulse** (`/portfolio#projects`) — Emerald Starlight (`#10b981`)
4. **The Worldsmith Codex** (`/portfolio#story`) — Solar Gold (`#fbbf24`)
5. **The Tech Forge** (`/portfolio#about`) — Heart Rose (`#ff759f`)
6. **The Dreamers' Beacon** (`/portfolio#guestbook`) — Sky Starlight (`#38bdf8`)

### Interactions:
- **Interactive Drag & Touch Inertia:** Pointer drag smoothly rotates the portal ring in 3D space with physics dampening.
- **Raycasting:** Clicking any portal aligns it front-and-center.
- **Cinematic Warp Dive:** Clicking *“Warp Into Realm ✦”* accelerates the camera through the portal with a starlight flash into the destination.
- **Custom Magic Wand Cursor:** An SVG magic wand tilts dynamically with cursor velocity and leaves an ethereal trail of code runes (`{ }`, `</>`, `01`) and stardust sparkles.

---

## 🏆 Hackathon Rubric & Feature Matrix

### Tier 1: Complete Portfolio (Baseline)
- [x] **Character Reacts to Cursor:** Aman's eyes track pointer with soft 3D perspective card tilt.
- [x] **Scroll-Driven Story:** 9-chapter cards & flipbook navigate smoothly with scroll and interactive triggers.
- [x] **Day/Night Mood Toggle:** Toggles between "Midnight Sleepless Coder" and "Dawn Awakening Architect" with haX cream & berry theme.
- [x] **Responsive Mobile Layout:** Fluid CSS grid & flexbox tested on all dimensions.
- [x] **Discoverable Easter Egg:** Wand gem click or typing `hax`/`aman` unlocks the Secret Constellation with stardust fireworks.

### Tier 2: Memorable Standout (Hard Tier)
- [x] **Lullaby Lab with Real Audio:** Web Audio API generative ambient synth with 3 presets and waveform visualizer.
- [x] **Flashlight / Torch Cursor:** Canvas destination-out mask illuminating dark dream layers and secret developer messages.
- [x] **Dream Delivery Transit Map Animation:** SVG path motion synced with user scroll progress.
- [x] **Interactive Storybook:** 3D page-turn flipbook with Next/Prev buttons and Left/Right keyboard arrow support.
- [x] **Playable Arcade Mini-Game:** "Catch the Code Sparks" HTML5 canvas game with score tracking and high score memory.

### Tier 3: Legendary (Boss Level)
- [x] **3D WebGL / Three.js Model:** 3D circular cylindrical portals carousel (`/portals`) with procedural starfield and physics drag.
- [x] **Live Dream Guestbook:** Persistent SQLite3 database with real-time submission and live wish cards.
- [x] **Character Remembers Visitor:** `localStorage` visit counter and personalized returning greeting badge.
- [x] **Character Chats Back:** Floating "Chat with Aman" console powered by `/api/chat` with dialogue in Aman's authentic voice.
- [x] **High Lighthouse Score (90+):** Zero bloated dependencies, fast vanilla ES6+ & pure CSS.

### 5 Bonus Side Quests (+13 Points)
| Side Quest | Points | Implementation |
| :--- | :--- | :--- |
| **Magic Wand Sparkle Trail** | **+2 pts** | Custom SVG wand cursor emitting runic code particles (`{ }`, `</>`, `★`, `01`, `⚡`). |
| **Hit Counter Odometer** | **+1 pt** | Animated mechanical ticker counting live *"Dreams Delivered"* backed by SQLite. |
| **Click Sounds + Mute Toggle** | **+3 pts** | Satisfying harmonic pentatonic Web Audio chimes with a persistent **Mute Button**. |
| **Live Guestbook Wall** | **+2 pts** | Persistent SQLite database wall where visitors broadcast messages and sparks of encouragement. |
| **Responsive Chaos Mode** | **+5 pts** | Retro 88x31 badges, fluid mobile layouts, and custom Aurora Void theme. |

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run Flask application
python app.py

# 3. Open in browser
http://127.0.0.1:5050
```

---

## 📜 Credits & Attributions
- **Concept & Story:** Original story by Aman (*The Boy Who Was Building His Own World*).
- **Design & 3D WebGL:** Custom Three.js (r128) WebGL engine & Web Audio API synthesizer.
- **Data Layer:** SQLite3 with Flask REST endpoints.
