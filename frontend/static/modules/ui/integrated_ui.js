// ===========================
// 🔹 Integrated UI Module for Mix Platform
// ===========================

import BtcGame from "../games/btc_game.js";
import "../voice/voice_chat.js";
import "../events/interactive_events.js";

// ===========================
// 🔹 إعداد اللعبة
// ===========================
const game = new BtcGame({ containerId: "game-container" });

// ===========================
// 🔹 Dashboard
const scoreElement = document.getElementById("score");
const walletElement = document.getElementById("wallet-balance");
let score = 0;
let walletBalance = 0;

// ===========================
// 🔹 Notifications
const notificationsContainer = document.getElementById("notifications");

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
// 🔹 جمع العملات وتحديث Dashboard و Wallet
// ===========================
function collectCoins() {
    const playerPosition = { x: 0, y: 0, z: 0 };

    game.coins.forEach((coin, index) => {
        const dx = coin.position.x - playerPosition.x;
        const dz = coin.position.z - playerPosition.z;
        const distance = Math.sqrt(dx*dx + dz*dz);

        if (distance < 1) {
            game.scene.remove(coin);
            game.coins.splice(index, 1);

            score += 1;
            scoreElement.innerText = `Score: ${score}`;

            walletBalance += 0.001;
            walletElement.innerText = `Wallet: ${walletBalance.toFixed(3)} BTC`;

            showNotification("تم جمع عملة بيتكوين! 🪙 +0.001 BTC");

            triggerMetaverseEvent("coinCollected", { score, walletBalance });
        }
    });
}

// ===========================
// 🔹 محاكاة أحداث Metaverse
// ===========================
function triggerMetaverseEvent(eventType, data) {
    console.log("🌐 Metaverse Event:", eventType, data);
}

// ===========================
// 🔹 ربط الوظائف بالـ Loop
// ===========================
game.world.addUpdateFunction(() => {
    collectCoins();
});
