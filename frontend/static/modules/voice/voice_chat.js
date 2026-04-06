// ===========================
// 🔹 Voice Chat Module for Mix Platform
// ===========================

// 🔹 إدارة الوصول إلى الميكروفون
let localStream = null;
const peers = {}; // تخزين اتصالات WebRTC لكل لاعب

// HTML عناصر التحكم
const voiceButton = document.getElementById("voice-toggle");

// ===========================
// 🔹 تفعيل/إيقاف الميكروفون
// ===========================
async function toggleVoiceChat() {
    if (!localStream) {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            voiceButton.innerText = "Voice On";
            initPeerConnections();
        } catch (err) {
            console.error("🔴 خطأ في الوصول للميكروفون:", err);
            alert("تعذر الوصول إلى الميكروفون");
        }
    } else {
        stopVoiceChat();
    }
}

// ===========================
// 🔹 إيقاف الميكروفون وإغلاق الاتصالات
// ===========================
function stopVoiceChat() {
    localStream.getTracks().forEach(track => track.stop());
    Object.values(peers).forEach(peer => peer.close());
    localStream = null;
    voiceButton.innerText = "Voice Off";
}

// ===========================
// 🔹 إعداد WebRTC للاتصال مع اللاعبين الآخرين
// ===========================
function initPeerConnections() {
    // مثال: الربط مع WebSocket أو Signaling Server
    const socket = new WebSocket("wss://api.mix-rd.com/voice"); // افتراضي، يمكن تغييره

    socket.onopen = () => {
        console.log("🟢 Voice signaling connected");
        socket.send(JSON.stringify({ type: "join", room: "global" }));
    };

    socket.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);

        switch (data.type) {
            case "offer":
                await handleOffer(data.offer, data.peerId, socket);
                break;
            case "answer":
                await handleAnswer(data.answer, data.peerId);
                break;
            case "ice-candidate":
                await handleIceCandidate(data.candidate, data.peerId);
                break;
            case "new-peer":
                createPeerConnection(data.peerId, socket, true);
                break;
        }
    };
}

// ===========================
// 🔹 إنشاء اتصال Peer جديد
// ===========================
function createPeerConnection(peerId, socket, isInitiator) {
    const peerConnection = new RTCPeerConnection();

    // إضافة تيار الميكروفون المحلي
    if (localStream) {
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    }

    // استقبال الصوت من الآخرين
    peerConnection.ontrack = (event) => {
        const audio = document.createElement("audio");
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        document.body.appendChild(audio);
    };

    // تبادل ICE Candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send(JSON.stringify({
                type: "ice-candidate",
                candidate: event.candidate,
                peerId
            }));
        }
    };

    peers[peerId] = peerConnection;

    // إذا كان Initiator، أنشئ Offer
    if (isInitiator) {
        peerConnection.createOffer()
            .then(offer => peerConnection.setLocalDescription(offer))
            .then(() => {
                socket.send(JSON.stringify({
                    type: "offer",
                    offer: peerConnection.localDescription,
                    peerId
                }));
            });
    }

    return peerConnection;
}

// ===========================
// 🔹 التعامل مع Offer و Answer و ICE
// ===========================
async function handleOffer(offer, peerId, socket) {
    const pc = createPeerConnection(peerId, socket, false);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.send(JSON.stringify({
        type: "answer",
        answer: answer,
        peerId
    }));
}

async function handleAnswer(answer, peerId) {
    const pc = peers[peerId];
    if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
}

async function handleIceCandidate(candidate, peerId) {
    const pc = peers[peerId];
    if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
}

// ===========================
// 🔹 ربط الزر
// ===========================
voiceButton.addEventListener("click", toggleVoiceChat);
