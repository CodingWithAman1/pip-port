"""
Pip's Dream Portfolio - Flask & SQLite Backend
Built for the haX.baby 48-Hour Hackathon: "Baby's First Website"
Track 1: Pip, The Skull Baby (Junior Dream Engineer at Midnight Nursery)
"""

import os
import sqlite3
from datetime import datetime
from flask import Flask, render_template, request, jsonify, g

app = Flask(__name__)
app.config['SECRET_KEY'] = 'pip-midnight-nursery-dream-key-2026'

DB_PATH = os.path.join(os.path.dirname(__file__), 'dreams.db')


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

    # 1. Visitor / Dreams Delivered Odometer Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY,
            dreams_delivered INTEGER NOT NULL DEFAULT 1482,
            visits_count INTEGER NOT NULL DEFAULT 389
        )
    ''')

    # 2. Dream Wish Guestbook Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS guestbook (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_name TEXT NOT NULL,
            dream_wish TEXT NOT NULL,
            mood_badge TEXT DEFAULT '🌙 Sweet Dreams',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 3. Nightlight Lantern Favorites
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS lanterns (
            lantern_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            sparkle_count INTEGER DEFAULT 0
        )
    ''')

    # Seed initial stats if empty
    cursor.execute('SELECT COUNT(*) FROM stats')
    if cursor.fetchone()[0] == 0:
        cursor.execute('INSERT INTO stats (id, dreams_delivered, visits_count) VALUES (1, 1482, 389)')

    # Seed initial lanterns if empty
    lantern_seeds = [
        ('lantern-moon', 'Porcelain Crescent Lantern', 142),
        ('lantern-star', 'Starlight Firefly Mason Jar', 98),
        ('lantern-lavender', 'Deep Slumber Lavender Globe', 167),
    ]
    for lid, name, sparkles in lantern_seeds:
        cursor.execute('''
            INSERT OR IGNORE INTO lanterns (lantern_id, name, sparkle_count)
            VALUES (?, ?, ?)
        ''', (lid, name, sparkles))

    # Seed cozy starter guestbook wishes if empty
    cursor.execute('SELECT COUNT(*) FROM guestbook')
    if cursor.fetchone()[0] == 0:
        seed_wishes = [
            ('Luna the Sleepy Moth', 'Wishing for sweet lavender breezes and gentle moonlight over the forest trees.', '✨ Starry Slumber'),
            ('Barnaby the Bear Cub', 'Pip, please weave a dream where I can fly over blueberry fields with wings!', '🫐 Berry Sweet'),
            ('The haX.baby Crew', 'Welcome to Pip’s Midnight Nursery! Thank you for crafting dreams that warm the internet.', '🏆 haX Certified'),
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
# Web Page Route
# -------------------------------------------------------------
@app.route('/')
def index():
    """Renders the main interactive portfolio page."""
    db = get_db()
    cursor = db.cursor()

    cursor.execute('SELECT * FROM stats WHERE id = 1')
    stats = cursor.fetchone()

    cursor.execute('SELECT * FROM guestbook ORDER BY id DESC LIMIT 20')
    wishes = cursor.fetchall()

    cursor.execute('SELECT * FROM lanterns')
    lanterns = {row['lantern_id']: row['sparkle_count'] for row in cursor.fetchall()}

    return render_template(
        'index.html',
        stats=stats,
        wishes=wishes,
        lanterns=lanterns,
        current_year=2026
    )


# -------------------------------------------------------------
# REST API Endpoints for Dynamic Interactions
# -------------------------------------------------------------
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Returns current dream odometer stats."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT dreams_delivered, visits_count FROM stats WHERE id = 1')
    row = cursor.fetchone()
    return jsonify({
        'status': 'ok',
        'dreams_delivered': row['dreams_delivered'] if row else 1482,
        'visits_count': row['visits_count'] if row else 389
    })


@app.route('/api/stats/visit', methods=['POST'])
def record_visit():
    """Increments visit counter and returns updated odometer value."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        UPDATE stats 
        SET visits_count = visits_count + 1,
            dreams_delivered = dreams_delivered + 1
        WHERE id = 1
    ''')
    db.commit()

    cursor.execute('SELECT dreams_delivered, visits_count FROM stats WHERE id = 1')
    row = cursor.fetchone()
    return jsonify({
        'status': 'ok',
        'dreams_delivered': row['dreams_delivered'],
        'visits_count': row['visits_count']
    })


@app.route('/api/guestbook', methods=['GET', 'POST'])
def handle_guestbook():
    """Fetches or submits a guestbook dream wish."""
    db = get_db()
    cursor = db.cursor()

    if request.method == 'POST':
        data = request.get_json() or request.form
        author = (data.get('author_name') or 'Anonymous Dreamer').strip()[:40]
        wish = (data.get('dream_wish') or '').strip()[:280]
        badge = (data.get('mood_badge') or '🌙 Sweet Dreams').strip()[:30]

        if not wish:
            return jsonify({'status': 'error', 'message': 'Please write a dream wish!'}), 400

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

    # GET requests
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


@app.route('/api/lantern/sparkle', methods=['POST'])
def sparkle_lantern():
    """Registers a light touch/sparkle on a nightlight lantern."""
    data = request.get_json() or {}
    lantern_id = data.get('lantern_id', 'lantern-moon')

    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        UPDATE lanterns SET sparkle_count = sparkle_count + 1 WHERE lantern_id = ?
    ''', (lantern_id,))
    db.commit()

    cursor.execute('SELECT sparkle_count FROM lanterns WHERE lantern_id = ?', (lantern_id,))
    row = cursor.fetchone()
    count = row['sparkle_count'] if row else 1

    return jsonify({'status': 'ok', 'lantern_id': lantern_id, 'sparkle_count': count})


@app.route('/api/health')
def health_check():
    """Health check endpoint for deployment monitoring."""
    return jsonify({
        'status': 'healthy',
        'character': 'Pip, The Skull Baby',
        'role': 'Junior Dream Engineer',
        'hackathon': "haX.baby - Baby's First Website (October 2026)"
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    print(f"[*] Pip's Dream Portfolio running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
