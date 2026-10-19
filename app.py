"""
Aman Sharma: The Young Worldsmith - Flask & SQLite Backend
Software Developer Portfolio & Interactive Project Ecosystem
Character: Aman, The Boy Who Was Building His Own World
"""

import os
import sqlite3
from datetime import datetime
from flask import Flask, render_template, request, jsonify, g

app = Flask(__name__)
app.config['SECRET_KEY'] = 'aman-worldsmith-code-universe-2026'

DB_PATH = os.path.join(os.path.dirname(__file__), 'world.db')


def get_db():
    """Opens a new database connection per request."""
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(error):
    """Closes the database connection at the end of the request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    """Initializes SQLite database tables and default starter records."""
    db = sqlite3.connect(DB_PATH)
    cursor = db.cursor()

    # 1. Visitor / World-Building Stats Odometer Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY,
            lines_of_code INTEGER NOT NULL DEFAULT 48920,
            dreams_delivered INTEGER NOT NULL DEFAULT 2840,
            visits_count INTEGER NOT NULL DEFAULT 612
        )
    ''')

    # 2. Inspiration & Message Guestbook Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS guestbook (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_name TEXT NOT NULL,
            dream_wish TEXT NOT NULL,
            mood_badge TEXT DEFAULT '✨ Dream Builder',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 3. Project Star & Upvote Tracker
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            project_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            tech_stack TEXT NOT NULL,
            stars_count INTEGER DEFAULT 0
        )
    ''')

    # Seed initial stats if empty
    cursor.execute('SELECT COUNT(*) FROM stats')
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO stats (id, lines_of_code, dreams_delivered, visits_count)
            VALUES (1, 48920, 2840, 612)
        ''')

    # Seed Aman's 3 flagship projects
    project_seeds = [
        ('myrail', 'MyRail Transit System', 'Infrastructure & Public Transport', 'Python, Flask, API, SQL', 342),
        ('inventra', 'INVENTRA Core', 'Enterprise Inventory & Dashboard Engine', 'Database Design, Full-Stack, Analytics', 418),
        ('civicconnect', 'CivicConnect', 'Public Transparency & Civic Action', 'Community Empowerment, Accountability, Web', 529),
    ]
    for pid, name, cat, tech, stars in project_seeds:
        cursor.execute('''
            INSERT OR IGNORE INTO projects (project_id, name, category, tech_stack, stars_count)
            VALUES (?, ?, ?, ?, ?)
        ''', (pid, name, cat, tech, stars))

    # Seed starter guestbook messages honoring the journey
    cursor.execute('SELECT COUNT(*) FROM guestbook')
    if cursor.fetchone()[0] == 0:
        seed_wishes = [
            ('A Fellow Coder', 'Keep pushing through the compiler errors, Aman. Every bug fixed is a step closer to mastery!', '💻 Code Craftsman'),
            ('Mom', 'So proud of your heart and your hard work. You carry our love wherever your code takes you.', '❤️ Family Heart'),
            ('Tech Community Reviewer', 'A magnificent story of resilience, responsibility, and genuine software craft. Exceptional portfolio!', '⭐ Star Creator'),
        ]
        for author, wish, mood in seed_wishes:
            cursor.execute('''
                INSERT INTO guestbook (author_name, dream_wish, mood_badge)
                VALUES (?, ?, ?)
            ''', (author, wish, mood))

    db.commit()
    db.close()


# Ensure DB is initialized before first request
init_db()


# -------------------------------------------------------------
# Story Data (The 9 Chapters of Aman's Journey)
# -------------------------------------------------------------
AMAN_STORY_CHAPTERS = [
    {
        "num": 1,
        "title": "A Boy With Too Many Dreams",
        "tag": "The Spark",
        "excerpt": "Aman wasn't the kind of boy who had his entire life planned out. But he had something that kept him moving: he had dreams of turning lines of code into something meaningful.",
        "icon": "✨",
        "color": "#00f5ff"
    },
    {
        "num": 2,
        "title": "The War Nobody Could See",
        "tag": "The Silent Battle",
        "excerpt": "People measure progress by completed projects and marks. They don't see the silent days staring at broken screens, fighting impatience, wondering: 'Am I moving fast enough?'",
        "icon": "⚔️",
        "color": "#a855f7"
    },
    {
        "num": 3,
        "title": "More Than Just a Student",
        "tag": "The Inventions",
        "excerpt": "He wanted skills that lived outside classrooms. He started building MyRail for transportation, INVENTRA for inventory systems, and CivicConnect for public accountability.",
        "icon": "🚀",
        "color": "#38bdf8"
    },
    {
        "num": 4,
        "title": "The People He Carried in His Heart",
        "tag": "Love & Duty",
        "excerpt": "Aman wasn't made entirely of ambition. When his mother fell ill, he learned that life cannot be governed solely by a timetable. Relationships gave his code purpose.",
        "icon": "❤️",
        "color": "#ff759f"
    },
    {
        "num": 5,
        "title": "The Endless Race Against Time",
        "tag": "Patience",
        "excerpt": "College, exams, frameworks, algorithms—he learned that becoming someone requires pacing yourself. 'There is a difference between being lost and being unfinished.'",
        "icon": "⏳",
        "color": "#fbbf24"
    },
    {
        "num": 6,
        "title": "Building Something That Mattered",
        "tag": "Real Impact",
        "excerpt": "He didn't need to be the most talented person in the room. He needed to be someone willing to learn from the room, break things, and rebuild them stronger.",
        "icon": "🌍",
        "color": "#10b981"
    },
    {
        "num": 7,
        "title": "The Days When Nothing Seemed to Change",
        "tag": "Invisible Growth",
        "excerpt": "Routine days. Repetitive code. Yet every fixed bug and every returned attempt was quietly shaping him. He wasn't where he wanted to be, but he wasn't where he started.",
        "icon": "🌱",
        "color": "#00f5ff"
    },
    {
        "num": 8,
        "title": "The Future Was Not a Promise",
        "tag": "Courage",
        "excerpt": "Effort didn't guarantee immediate success. The future wasn't an entitlement—it was something built while living through an imperfect, challenging present.",
        "icon": "🔮",
        "color": "#c084fc"
    },
    {
        "num": 9,
        "title": "The Real Beginning",
        "tag": "The Becoming",
        "excerpt": "He opened his laptop again. Not because he had figured everything out, but because between the lines of code and the next bug, he was building more than software—he was building himself.",
        "icon": "🌟",
        "color": "#fbbf24"
    }
]


# -------------------------------------------------------------
# Web Page Routes (Separate Dedicated Portals & Realms)
# -------------------------------------------------------------
@app.route('/')
@app.route('/portals')
def portals_landing():
    """Renders the 3D Circular Portals Landing Page (The Cosmic Nexus)."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT lines_of_code, dreams_delivered, visits_count FROM stats WHERE id = 1')
    stats = cursor.fetchone()
    return render_template('portals.html', stats=stats, active_page='nexus')


