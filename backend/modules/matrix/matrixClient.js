const { MatrixClient, SimpleFsStorageProvider, AutojoinRoomsMixin } = require("matrix-bot-sdk");
const EventEmitter = require('events');
const { startGame, stopGame } = require('../games/btc_game');
const AIAlerts = require('../ai/ai_alerts').AIAlerts;

// -------------------------------
// 🔹 إعدادات الاتصال بـ Matrix
const homeserverUrl = process.env.MATRIX_HOMESERVER || "https://matrix.org";
const accessToken = process.env.MATRIX_ACCESS_TOKEN || "";
const storage = new SimpleFsStorageProvider("matrix_storage.json");

// -------------------------------
// 🔹 تهيئة العميل
const client = new MatrixClient(homeserverUrl, accessToken, storage);
AutojoinRoomsMixin.setupOnClient(client);

// -------------------------------
// 🔹 Event Emitter داخلي للأحداث التفاعلية
class MatrixEvents extends EventEmitter {}
const matrixEvents = new MatrixEvents();

// -------------------------------
// 🔹 تهيئة AI Alerts
const aiAlerts = new AIAlerts();

// -------------------------------
// 🔹 إرسال رسالة نصية
async function sendMessage(roomId, message) {
    await client.sendMessage(roomId, {
        "msgtype": "m.text",
        "body": message
    });
}

// -------------------------------
// 🔹 إرسال إشعار ذكي عبر AI Alerts
function sendAlert(userId, message) {
    return aiAlerts.send_alert(userId, message, "matrix");
}

// -------------------------------
// 🔹 تشغيل لعبة لمستخدم معين
function playBTCGame(playerId) {
    startGame(playerId);
    sendAlert(playerId, "تم بدء لعبة BTC!");
}

// -------------------------------
// 🔹 إيقاف اللعبة
function stopBTCGame(playerId) {
    stopGame();
    sendAlert(playerId, "تم إيقاف لعبة BTC!");
}

// -------------------------------
// 🔹 استقبال الرسائل والأوامر من غرف Matrix
client.on("room.message", async (roomId, event) => {
    if (!event["content"]) return;
    const body = event["content"]["body"];
    const sender = event["sender"];

    // أمر لعبة BTC
    if (body === "!btc_start") {
        playBTCGame(sender);
        sendMessage(roomId, "بدأت لعبة BTC 🎮");
    } else if (body === "!btc_stop") {
        stopBTCGame(sender);
        sendMessage(roomId, "تم إيقاف لعبة BTC 🛑");
    } 
    // أوامر دردشة صوتية أو تفاعلية يمكن إضافتها هنا
    else if (body.startsWith("!alert ")) {
        const alertMsg = body.replace("!alert ", "");
        sendAlert(sender, alertMsg);
        sendMessage(roomId, `تم إرسال التنبيه: ${alertMsg}`);
    }

    // إطلاق أي حدث تفاعلي داخلي
    matrixEvents.emit("message_received", { roomId, sender, body });
});

// -------------------------------
// 🔹 التكامل مع Metaverse
matrixEvents.on("3d_event", (eventData) => {
    // مثال: تحريك كائن داخل عالم ثلاثي الأبعاد بناءً على حدث من Matrix
    console.log("Metaverse event triggered:", eventData);
});

// -------------------------------
// 🔹 بدء العميل
async function startMatrixClient() {
    await client.start();
    console.log("Matrix Client started and listening for events...");
}

// -------------------------------
// 🔹 التصدير
module.exports = {
    client,
    matrixEvents,
    sendMessage,
    sendAlert,
    playBTCGame,
    stopBTCGame,
    startMatrixClient
};
