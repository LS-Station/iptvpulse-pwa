(function() {
    // Firebase Libraries (Dynamically Loaded)
    var firebaseVersion = "10.12.0";
    var appScript = "https://www.gstatic.com/firebasejs/" + firebaseVersion + "/firebase-app-compat.js";
    var dbScript = "https://www.gstatic.com/firebasejs/" + firebaseVersion + "/firebase-database-compat.js";

    function loadScript(src, callback) {
        var script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Load Firebase App first, then Database, then Logic
    loadScript(appScript, function() {
        loadScript(dbScript, function() {
            startViewCounter();
        });
    });

    function startViewCounter() {
        const firebaseConfig = {
            apiKey: "AIzaSyBV8cUpcXp5q21e1UUWCFOESOAyzbCRbvg",
            authDomain: "iptvpulse-views.firebaseapp.com",
            databaseURL: "https://iptvpulse-views-default-rtdb.firebaseio.com",
            projectId: "iptvpulse-views",
            storageBucket: "iptvpulse-views.firebasestorage.app",
            messagingSenderId: "291425800412",
            appId: "1:291425800412:web:babbef749be694abe4e419"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        const db = firebase.database();
        const path = location.pathname.replace(/\W+/g, "_") || "home";
        const ref = db.ref("views/" + path);

        // Increment View
        ref.transaction(current => (current || 0) + 1);

        // Display Counter
        ref.on("value", snapshot => {
            const count = snapshot.val() || 0;
            let div = document.getElementById("view-counter");
            
            if (!div) {
                div = document.createElement("div");
                div.id = "view-counter";
                // Styling
                Object.assign(div.style, {
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontFamily: "Arial, sans-serif",
                    zIndex: "9999",
                    backdropFilter: "blur(5px)", // Modern look
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease"
                });
                document.body.appendChild(div);
            }
            
            div.innerHTML = "👁️ <strong>" + count + "</strong>";
        });
    }
})();