# -------------------------------------------------------------
# Real Flagship Projects Metadata
# -------------------------------------------------------------
PROJECTS_METADATA = {
    'myrail': {
        'project_id': 'myrail',
        'name': 'MyRail Transit System',
        'category': 'Infrastructure & Public Transport',
        'tech_stack': 'Python, Flask, API, SQL',
        'live_url': 'https://myrailbase.netlify.app/',
        'github_url': 'https://github.com/CodingWithAman1/myRail',
        'preview_img': 'myrail.png',
        'tagline': 'Real-Time Train Transit Intelligence & Routing System'
    },
    'inventra': {
        'project_id': 'inventra',
        'name': 'INVENTRA Core',
        'category': 'Enterprise Inventory & Dashboard Engine',
        'tech_stack': 'Database Design, Full-Stack, Analytics',
        'live_url': 'https://inventra-rho-lac.vercel.app/',
        'github_url': 'https://github.com/CodingWithAman1/Inventra',
        'preview_img': 'inv.png',
        'tagline': 'Full-Stack Warehouse Relational Database & Dashboard Engine'
    },
    'civicconnect': {
        'project_id': 'civicconnect',
        'name': 'CivicConnect',
        'category': 'Public Transparency & Civic Action',
        'tech_stack': 'Community Empowerment, Accountability, Web',
        'live_url': 'https://civicconnectweb.onrender.com/',
        'github_url': 'https://github.com/CodingWithAman1/CivicConnect',
        'preview_img': 'civicconnect.png',
        'tagline': 'AI-Powered Citizen Grievance Resolution & Transparency Platform'
    }
}


