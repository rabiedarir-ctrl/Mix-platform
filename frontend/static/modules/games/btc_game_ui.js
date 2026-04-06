// ===========================
// 🔹 BTC Game UI for Mix Platform
// ===========================
import BtcGame from "./btc_game.js";

// ===========================
// 🔹 إعداد اللعبة
// ===========================
const game = new BtcGame({
    containerId: "game-container"
});

// ===========================
// 🔹 إعداد عناصر Dashboard
// ===========================
const scoreElement = document.getElementById("score");
let score = 0;

// ===========================
// 🔹 رصد جمع العملات (collision detection بسيط)
// ===========================
function checkCoinCollection() {
    const playerPosition = { x: 0, y: 0, z: 0 }; // مركز اللاعب، يمكن ربطه بالكاميرا لاحقًا

    game.coins.forEach((coin, index) => {
        const dx = coin.position.x - playerPosition.x;
        const dz = coin.position.z - playerPosition.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < 1) { // إذا اقترب اللاعب من العملة
            game.scene.remove(coin);
            game.coins.splice(index, 1);
            score += 1;
            scoreElement.innerText = `Score: ${score}`;

            // 🔔 إشعار جمع العملة
            showNotification("تم جمع عملة بيتكوين! 🪙");
        }
    });
}

// ===========================
// 🔹 إعداد Notifications
// ===========================
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
// 🔹 إضافة الوظائف للـ Loop
// ===========================
game.world.addUpdateFunction(() => {
    checkCoinCollection();
});
