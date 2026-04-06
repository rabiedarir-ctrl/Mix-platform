const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", (ws) => {
    console.log("🎧 New voice client connected");

    ws.on("message", (message) => {
        // إعادة إرسال الرسائل لجميع اللاعبين
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => console.log("🎧 Voice client disconnected"));
});
