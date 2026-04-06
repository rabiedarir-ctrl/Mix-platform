// ===========================
// 🔹 Player Manager Module (Integrates Controls, Movement, Physics, Events)
// ===========================

import PlayerControls from "./controls.js";
import PlayerMovement from "./movement.js";
import PlayerPhysics from "./physics.js";

// افتراض وجود camera و scene
export default class PlayerManager {
    constructor(camera, scene, options = {}) {
        this.camera = camera;
        this.scene = scene;

        // إنشاء الأنظمة الفرعية
        this.controls = new PlayerControls(camera, scene);
        this.movement = new PlayerMovement(camera, options);
        this.physics = new PlayerPhysics(camera, scene, options);

        // عناصر للتصادم (أرضية، جدران، عملات)
        this.physics.addCollidable(options.groundMesh || { position: {x:0,y:0,z:0}, scale:{x:100,y:1,z:100} });

        // الأحداث التفاعلية
        this.coins = options.coins || []; // array of meshes
    }

    // ===========================
    // 🔹 التحقق من جمع العملات
    // ===========================
    collectCoins() {
        this.coins.forEach((coin, index) => {
            const dx = coin.position.x - this.camera.position.x;
            const dz = coin.position.z - this.camera.position.z;
            const distance = Math.sqrt(dx*dx + dz*dz);

            if (distance < 1) {
                this.scene.remove(coin);
                this.coins.splice(index, 1);

                if (this.onCoinCollected) this.onCoinCollected(coin);
            }
        });
    }

    // ===========================
    // 🔹 التحديث ضمن الحلقة الرسومية
    // ===========================
    update() {
        this.controls.update();
        this.movement.update();
        this.physics.update(this.controls.keys);
        this.collectCoins();
    }

    // ===========================
    // 🔹 إعداد Callback لجمع العملات
    // ===========================
    setCoinCallback(callback) {
        this.onCoinCollected = callback;
    }
}
