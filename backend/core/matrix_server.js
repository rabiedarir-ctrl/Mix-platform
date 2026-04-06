// ===========================
// 🔹 استيراد المكتبات
// ===========================
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

// ===========================
// 🔹 إعدادات
// ===========================
const JWT_SECRET = process.env.JWT_SECRET || "mix_secret";
const WS_PORT = process.env.WS_PORT || 3001;

// ===========================
// 🔹 الحالة العامة
// ===========================
const clients = new Map(); // userId -> ws
const rooms = new Map();   // roomId -> Set(userId)

// ===========================
// 🔹 إنشاء السيرفر
// ===========================
const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`🧠 Matrix WebSocket running on port ${WS_PORT}`);

// ===========================
// 🔹 التحقق من التوكن
// ===========================
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

// ===========================
// 🔹 عند الاتصال
// ===========================
wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(req.url.replace("/?", ""));
    const token = params.get("token");

    const user = verifyToken(token);

    if (!user) {
        ws.close();
        return;
    }

    const userId = user.id;
    clients.set(userId, ws);

    console.log(`🟢 User connected: ${userId}`);

    // إعلام الآخرين
    broadcast({
        type: "user_joined",
        payload: { userId }
    }, userId);

    // ===========================
    // 🔹 استقبال الرسائل
    // ===========================
    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            handleEvent(userId, data);
        } catch (err) {
            console.error("Invalid message:", err);
        }
    });

    // ===========================
    // 🔹 عند الخروج
    // ===========================
    ws.on("close", () => {
        clients.delete(userId);

        console.log(`🔴 User disconnected: ${userId}`);

        broadcast({
            type: "user_left",
            payload: { userId }
        });
    });
});

// ===========================
// 🔹 معالجة الأحداث
// ===========================
function handleEvent(userId, data) {
    const { type, payload } = data;

    switch (type) {

        // 💬 دردشة
        case "chat_message":
            broadcast({
                type: "chat_message",
                payload: {
                    userId,
                    text: payload.text,
                    time: Date.now()
                }
            });
            break;

        // 🎮 حركة لاعب (Metaverse)
        case "player_move":
            broadcast({
                type: "player_move",
                payload: {
                    userId,
                    position: payload.position
                }
            }, userId);
            break;

        // 🌙 أحداث الأحلام
        case "dream_event":
            broadcast({
                type: "dream_event",
                payload: {
                    userId,
                    action: payload.action,
                    data: payload.data
                }
            });
            break;

        // 🔔 إشعار
        case "notification":
            sendToUser(payload.userId, {
                type: "notification",
                payload: payload.data
            });
            break;

        default:
            console.warn("Unknown event:", type);
    }
}

// ===========================
// 🔹 بث للجميع
// ===========================
function broadcast(message, excludeUserId = null) {
    const msg = JSON.stringify(message);

    clients.forEach((client, userId) => {
        if (client.readyState === WebSocket.OPEN && userId !== excludeUserId) {
            client.send(msg);
        }
    });
}

// ===========================
// 🔹 إرسال لمستخدم معين
// ===========================
function sendToUser(userId, message) {
    const client = clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
    }
}

// ===========================
// 🔹 إدارة الغرف (اختياري)
// ===========================
function joinRoom(userId, roomId) {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(userId);
}

function leaveRoom(userId, roomId) {
    if (rooms.has(roomId)) {
        rooms.get(roomId).delete(userId);
    }
      }
