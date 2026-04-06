// ===========================
// 🔹 استيراد Matrix
// ===========================
import { sendEvent } from "../../matrix.js";

// ===========================
// 🔹 كلاس التحكم باللاعب
// ===========================
export default class PlayerController {
    constructor(camera, scene, playerMesh) {
        this.camera = camera;
        this.scene = scene;
        this.player = playerMesh;

        this.velocity = { x: 0, y: 0, z: 0 };
        this.speed = 0.1;

        this.keys = {};
        this.lastUpdate = 0;

        this.initControls();
    }

    // ===========================
    // 🔹 التقاط لوحة المفاتيح
    // ===========================
    initControls() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    // ===========================
    // 🔹 تحديث الحركة
    // ===========================
    update(deltaTime) {
        let moveX = 0;
        let moveZ = 0;

        // WASD
        if (this.keys["w"]) moveZ -= 1;
        if (this.keys["s"]) moveZ += 1;
        if (this.keys["a"]) moveX -= 1;
        if (this.keys["d"]) moveX += 1;

        // حساب السرعة
        this.velocity.x = moveX * this.speed;
        this.velocity.z = moveZ * this.speed;

        // تحديث موقع اللاعب
        this.player.position.x += this.velocity.x;
        this.player.position.z += this.velocity.z;

        // تحريك الكاميرا معه
        this.camera.position.x = this.player.position.x;
        this.camera.position.z = this.player.position.z + 5;

        this.camera.lookAt(this.player.position);

        // إرسال الحركة (Realtime)
        this.syncMovement();
    }

    // ===========================
    // 🔹 إرسال الحركة إلى السيرفر
    // ===========================
    syncMovement() {
        const now = Date.now();

        // تقليل عدد الرسائل (كل 100ms)
        if (now - this.lastUpdate < 100) return;
        this.lastUpdate = now;

        sendEvent("player_move", {
            position: {
                x: this.player.position.x,
                y: this.player.position.y,
                z: this.player.position.z
            }
        });
    }

    // ===========================
    // 🔹 تحديث لاعب آخر (Multiplayer)
    // ===========================
    static updateRemotePlayer(playerMesh, data) {
        playerMesh.position.x = data.position.x;
        playerMesh.position.y = data.position.y;
        playerMesh.position.z = data.position.z;
    }
  }
