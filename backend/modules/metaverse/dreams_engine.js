const WebSocket = require('ws');
const DreamParser = require('./dream_parser').DreamParser;
const { matrixEvents } = require('../matrix/matrixClient');
const dreamParser = new DreamParser();

// -------------------------------
// 🔹 إعداد WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
console.log("Dream Engine Backend WebSocket running on ws://localhost:8080");

// -------------------------------
// 🔹 تخزين العملاء المتصلين
let clients = [];

// -------------------------------
// 🔹 عند اتصال عميل Frontend
wss.on('connection', (ws) => {
    console.log("Frontend connected to Dream Engine");
    clients.push(ws);

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log("Frontend disconnected");
    });

    ws.on('message', (message) => {
        console.log("Message from Frontend:", message);
    });
});

// -------------------------------
// 🔹 إرسال بيانات الأحلام لكل العملاء
function broadcastDream(dreamData) {
    const jsonData = JSON.stringify(dreamData, null, 2);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(jsonData);
        }
    });
}

// -------------------------------
// 🔹 معالجة حلم جديد من dream_ai.py
function processDream(dreamText, userId) {
    const parsedDream = dreamParser.parse_dream(dreamText);

    // إرسال تنبيه AI للمستخدم عبر Matrix
    matrixEvents.emit('dream_alert', {
        userId: userId,
        message: "تم تحليل حلمك بنجاح!"
    });

    sendEvent("dream_event", {
    action: "npc_spawn",
    data: { npcId: "npc_1" }
});
    
    // بث البيانات للـ Frontend
    broadcastDream(parsedDream);

    console.log("Dream processed and sent:", parsedDream);
}

// -------------------------------
// 🔹 التصدير
module.exports = {
    processDream,
    broadcastDream
};
