"""
build_static.py - Generates static distribution of Aman's Worldsmith Portfolio
for instant hosting on GitHub Pages, Vercel, Netlify, or any static host.
"""

import os
import shutil
import re
from app import app

DIST_DIR = os.path.join(os.path.dirname(__file__), 'dist')

# Standalone offline mock for API calls when hosted statically (e.g. GitHub Pages)
OFFLINE_API_SHIM = """
<script>
// Standalone API interceptor for GitHub Pages & static hosting
(function() {
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    if (typeof url === 'string' && (url.startsWith('/api/') || url.includes('/api/'))) {
      try {
        const response = await originalFetch(url, options);
        if (response.ok) return response;
      } catch (err) {
        // Fall back to offline emulation
      }
      
      const endpoint = url.split('/api/')[1];
      const body = options && options.body ? JSON.parse(options.body) : {};
      
      if (endpoint === 'chat') {
        const msg = (body.message || '').toLowerCase();
        let reply = "Thank you for visiting my universe! Keep building and never stop learning.";
        if (msg.includes('doubt') || msg.includes('fail') || msg.includes('hard') || msg.includes('stuck')) {
          reply = "I know that feeling so well. Every expert had once been a beginner who couldn't understand an error. There is a difference between being lost and being unfinished. You are unfinished.";
        } else if (msg.includes('myrail') || msg.includes('train')) {
          reply = "MyRail was inspired by real commuter struggles. Connecting routing engines, real-time tracking, and seamless transit maps!";
        } else if (msg.includes('inventra') || msg.includes('inventory')) {
          reply = "INVENTRA is an enterprise inventory and dashboard engine. CRUD integrity, supplier relations, and real-time analytics.";
        } else if (msg.includes('civic') || msg.includes('citizen')) {
          reply = "CivicConnect empowers citizens to report civic grievances and hold municipal authorities accountable with transparency.";
        } else if (msg.includes('family') || msg.includes('mom')) {
          reply = "Aman isn't made entirely of ambition. Caring for family gives our code true meaning and purpose.";
        }
        return new Response(JSON.stringify({ status: 'ok', reply: reply, character: 'Aman, The Young Worldsmith' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (endpoint === 'project/star') {
        const pid = body.project_id || 'project';
        const key = 'stars_' + pid;
        const current = parseInt(localStorage.getItem(key) || '350') + 1;
        localStorage.setItem(key, current.toString());
        return new Response(JSON.stringify({ status: 'ok', project_id: pid, stars_count: current }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (endpoint === 'guestbook') {
        const entry = {
          id: Date.now(),
          author_name: body.author_name || 'Fellow Builder',
          dream_wish: body.dream_wish || 'Keep shining!',
          mood_badge: body.mood_badge || '✨ Dream Builder',
          created_at: new Date().toISOString()
        };
        const saved = JSON.parse(localStorage.getItem('guestbook_wishes') || '[]');
        saved.unshift(entry);
        localStorage.setItem('guestbook_wishes', JSON.stringify(saved));
        return new Response(JSON.stringify({ status: 'ok', entry: entry }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (endpoint === 'stats/visit') {
        const visits = parseInt(localStorage.getItem('visit_count') || '612') + 1;
        localStorage.setItem('visit_count', visits.toString());
        return new Response(JSON.stringify({ status: 'ok', visits_count: visits }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    return originalFetch(url, options);
  };
})();
</script>
"""

ROUTES = [
    ('/', 'index.html', ''),
    ('/portals', 'portals/index.html', '../'),
    ('/portfolio', 'portfolio/index.html', '../'),
    ('/portal/about', 'portal/about/index.html', '../../'),
    ('/portal/myrail', 'portal/myrail/index.html', '../../'),
    ('/portal/inventra', 'portal/inventra/index.html', '../../'),
    ('/portal/civicconnect', 'portal/civicconnect/index.html', '../../'),
    ('/portal/story', 'portal/story/index.html', '../../'),
    ('/portal/guestbook', 'portal/guestbook/index.html', '../../'),
    ('/portal/arcade', 'portal/arcade/index.html', '../../'),
]


def adjust_paths_for_relative(html, rel_root):
    # Adjust root-relative links to work on GitHub Pages subdirectory (e.g. /pip-port/)
    # Replace href="/..." with href="{rel_root}..."
    def repl_href(m):
        path = m.group(1)
        if path.startswith('http://') or path.startswith('https://') or path.startswith('//') or path.startswith('#') or path.startswith('data:'):
            return m.group(0)
        clean_path = path.lstrip('/')
        if clean_path == '':
            return f'href="{rel_root}index.html"'
        elif clean_path == 'portals':
            return f'href="{rel_root}portals/index.html"'
        elif clean_path == 'portfolio':
            return f'href="{rel_root}portfolio/index.html"'
        elif clean_path.startswith('portal/'):
            return f'href="{rel_root}{clean_path}/index.html"'
        else:
            return f'href="{rel_root}{clean_path}"'

    html = re.sub(r'href="(/[^"]*)"', repl_href, html)

    # Replace src="/..." with src="{rel_root}..."
    def repl_src(m):
        path = m.group(1)
        if path.startswith('http://') or path.startswith('https://') or path.startswith('//') or path.startswith('data:'):
            return m.group(0)
        clean_path = path.lstrip('/')
        return f'src="{rel_root}{clean_path}"'

    html = re.sub(r'src="(/[^"]*)"', repl_src, html)

    # In portals.js raycaster destination links, replace URLs if needed
    return html


def build():
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR)
    os.makedirs(DIST_DIR, exist_ok=True)

    # Copy static assets
    src_static = os.path.join(os.path.dirname(__file__), 'static')
    dest_static = os.path.join(DIST_DIR, 'static')
    shutil.copytree(src_static, dest_static)
    print(f"[OK] Copied static assets to {dest_static}")

    # GitHub Pages needs .nojekyll
    with open(os.path.join(DIST_DIR, '.nojekyll'), 'w') as f:
        f.write('')

    with app.test_client() as client:
        for route, rel_path, rel_root in ROUTES:
            dest_file = os.path.join(DIST_DIR, rel_path)
            os.makedirs(os.path.dirname(dest_file), exist_ok=True)
            res = client.get(route)
            if res.status_code != 200:
                print(f"[WARN] Route {route} returned status {res.status_code}")
                continue

            html = res.get_data(as_text=True)

            # Adjust paths for static relative hosting
            html = adjust_paths_for_relative(html, rel_root)

            # Insert offline API shim before </head>
            if '</head>' in html:
                html = html.replace('</head>', f'{OFFLINE_API_SHIM}\n</head>')

            with open(dest_file, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"[OK] Rendered route {route} -> {rel_path}")

    # Also write a 404.html that redirects or falls back to index
    with open(os.path.join(DIST_DIR, '404.html'), 'w', encoding='utf-8') as f:
        f.write("""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting to Aman's World...</title>
  <script>
    location.replace('./');
  </script>
</head>
<body>
  <p>Entering the Cosmic Nexus... <a href="./">Click here if not redirected</a>.</p>
</body>
</html>
""")

    # Also mirror dist to docs for GitHub Pages /docs option
    DOCS_DIR = os.path.join(os.path.dirname(__file__), 'docs')
    if os.path.exists(DOCS_DIR):
        shutil.rmtree(DOCS_DIR)
    shutil.copytree(DIST_DIR, DOCS_DIR)
    print(f"[OK] Mirrored static build to {DOCS_DIR}")

    print("\n[SUCCESS] Build completed successfully in dist/ and docs/")


if __name__ == '__main__':
    build()
