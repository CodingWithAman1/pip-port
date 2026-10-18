# 🌙 Pip's Dream Portfolio · haX.baby Hackathon

> *"small ideas. brighter beginnings."*
> **Event:** haX.baby 48-Hour Online Hackathon (17–19 October 2026)  
> **Challenge:** "Baby's First Portfolio: Meet the Baby"  
> **Track Chosen:** **Track 1: Pip, The Skull Baby ("Same Baby, 1,000 Websites")**  
> **Stack:** HTML5, CSS3, JavaScript (ES6+), Python 3.13, Flask 3.1, SQLite3

---

## 🧸 Meet Pip: Junior Dream Engineer at Midnight Nursery

Pip is a sleepy, gentle baby with a smooth round skull face, huge soft eye sockets with glowing warm amber pinpricks, a tiny crooked smile, and a bedtime nightcap with stars and a pink bow. Pip works at the **Midnight Nursery**, designing and weaving the dreams, lullabies, nightlights, and bedtime stories that help the neighborhood's little creatures fall asleep.

---

## ✨ Three Core Portfolio Pillars Answered

1. **Who Pip Is:** Established in the hero section and formal **Character Sheet**, capturing Pip's canon traits (gentle, curious, loves music chimes, never scary).
2. **What Pip Does (3 Showcase Projects):**
   - **Project 1: The Lullaby Lab** — Interactive Web Audio music box synthesizer with playable pentatonic chimes (C5 to C6) and automated bedtime melody generator.
   - **Project 2: Nightlight Collection** — Interactive gallery of porcelain dream lanterns (Moon Lamp, Star Jar, Lavender Globe) with dynamic radial CSS lighting and live SQLite touch tracking.
   - **Project 3: Dream Delivery Routes** — Interactive SVG flight map tracing Pip's nocturnal rooftop flight path over chimney silhouettes with clickable delivery checkpoints.
3. **What Pip's Story Is:** A 4-scene illustrated bedtime scroll (*Dusk in the Nursery*, *The Craft of Lullabies*, *Midnight Chimney Flight*, and *Pip's Own Goodnight*) kept under 150 words per scene.

---

## 🎯 Tier Requirements & Bonus Side Quests (+13 Points)

| Feature | Tier / Quest | Status | Details |
| :--- | :--- | :--- | :--- |
| **Interactive Eye-Tracking** | **Tier 1 (Core)** | ✅ Complete | Pip's warm glowing amber eye pinpricks smoothly follow the mouse cursor with smooth trigonometry. |
| **Day / Night Mood Shift** | **Tier 1 (Core)** | ✅ Complete | One-click toggle between "Warm Nursery Cream" (`#fff8f1`, `#a34063`) and "Midnight Starlight Dream" (`#0c0d1b`, `#fbbf24`). |
| **Web Audio Synthesizer** | **Tier 2 (Hard)** | ✅ Complete | Native Web Audio API pure sine-wave oscillator chimes with realistic exponential gain envelopes. |
| **Click Sounds + Mute Toggle** | **Side Quest (+3 pts)** | ✅ Complete | Gentle pentatonic feedback on interactions with an accessible, persistent **Mute Switch** in the top navigation bar. |
| **Sparkle Cursor Trail** | **Side Quest (+2 pts)** | ✅ Complete | Retro floating stars, dreamy clouds, and amber sparkles following the pointer. |
| **Hit Counter Odometer** | **Side Quest (+1 pt)** | ✅ Complete | Vintage mechanical-style ticker counting "Dreams Delivered", synchronized with SQLite database. |
| **Live Dream Guestbook Wall** | **Side Quest (+2 pts)** | ✅ Complete | Persistent SQLite database wall where visitors write wishes and sign Pip's nursery. |
| **Responsive Chaos Mode** | **Side Quest (+5 pts)** | ✅ Complete | Early-web nostalgic badge strip, 88x31 badges, and 100% fluid mobile responsiveness. |
| **Hidden Easter Egg** | **Core Requirement** | ✅ Complete | Clicking the starry nightcap bow reveals Pip's secret dream wish modal with celebratory chimes. |

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- `pip`

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run the Flask Application
```bash
python app.py
```

### Step 3: Open in Browser
Visit **`http://127.0.0.1:5050`** in your browser to experience Pip's Dream Portfolio!

---

## 📂 Project Architecture

```
pip-portfolio/
├── app.py                      # Flask backend & SQLite API endpoints
├── dreams.db                   # SQLite database (auto-generated on startup)
├── requirements.txt            # Python dependencies (Flask>=3.0.0)
├── README.md                   # Complete documentation & hackathon details
├── templates/
│   └── index.html              # Semantic HTML5 portfolio template
└── static/
    ├── css/
    │   └── style.css           # Custom haX.baby warm cream & midnight CSS
    ├── js/
    │   └── main.js             # Eye tracking, Web Audio synth, guestbook AJAX
    └── assets/
        ├── pip_avatar_cloud.png   # Official hero cloud render
        ├── pip_lullaby_box.png    # Official music box render
        ├── pip_dream_lantern.png  # Official dream lantern render
        ├── pip_portrait.png       # Official studio character portrait
        └── pip_sketch.jpg         # Official character sketch
```

---

## 📜 Credits & Attributions
- **Character Concept & Assets:** [haX.baby](https://hax.baby) official Track 1 creator pack.
- **Color Palette & Styling:** haX.baby official design tokens (`#fff8f1`, `#a34063`, `#5c4033`).
- **Typography:** Google Fonts (*Fraunces*, *Fredoka*, *Comfortaa*, *Plus Jakarta Sans*).
- **Audio:** Native Web Audio API mathematical oscillator synthesis (zero external audio files).
