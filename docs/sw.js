/* Agràve Pro — minimal service worker.
 *
 * Its ONLY job is to make the site installable. Chrome on Android will not
 * create a real webapp (a WebAPK) unless a service worker with a fetch handler
 * is registered — without one, "Add to Home screen" quietly falls back to a
 * bookmark shortcut, which ignores site.webmanifest completely: no maskable
 * icon (so the favicon gets drawn as a square inside a circle) and no splash
 * screen.
 *
 * Deliberately caches NOTHING. index.html is edited constantly during design
 * work, and a caching service worker would serve stale versions after a
 * reload — the single most annoying failure mode there is. Every request goes
 * straight to the network; the only thing kept locally is the offline notice
 * below, which is built in-memory rather than fetched, so it can never go
 * stale either.
 */

const OFFLINE_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Agràve Pro — offline</title>
<style>
  html,body{height:100%;margin:0}
  body{display:flex;align-items:center;justify-content:center;
       background:#FBFCFB;color:#2C6E96;text-align:center;
       font:400 20px/1.5 system-ui,-apple-system,sans-serif;padding:24px}
</style></head>
<body><p>You're offline.<br>Reconnect to view Agràve&nbsp;Pro.</p></body></html>`;

// Take over straight away so a freshly-installed worker counts on this visit
// rather than only on the next one.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  // Only page navigations are intercepted. Fonts, SVGs and images are left
  // untouched so they keep their normal HTTP caching and range-request
  // behaviour — respondWith() on every request would add a hop for no gain.
  if (event.request.mode !== 'navigate') return;

  event.respondWith(
    fetch(event.request).catch(() => new Response(OFFLINE_HTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }))
  );
});
