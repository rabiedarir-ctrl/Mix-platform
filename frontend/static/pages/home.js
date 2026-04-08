/* ===================================================
   🔹 HOME.JS - MIX PLATFORM
   المتحكم الرئيسي للواجهة والتشغيل
=================================================== */

const Home = (() => {

    let currentUser = null;

    /* ===========================
       🔹 INIT
    =========================== */
    function init() {
        console.log("🚀 Mix Platform Starting...");

        if (!checkAuth()) return;

        loadUser();
        initUI();
        initEngine();
        initAudio();
        startLoop();
    }

    /* ===========================
       🔹 AUTH CHECK
    =========================== */
    function checkAuth() {
        const user = localStorage.getItem("currentUser");

        if (!user) {
            console.warn("❌ User not logged in");
            window.location.href = "login.html";
            return false;
        }

        currentUser = JSON.parse(user);
        return true;
    }

    /* ===========================
       🔹 LOAD USER DATA
    =========================== */
    function loadUser() {
        if (!currentUser) return;

        document.getElementById("player-name").innerText = currentUser.username || "Guest";
        document.getElementById("player-energy").innerText = currentUser.energy || 0;
        document.getElementById("player-level").innerText = currentUser.level || 1;
    }

    /* ===========================
       🔹 UI INIT
    =========================== */
    function initUI() {
        console.log("🎛️ Initializing UI...");

        // إشعارات
        window.notify = (msg) => {
            const container = document.querySelector(".notifications-container");
            if (!container) return;

            const el = document.createElement("div");
            el.className = "notification";
            el.innerText = msg;

            container.appendChild(el);

            setTimeout(() => {
                el.remove();
            }, 3000);
        };

        notify("مرحبا بك في Mix Platform 🚀");
    }

    /* ===========================
       🔹 ENGINE INIT
    =========================== */
    function initEngine() {
        console.log("🌍 Initializing Engine...");

        const container = document.getElementById("game-container");

        if (typeof Engine !== "undefined") {
            Engine.init(container);
        } else {
            console.error("❌ Engine not found");
        }

        // تحميل العالم الافتراضي
        if (typeof DefaultWorld !== "undefined") {
            DefaultWorld.load();
        }
    }

    /* ===========================
       🔹 AUDIO INIT
    =========================== */
    function initAudio() {
        console.log("🔊 Initializing Audio...");

        const btn = document.getElementById("voice-toggle");

        if (!btn) return;

        btn.addEventListener("click", () => {
            if (typeof Voice !== "undefined") {
                Voice.toggle();
                notify("🔊 تم تغيير حالة الصوت");
            }
        });
    }

    /* ===========================
       🔹 FPS LOOP
    =========================== */
    function startLoop() {
        let lastTime = performance.now();
        let fps = 0;

        function loop() {
            const now = performance.now();
            fps = Math.round(1000 / (now - lastTime));
            lastTime = now;

            const fpsEl = document.getElementById("fps-counter");
            if (fpsEl) fpsEl.innerText = fps;

            requestAnimationFrame(loop);
        }

        loop();
    }

    /* ===========================
       🔹 ERROR HANDLER
    =========================== */
    window.addEventListener("error", (e) => {
        console.error("🔥 Global Error:", e.message);
        notify("⚠️ حدث خطأ في النظام");
    });

    /* ===========================
       🔹 PUBLIC API
    =========================== */
    return {
        init
    };

})();

/* ===========================
   🔹 AUTO START
=========================== */
document.addEventListener("DOMContentLoaded", () => {
    Home.init();
});
