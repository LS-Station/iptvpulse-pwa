(function() {
  'use strict';

  // 1. Restrict to Homepage Only
  // The script will stop here if the user is not on the homepage.
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    return;
  }

  // 2. Inject Styles (Matches Visitor Counter)
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

  // 3. Create Install Button
  var b = document.createElement('button');
  b.id = 'pwa-btn';
  b.innerText = 'IPTVPulse App';
  document.body.appendChild(b);

  // 4. Generate Manifest Dynamically
  var m = {
    "name": "IPTV Pulse",
    "short_name": "IPTVPulse",
    "start_url": window.location.href + "?utm_source=pwa_app",
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

  // 5. Register Service Worker
  if ('serviceWorker' in navigator) {
    var sc = "self.addEventListener('install', e=>self.skipWaiting());self.addEventListener('activate', e=>self.clients.claim());self.addEventListener('fetch', e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));";
    navigator.serviceWorker.register(URL.createObjectURL(new Blob([sc], {type: 'text/javascript'})), {scope: '/'});
  }

  // 6. Handle Install Prompt
  var p;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    p = e;
    b.style.display = 'block';
  });

  b.addEventListener('click', () => {
    b.style.display = 'none';
    if (p) { 
      p.prompt(); 
      p.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // Track in Google Analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'app_installed', {
              'event_category': 'PWA',
              'event_label': 'User installed via Button'
            });
          }
        }
        p = null;
      });
    }
  });

  // 7. Hide Button if Installed
  window.addEventListener('appinstalled', () => {
    b.style.display = 'none';
    if (typeof gtag !== 'undefined') {
        gtag('event', 'app_installed_success', {
            'event_category': 'PWA',
            'event_label': 'Installation Complete'
        });
    }
  });
})();
