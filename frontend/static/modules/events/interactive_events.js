// ===========================
// 🔹 Interactive Events Module
// ===========================

import BtcGame from "../games/btc_game.js";

// ===========================
// 🔹 إعداد اللعبة (أو أي مشهد)
const game = new BtcGame({ containerId: "game-container" });

// ===========================
// 🔹 Dashboard و Wallet
const notificationsContainer = document.getElementById("notifications");
const walletElement = document.getElementById("wallet-balance");
let walletBalance = 0;

// ===========================
// 🔹 وظيفة إشعار ديناميكي
function showNotification(message, duration = 2000) {
    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerText = message;
    notificationsContainer.appendChild(notif);

    setTimeout(() => {
        notificationsContainer.removeChild(notif);
    }, duration);
}

// ===========================
// 🔹 أحداث تفاعلية افتراضية
const interactiveEvents = [
    {
        type: "bonusCoin",
        probability: 0.005,
        reward: 0.005,
        message: "حدثت عملة إضافية! +0.005 BTC"
    },
    {
        type: "doubleScore",
        probability: 0.003,
        reward: 0, // فقط نقاط
        message: "مضاعفة النقاط! 2x Score"
    },
    {
        type: "walletBoost",
        probability: 0.002,
        reward: 0.01,
        message: "تمت زيادة رصيد المحفظة +0.01 BTC"
    }
];

// ===========================
// 🔹 وظيفة التحقق من الأحداث
function checkInteractiveEvents() {
    interactiveEvents.forEach(event => {
        if (Math.random() < event.probability) {
            // تطبيق الحدث
            if (event.reward > 0) {
                walletBalance += event.reward;
                walletElement.innerText = `Wallet: ${walletBalance.toFixed(3)} BTC`;
            }

            showNotification(event.message);

            // يمكن هنا إضافة ربط مع Metaverse Event
            console.log("🌐 Interactive Event Triggered:", event.type, event.reward);
        }
    });
}

// ===========================
// 🔹 ربط بالـ Loop
game.world.addUpdateFunction(() => {
    checkInteractiveEvents();
});
