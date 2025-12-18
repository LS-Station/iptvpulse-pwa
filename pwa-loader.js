(function() {
  'use strict';

  // 1. Reset & Inject Styles
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
      padding: 10px 20px;
      font-size: 13px;
      border-radius: 50px;
      font-family: sans-serif;
      font-weight: bold;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // 2. Create Button
  var btn = document.createElement('button');
  btn.id = 'pwa-install-btn';
  btn.innerText = 'IPTVPulse App';
  document.body.appendChild(btn);

  // 3. Manifest with Root Scope
  var manifest = {
    "name": "IPTV Pulse",
    "short_name": "IPTVPulse",
    "start_url": "/", 
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
  
  var link = document.createElement('link');
  link.rel = 'manifest';
  link.href = URL.createObjectURL(new Blob([JSON.stringify(manifest)], {type: 'application/json'}));
  document.head.appendChild(link);

  // 4. Force Service Worker Update
  if ('serviceWorker' in navigator) {
    var swCode = `
      self.addEventListener('install', e => self.skipWaiting());
      self.addEventListener('activate', e => self.clients.claim());
      self.addEventListener('fetch', e => {
        e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
      });
    `;
    navigator.serviceWorker.register(URL.createObjectURL(new Blob([swCode], {type: 'text/javascript'})), {scope: '/'})
      .then(() => console.log('SW Ready'));
  }

  // 5. Catch the Install Prompt
  var deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btn.style.display = 'block'; // Show button immediately
  });

  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => deferredPrompt = null);
    }
  });
})();
