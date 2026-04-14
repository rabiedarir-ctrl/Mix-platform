// ===========================
// 🔹 World Engine Integration
// ===========================

import * as THREE from "../three/engine.js";
import EventsSystem from "../modules/metaverse/events_system.js";
import QuestsSystem from "../modules/metaverse/quests_system.js";
import VoiceChat from "../voice_chat.js";

// ===========================
// 🔹 إعداد اللاعب والمحفظة
// ===========================
const player = {
    name: "Player1",
    position: new THREE.Vector3(0, 0, 0),
    energy: 100,
};

const wallet = {
    coins: 500,
    addTransaction(tx) { this.coins += tx.coins || 0; }
};

// ===========================
// 🔹 إعداد العالم ثلاثي الأبعاد
// ===========================
const worldEngine = new THREE.Engine({
    containerId: "world-container",
    player
});

// ===========================
// 🔹 إعداد الأنظمة المدمجة
// ===========================
const events = new EventsSystem(player, worldEngine);
const quests = new QuestsSystem(player, wallet);
const voice = new VoiceChat(player, "ws://localhost:8081");

// ===========================
// 🔹 تهيئة الصوت والمحادثة
// ===========================
async function initVoice() {
    await voice.init();
}
initVoice();

// ===========================
// 🔹 مثال على Quest و Event
// ===========================
quests.addQuest({
    id: "first_mission",
    description: "ابدأ مهمتك الأولى",
    completed: false,
    reward: { coins: 100, energy: 20 }
});

events.addEvent(
    "mysterious_box",
    "فتح الصندوق الغامض",
    (player) => {
        const dx = player.position.x - 15;
        const dz = player.position.z - 20;
        return Math.sqrt(dx*dx + dz*dz) < 2;
    },
    (player) => {
        console.log("🎁 لقد وجدت صندوقًا غامضًا!");
        wallet.addTransaction({ type: "event_reward", coins: 100, energy: 20 });
        voice.sendVoice("../audio/event_mysterious_box.mp3");
    }
);

// ===========================
// 🔹 حلقة التحديث الرئيسية
// ===========================
worldEngine.onUpdate(() => {
    // تحديث موقع اللاعب
    player.position.copy(worldEngine.player.position);

    // تحديث الأحداث والمهام
    events.update();
    quests.update();
});

// ===========================
// 🔹 وظائف مساعدة للـ UI
// ===========================
window.getPlayerStatus = () => ({
    energy: player.energy,
    coins: wallet.coins,
    activeQuests: quests.listQuests().filter(q => !q.completed),
    activeEvents: events.listEvents().filter(e => !e.executed)
});

console.log("🌐 World Engine initialized with Events, Quests, Voice Chat & Wallet");
