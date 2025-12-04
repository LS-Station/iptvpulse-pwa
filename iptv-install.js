(function() {
  'use strict';

  // 1. Inject Styles (Small, Left Side, Premium Look)
  var style = document.createElement('style');
  style.innerHTML = `
    #pwa-install-btn {
      display: none;
      position: fixed;
      bottom: 20px;
      left: 20px;
      background-color: #000000;
      color: #ffffff;
      border: none;
      /* একদম ছোট এবং স্লিম সাইজ */
      padding: 6px 12px;
      font-size: 11px;
      border-radius: 50px;
      font-family: sans-serif;
      font-weight: bold;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      z-index: 10000;
      cursor: pointer;
      transition: transform 0.2s ease, background-color 0.2s ease;
    }
    #pwa-install-btn:hover {
      transform: scale(1.05);
      background-color: #222;
    }
  `;
  document.head.appendChild(style);

  // 2. Create Install Button (Text: IPTVPulse App)
  var btn = document.createElement('button');
  btn.id = 'pwa-install-btn';
  btn.innerText = 'IPTVPulse App';
  document.body.appendChild(btn);

  // 3. Generate Manifest Dynamically
  var manifest = {
    "name": "IPTV Pulse",
    "short_name": "IPTVPulse",
    "start_url": window.location.href,
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#000000",
    "icons": [
      {
        "src": "https://cdn.jsdelivr.net/gh/LS-Station/iptvpulse-pwa@main/icon-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "https://cdn.jsdelivr.net/gh/LS-Station/iptvpulse-pwa@main/icon-512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  };
  
  var blobManifest = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
  var link = document.createElement('link');
  link.rel = 'manifest';
  link.href = URL.createObjectURL(blobManifest);
  document.head.appendChild(link);

  // 4. Service Worker Logic
  if ('serviceWorker' in navigator) {
    var swCode = `
      self.addEventListener('install', e => self.skipWaiting());
      self.addEventListener('activate', e => self.clients.claim());
      self.addEventListener('fetch', e => {
        e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
      });
    `;
    var blobSW = new Blob([swCode], {type: 'text/javascript'});
    navigator.serviceWorker.register(URL.createObjectURL(blobSW), {scope: '/'})
      .catch(err => console.log('SW Error', err));
  }

  // 5. Install Prompt Event
  var deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btn.style.display = 'block';
  });

  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => deferredPrompt = null);
    }
  });

  window.addEventListener('appinstalled', () => {
    btn.style.display = 'none';
  });
})();
