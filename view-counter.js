(function() {
    // Firebase Libraries (Dynamically Loaded for Speed)
    var firebaseVersion = "10.12.0";
    var appScript = "https://www.gstatic.com/firebasejs/" + firebaseVersion + "/firebase-app-compat.js";
    var dbScript = "https://www.gstatic.com/firebasejs/" + firebaseVersion + "/firebase-database-compat.js";

    function loadScript(src, callback) {
        var script = document.createElement("script");
        script.src = src;
        script.async = true; // Non-blocking load
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Load Firebase sequentially without delay
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

        // Display Counter (Exact Original Design)
        ref.on("value", snapshot => {
            const count = snapshot.val() || 0;
            let div = document.getElementById("view-counter");
            
            if (!div) {
                div = document.createElement("div");
                div.id = "view-counter";
                
                // --- Original Style Start ---
                div.style.position = "fixed";
                div.style.bottom = "20px";
                div.style.right = "20px";
                div.style.background = "black"; // Original Black
                div.style.color = "white";      // Original White
                div.style.padding = "8px 14px";
                div.style.borderRadius = "20px";
                div.style.fontSize = "14px";
                div.style.fontFamily = "Arial,sans-serif";
                div.style.zIndex = "9999";
                // --- Original Style End ---
                
                document.body.appendChild(div);
            }
            
            div.innerHTML = "👁️ <strong>" + count + "</strong>";
        });
    }
})();
