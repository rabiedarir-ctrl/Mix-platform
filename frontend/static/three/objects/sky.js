// ===========================
// 🔹 Sky Object for Mix Platform
// ===========================
import * as THREE from "three";

export default class Sky {
    constructor(options = {}) {
        // إنشاء السماء باستخدام Sky Shader من Three.js
        this.sky = new THREE.Mesh(
            new THREE.SphereGeometry(options.radius || 500, 32, 32),
            new THREE.MeshBasicMaterial({
                color: options.color || 0x87ceeb, // لون السماء
                side: THREE.BackSide
            })
        );

        this.sky.receiveShadow = false;
        this.sky.castShadow = false;

        // Optional: ديناميكية تغيّر اللون مع الوقت
        this.dayNightCycle = options.dayNightCycle || false;
        this.time = 0;
    }

    getObject() {
        return this.sky;
    }

    update(deltaTime = 0.016) {
        if (this.dayNightCycle) {
            this.time += deltaTime;
            const hue = (Math.sin(this.time * 0.1) * 0.5 + 0.5) * 0.6; // 0-0.6
            this.sky.material.color.setHSL(hue, 0.7, 0.6);
        }
    }
}
