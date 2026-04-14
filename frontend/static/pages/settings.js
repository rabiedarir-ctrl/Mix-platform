/**
 * Mix Platform - إعدادات عامة
 * ملف مركزي لإعدادات المشروع
 */

const Settings = {
    // ===========================
    // 🔹 واجهة المستخدم
    // ===========================
    ui: {
        theme: "dark",              // dark / light
        primaryColor: "#00ffcc",
        secondaryColor: "#222222",
        fontFamily: "Segoe UI, Arial, sans-serif",
        fontSize: "14px",
        notifications: {
            enabled: true,
            maxVisible: 5,
            duration: 4000 // milliseconds
        }
    },

    // ===========================
    // 🔹 الصوت والموسيقى
    // ===========================
    audio: {
        masterVolume: 0.8,
        musicVolume: 0.5,
        effectsVolume: 0.7,
        ambientTrack: "assets/sounds/ambient.mp3",
        dreamTrack: "assets/sounds/dream.mp3",
        enableAudio: true
    },

    // ===========================
    // 🔹 الشبكة و API
    // ===========================
    network: {
        apiBase: "https://api.mix-rd.com",
        timeout: 10000, // milliseconds
        retryAttempts: 2
    },

    // ===========================
    // 🔹 العالم والمحرك
    // ===========================
    world: {
        defaultWorld: "defaultWorld.json",
        enablePhysics: true,
        maxObjects: 500,
        drawDistance: 1000
    },

    // ===========================
    // 🔹 الأداء والرسوميات
    // ===========================
    graphics: {
        resolution: "auto",      // auto / 1080p / 720p
        antiAliasing: true,
        shadows: true,
        postProcessing: true,
        fpsLimit: 60
    },

    // ===========================
    // 🔹 التخزين المحلي
    // ===========================
    storage: {
        autoSave: true,
        saveInterval: 30000, // milliseconds
        cacheEnabled: true,
        cacheFolder: "storage/cache/.."
    },

    // ===========================
    // 🔹 المستخدم والمصادقة
    // ===========================
    user: {
        defaultEnergy: 0,
        defaultLevel: 1,
        guestUser: {
            username: "Guest",
            role: "guest"
        }
    },

    // ===========================
    // 🔹 طرق مساعدة عامة
    // ===========================
    helpers: {
        log: (message, level = "info") => {
            if(level === "error") console.error(`[ERROR] ${message}`);
            else if(level === "warn") console.warn(`[WARN] ${message}`);
            else console.log(`[INFO] ${message}`);
        },

        notify: (msg, type = "info") => {
            if(!Settings.ui.notifications.enabled) return;
            const container = document.getElementById("home-notifications");
            if(!container) return;
            const notif = document.createElement("div");
            notif.className = "notification";
            notif.innerText = msg;
            container.appendChild(notif);

            setTimeout(() => notif.remove(), Settings.ui.notifications.duration);
        }
    }
};

// تصدير للإستخدام في أي ملف JS
if(typeof module !== "undefined") {
    module.exports = Settings;
  }
