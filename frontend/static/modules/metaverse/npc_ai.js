// ===========================
// 🔹 استيراد Matrix
// ===========================
import { sendEvent } from "../../matrix.js";

// ===========================
// 🔹 NPC AI System
// ===========================
export default class NPCAI {
    constructor(scene) {
        this.scene = scene;
        this.npcs = new Map(); // npcId -> npc object
    }

    // ===========================
    // 🔹 إنشاء NPC
    // ===========================
    createNPC(id, mesh) {
        const npc = {
            id,
            mesh,
            state: "idle",
            target: null,
            speed: 0.02
        };

        this.npcs.set(id, npc);
        this.scene.add(mesh);

        return npc;
    }

    // ===========================
    // 🔹 تحديث جميع NPCs
    // ===========================
    update(delta, playerPosition) {
        this.npcs.forEach(npc => {
            this.updateBehavior(npc, playerPosition);
        });
    }

    // ===========================
    // 🔹 منطق الذكاء
    // ===========================
    updateBehavior(npc, playerPosition) {
        const dist = this.getDistance(npc.mesh.position, playerPosition);

        // إذا اللاعب قريب → تفاعل
        if (dist < 5) {
            npc.state = "interact";
            this.lookAtPlayer(npc, playerPosition);

            // إرسال حدث
            sendEvent("npc_interaction", {
                npcId: npc.id
            });

        } 
        // إذا بعيد → تجول
        else {
            npc.state = "wander";
            this.wander(npc);
        }
    }

    // ===========================
    // 🔹 حركة عشوائية
    // ===========================
    wander(npc) {
        if (!npc.target || this.getDistance(npc.mesh.position, npc.target) < 1) {
            npc.target = {
                x: (Math.random() - 0.5) * 50,
                z: (Math.random() - 0.5) * 50
            };
        }

        const dx = npc.target.x - npc.mesh.position.x;
        const dz = npc.target.z - npc.mesh.position.z;

        npc.mesh.position.x += dx * npc.speed;
        npc.mesh.position.z += dz * npc.speed;
    }

    // ===========================
    // 🔹 النظر للاعب
    // ===========================
    lookAtPlayer(npc, playerPosition) {
        npc.mesh.lookAt(
            playerPosition.x,
            npc.mesh.position.y,
            playerPosition.z
        );
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
    // 🔹 محادثة NPC
    // ===========================
    talk(npcId, message) {
        const responses = [
            "مرحبا بك 👋",
            "هذا العالم يتغير حسب طاقتك 🌌",
            "هل جربت Dream Engine؟ 🌙",
            "كل شيء هنا حي..."
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }
          }
