// ===========================
// 🔹 Full Player Integration Module
// ===========================

import PlayerControls from "./controls.js";
import PlayerMovement from "./movement.js";
import PlayerPhysics from "./physics.js";
import PlayerAvatar from "./avatar.js";

export default class PlayerFull {
    constructor(camera, scene, options = {}) {
        this.camera = camera;
        this.scene = scene;

        // ===========================
        // 🔹 الأنظمة الفرعية
        // ===========================
        this.controls = new PlayerControls(camera, scene);
        this.movement = new PlayerMovement(camera, options);
        this.physics = new PlayerPhysics(camera, scene, options);
        this.avatar = new PlayerAvatar(scene, {
            color: options.color || 0x00ff00,
            size: options.size || { x: 1, y: 2, z: 1 },
            position: camera.position
        });

        // ===========================
        // 🔹 عناصر للتصادم
        // ===========================
        this.physics.addCollidable(options.groundMesh || { position: {x:0,y:0,z:0}, scale:{x:100,y:1,z:100} });

        // ===========================
        // 🔹 العملات والأحداث
        // ===========================
        this.coins = options.coins || []; // مصفوفة Mesh
        this.onCoinCollected = options.onCoinCollected || null;
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
    // 🔹 تعيين Callback لجمع العملات
    // ===========================
    setCoinCallback(callback) {
        this.onCoinCollected = callback;
    }

    // ===========================
    // 🔹 تحديث كامل للاعب ضمن حلقة الرسوميات
    // ===========================
    update() {
        this.controls.update();
        this.movement.update();
        this.physics.update(this.controls.keys);
        this.collectCoins();
        this.avatar.updatePosition(this.camera.position);
    }
                                   }
