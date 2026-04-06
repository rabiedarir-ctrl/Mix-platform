// ===========================
// 🔹 Bitcoin Game for Mix Platform
// ===========================
import World from "../../three/world.js";
import * as THREE from "three";

export default class BtcGame {
    constructor(options = {}) {
        // ===========================
        // 🔹 إعداد العالم
        // ===========================
        this.world = new World({
            containerId: options.containerId || "game-container",
            camX: 0,
            camY: 10,
            camZ: 20,
            lookAt: new THREE.Vector3(0, 0, 0),
            skyColor: 0x87ceeb,
            dayNightCycle: true
        });

        this.scene = this.world.getScene();
        this.camera = this.world.getCamera();
        this.renderer = this.world.getRenderer();

        // ===========================
        // 🔹 إعداد اللعبة
        // ===========================
        this.coins = [];
        this.coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        this.coinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });

        // ===========================
        // 🔹 إضافة منصة البداية
        // ===========================
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(10, 1, 10),
            new THREE.MeshStandardMaterial({ color: 0x555555 })
        );
        platform.position.y = -0.5;
        this.world.addObject(platform);

        // ===========================
        // 🔹 ربط تحديث اللعبة بالـ Loop
        // ===========================
        this.world.addUpdateFunction(() => this.update());
    }

    // ===========================
    // 🔹 توليد عملة جديدة
    // ===========================
    spawnCoin() {
        const coin = new THREE.Mesh(this.coinGeometry, this.coinMaterial);
        coin.position.set(
            (Math.random() - 0.5) * 20,
            0.5,
            (Math.random() - 0.5) * 20
        );
        this.scene.add(coin);
        this.coins.push(coin);
    }

    // ===========================
    // 🔹 تحديث اللعبة في كل إطار
    // ===========================
    update() {
        // توليد عملة بشكل دوري
        if (Math.random() < 0.01 && this.coins.length < 20) {
            this.spawnCoin();
        }

        // تدوير العملات لجعلها متحركة
        this.coins.forEach(coin => {
            coin.rotation.y += 0.02;
        });
    }
}