@app.route('/portal/myrail')
@app.route('/realm/myrail')
@app.route('/projects/myrail')
def realm_myrail():
    """Renders dedicated MyRail Transit System portal."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM projects WHERE project_id = "myrail"')
    project = cursor.fetchone()
    cursor.execute('SELECT * FROM stats WHERE id = 1')
    stats = cursor.fetchone()
    return render_template(
        'portal_myrail.html',
        project=project,
        project_meta=PROJECTS_METADATA['myrail'],
        stats=stats,
        active_page='myrail'
    )


@app.route('/portal/inventra')
@app.route('/realm/inventra')
@app.route('/projects/inventra')
def realm_inventra():
    """Renders dedicated INVENTRA Core enterprise inventory portal."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM projects WHERE project_id = "inventra"')
    project = cursor.fetchone()
    cursor.execute('SELECT * FROM stats WHERE id = 1')
    stats = cursor.fetchone()
    return render_template(
        'portal_inventra.html',
        project=project,
        project_meta=PROJECTS_METADATA['inventra'],
        stats=stats,
        active_page='inventra'
    )


@app.route('/portal/civicconnect')
@app.route('/realm/civicconnect')
@app.route('/projects/civicconnect')
def realm_civicconnect():
    """Renders dedicated CivicConnect civic action & transparency portal."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM projects WHERE project_id = "civicconnect"')
    project = cursor.fetchone()
    cursor.execute('SELECT * FROM stats WHERE id = 1')
    stats = cursor.fetchone()
    return render_template(
        'portal_civicconnect.html',
        project=project,
        project_meta=PROJECTS_METADATA['civicconnect'],
        stats=stats,
        active_page='civicconnect'
    )


@app.route('/portal/story')
@app.route('/story')
@app.route('/codex')
@app.route('/portal/codex')
def realm_story():
    """Renders dedicated Worldsmith Codex 9-chapter chronicle portal."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM stats WHERE id = 1')
    stats = cursor.fetchone()
    return render_template('portal_story.html', chapters=AMAN_STORY_CHAPTERS, stats=stats, active_page='story')


@app.route('/portal/about')
@app.route('/about')
@app.route('/character')
@app.route('/portal/forge')
def realm_about():
    """Renders dedicated Character Sheet & Tech Forge portal."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM stats WHERE id = 1')
    stats = cursor.fetchone()
    return render_template('portal_about.html', stats=stats, active_page='about')


@app.route('/portal/guestbook')
@app.route('/guestbook')
@app.route('/beacon')
@app.route('/portal/beacon')
def realm_guestbook():
    """Renders dedicated Dreamers' Beacon SQLite inspiration wall portal."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM stats WHERE id = 1')
    stats = cursor.fetchone()
    cursor.execute('SELECT * FROM guestbook ORDER BY id DESC LIMIT 40')
    wishes = cursor.fetchall()
    return render_template('portal_guestbook.html', wishes=wishes, stats=stats, active_page='guestbook')


