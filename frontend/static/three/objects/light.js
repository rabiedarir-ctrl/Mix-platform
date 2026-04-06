// ===========================
// 🔹 Light Object for Mix Platform
// ===========================
import * as THREE from "three";

export default class Light {
    constructor(options = {}) {
        // 🌞 ضوء محيطي أساسي
        const ambientIntensity = options.ambientIntensity || 0.6;
        this.ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);

        // ☀️ ضوء اتجاهي يمثل الشمس
        const directionalIntensity = options.directionalIntensity || 0.8;
        this.directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
        this.directionalLight.position.set(
            options.x || 50,
            options.y || 100,
            options.z || 50
        );
        this.directionalLight.castShadow = true;

        // إعداد الظلال
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500;

        // Optional: ضوء إضافي للتعبئة
        this.fillLight = null;
        if (options.fillLight) {
            this.fillLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
        }
    }

    getLights() {
        const lights = [this.ambientLight, this.directionalLight];
        if (this.fillLight) lights.push(this.fillLight);
        return lights;
    }

    setPosition(x, y, z) {
        this.directionalLight.position.set(x, y, z);
    }

    setColor(colorHex) {
        this.directionalLight.color.setHex(colorHex);
    }

    setIntensity(intensity) {
        this.directionalLight.intensity = intensity;
    }
  }
