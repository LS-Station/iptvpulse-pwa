(function() {
  'use strict';
  // Style: Perfect Match with Visitor Counter
  var s = document.createElement('style');
  s.innerHTML = `
    #pwa-btn {
      display: none;
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: #000;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-size: 13px;
      border-radius: 50px;
      font-family: sans-serif;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      cursor: pointer;
    }
  `;
  document.head.appendChild(s);

  // Button
  var b = document.createElement('button');
  b.id = 'pwa-btn';
  b.innerText = 'IPTVPulse App';
  document.body.appendChild(b);

  // Manifest & SW Logic
  var m = {
    "name": "IPTV Pulse",
    "short_name": "IPTVPulse",
    "start_url": window.location.href,
    "display": "standalone",
    "background_color": "#fff",
    "theme_color": "#000",
    "icons": [
      {"src":"https://cdn.jsdelivr.net/gh/LS-Station/iptvpulse-pwa@main/icon-192.png","sizes":"192x192","type":"image/png"},
      {"src":"https://cdn.jsdelivr.net/gh/LS-Station/iptvpulse-pwa@main/icon-512.png","sizes":"512x512","type":"image/png"}
    ]
  };
  var l = document.createElement('link');
  l.rel = 'manifest';
  l.href = URL.createObjectURL(new Blob([JSON.stringify(m)], {type: 'application/json'}));
  document.head.appendChild(l);

  if ('serviceWorker' in navigator) {
    var sc = "self.addEventListener('install', e=>self.skipWaiting());self.addEventListener('activate', e=>self.clients.claim());self.addEventListener('fetch', e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));";
    navigator.serviceWorker.register(URL.createObjectURL(new Blob([sc], {type: 'text/javascript'})), {scope: '/'});
  }

  // Install Prompt
  var p;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    p = e;
    b.style.display = 'block';
  });

  b.addEventListener('click', () => {
    b.style.display = 'none';
    if (p) { p.prompt(); p = null; }
  });
})();