@app.route('/portal/arcade')
@app.route('/arcade')
@app.route('/lab')
def realm_arcade():
    """Renders dedicated Arcade mini-game & Lullaby Synth lab portal."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM stats WHERE id = 1')
    stats = cursor.fetchone()
    return render_template('portal_arcade.html', stats=stats, active_page='arcade')


@app.route('/portfolio')
@app.route('/projects')
def portfolio():
    """Redirects or renders the full interactive world portfolio view."""
    db = get_db()
    cursor = db.cursor()

    cursor.execute('SELECT * FROM stats WHERE id = 1')
    stats = cursor.fetchone()

    cursor.execute('SELECT * FROM guestbook ORDER BY id DESC LIMIT 25')
    wishes = cursor.fetchall()

    cursor.execute('SELECT * FROM projects')
    projects_list = cursor.fetchall()
    projects = {row['project_id']: row for row in projects_list}

    return render_template(
        'index.html',
        stats=stats,
        wishes=wishes,
        projects=projects,
        projects_meta=PROJECTS_METADATA,
        chapters=AMAN_STORY_CHAPTERS,
        current_year=2026,
        active_page='portfolio'
    )


# -------------------------------------------------------------
# REST API Endpoints
# -------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'app': 'Aman: The Young Worldsmith', 'track': 2})


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Returns live stats."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT lines_of_code, dreams_delivered, visits_count FROM stats WHERE id = 1')
    row = cursor.fetchone()
    return jsonify({
        'status': 'ok',
        'lines_of_code': row['lines_of_code'] if row else 48920,
        'dreams_delivered': row['dreams_delivered'] if row else 2840,
        'visits_count': row['visits_count'] if row else 612
    })


@app.route('/api/stats/visit', methods=['POST'])
def record_visit():
    """Increments visit counter on page load."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        UPDATE stats 
        SET visits_count = visits_count + 1,
            dreams_delivered = dreams_delivered + 1
        WHERE id = 1
    ''')
    db.commit()

    cursor.execute('SELECT lines_of_code, dreams_delivered, visits_count FROM stats WHERE id = 1')
    row = cursor.fetchone()
    return jsonify({
        'status': 'ok',
        'lines_of_code': row['lines_of_code'],
        'dreams_delivered': row['dreams_delivered'],
        'visits_count': row['visits_count']
    })


@app.route('/api/guestbook', methods=['GET', 'POST'])
def handle_guestbook():
    """Fetches or leaves a dream inspiration on Aman's wall."""
    db = get_db()
    cursor = db.cursor()

    if request.method == 'POST':
        data = request.get_json() or request.form
        author = (data.get('author_name') or 'Fellow Explorer').strip()[:40]
        wish = (data.get('dream_wish') or '').strip()[:320]
        badge = (data.get('mood_badge') or '✨ Dream Builder').strip()[:30]

        if not wish:
            return jsonify({'status': 'error', 'message': 'Please leave an inspiring message!'}), 400

        cursor.execute('''
            INSERT INTO guestbook (author_name, dream_wish, mood_badge)
            VALUES (?, ?, ?)
        ''', (author, wish, badge))

        # Also increment dreams delivered count
        cursor.execute('UPDATE stats SET dreams_delivered = dreams_delivered + 1 WHERE id = 1')
        db.commit()

        new_id = cursor.lastrowid
        cursor.execute('SELECT * FROM guestbook WHERE id = ?', (new_id,))
        created = cursor.fetchone()

        return jsonify({
            'status': 'ok',
            'entry': {
                'id': created['id'],
                'author_name': created['author_name'],
                'dream_wish': created['dream_wish'],
                'mood_badge': created['mood_badge'],
                'created_at': created['created_at']
            }
        }), 201

    # GET
    cursor.execute('SELECT * FROM guestbook ORDER BY id DESC LIMIT 30')
    wishes = [
        {
            'id': r['id'],
            'author_name': r['author_name'],
            'dream_wish': r['dream_wish'],
            'mood_badge': r['mood_badge'],
            'created_at': r['created_at']
        }
        for r in cursor.fetchall()
    ]
    return jsonify({'status': 'ok', 'wishes': wishes})


@app.route('/api/project/star', methods=['POST'])
def star_project():
    """Stars a showcase project in SQLite."""
    data = request.get_json() or {}
    project_id = data.get('project_id', 'myrail')

    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        UPDATE projects SET stars_count = stars_count + 1 WHERE project_id = ?
    ''', (project_id,))
    db.commit()

    cursor.execute('SELECT stars_count FROM projects WHERE project_id = ?', (project_id,))
    row = cursor.fetchone()
    count = row['stars_count'] if row else 1

    return jsonify({'status': 'ok', 'project_id': project_id, 'stars_count': count})


