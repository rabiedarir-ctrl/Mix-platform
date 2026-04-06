// ===========================
// 🔹 Quests System
// ===========================
import { sendEvent, on } from "../../matrix.js";

export default class QuestsSystem {
    constructor(player) {
        this.player = player; // لاعب رئيسي
        this.quests = new Map(); // questId -> quest object
        this.activeQuests = new Set(); // questId
    }

    // ===========================
    // 🔹 إضافة مهمة
    // ===========================
    addQuest(id, description, target, reward) {
        this.quests.set(id, {
            id,
            description,
            target,     // {x, z} موقع الهدف
            reward,     // {energy, coins, item}
            completed: false
        });
    }

    // ===========================
    // 🔹 تفعيل مهمة
    // ===========================
    startQuest(id) {
        if (!this.quests.has(id)) return;
        this.activeQuests.add(id);
        console.log(`🎯 Quest Started: ${this.quests.get(id).description}`);
    }

    // ===========================
    // 🔹 تحديث حالة المهمة
    // ===========================
    update() {
        this.activeQuests.forEach(id => {
            const quest = this.quests.get(id);
            if (!quest) return;

            const dist = this.getDistance(this.player.position, quest.target);

            // تحقق الوصول
            if (!quest.completed && dist < 2) {
                this.completeQuest(id);
            }
        });
    }

    // ===========================
    // 🔹 إتمام المهمة
    // ===========================
    completeQuest(id) {
        const quest = this.quests.get(id);
        if (!quest) return;

        quest.completed = true;
        this.activeQuests.delete(id);

        // منح المكافأة
        this.player.energy += quest.reward.energy || 0;
        this.player.coins += quest.reward.coins || 0;

        console.log(`🏆 Quest Completed: ${quest.description}`);
        console.log(`💰 Reward: Energy ${quest.reward.energy || 0}, Coins ${quest.reward.coins || 0}`);

        // إرسال حدث للمزامنة
        sendEvent("quest_completed", { questId: id });
    }

    // ===========================
    // 🔹 حساب المسافة
    // ===========================
    getDistance(a, b) {
        const dx = a.x - b.x;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

    // ===========================
    // 🔹 عرض جميع المهام
    // ===========================
    listQuests() {
        return Array.from(this.quests.values());
    }
}