@app.route('/api/chat', methods=['POST'])
def chat_with_aman():
    """Interactive dialogue in Aman's authentic developer voice."""
    data = request.get_json() or {}
    message = (data.get('message') or '').strip().lower()

    if not message:
        return jsonify({
            'status': 'ok',
            'reply': "Hello! I'm Aman. Ask me about MyRail, dealing with coding self-doubts, or what it feels like to build your own world."
        })

    # Rule-based character voice engine
    if any(k in message for k in ['doubt', 'fail', 'hard', 'stuck', 'error', 'scared', 'behind', 'impatient']):
        reply = "I know that feeling so well. You sit in front of the screen, wondering if everyone else is moving faster. But remember: every expert had once been a beginner who couldn't understand an error. There is a difference between being lost and being unfinished. You are unfinished."
    elif any(k in message for k in ['family', 'mother', 'mom', 'love', 'personal', 'care']):
        reply = "Aman isn't made entirely of ambition. When my mother had health problems, I realized ordinary student timetables can't be all that matters. You have a future to build, but you also have a life to live while building it. Caring gives our code purpose."
    elif any(k in message for k in ['myrail', 'rail', 'train', 'transport']):
        reply = "MyRail was inspired by real commuter struggles. I wanted to see railway schedules, delay tracking, and transit maps work together seamlessly. It taught me how real APIs and backend routing connect."
    elif any(k in message for k in ['inventra', 'inventory', 'warehouse', 'stock', 'store']):
        reply = "INVENTRA is an inventory and dashboard engine. Products, suppliers, relational databases, and metrics all communicating in real time. It was my deep dive into database architecture and CRUD integrity."
    elif any(k in message for k in ['civic', 'civicconnect', 'citizen', 'city', 'government', 'public']):
        reply = "CivicConnect reached beyond ordinary software. It imagines a platform where citizens report public issues, track municipal progress, and hold authorities accountable. Code should make public life better."
    elif any(k in message for k in ['tech', 'stack', 'languages', 'python', 'sql', 'c']):
        reply = "C, Python, SQL, web development, data structures, and algorithms! To someone looking from the outside, they're just subjects. To me, they are the magical bricks of a much bigger world."
    elif any(k in message for k in ['advice', 'tip', 'learn', 'future', 'become']):
        reply = "Don't measure yourself by the distance to the destination. Look at how far you've come from where you started. You don't need to turn every hour into productive work. Just keep moving. Not at somebody else's speed. Just forward."
    elif any(k in message for k in ['wand', 'magic', 'sparkle']):
        reply = "The magic wand channels terminal logic into stardust! Every time you tap a button, you're helping me weave another corner of this world."
    else:
        reply = f"Thank you for asking! In the middle of college, examinations, and late nights, what keeps me going is knowing that every line of code brings us closer to what we can become. Let's keep building together."

    return jsonify({
        'status': 'ok',
        'reply': reply,
        'character': 'Aman, The Young Worldsmith'
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    print(f"[*] Aman's Worldsmith Portfolio running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
