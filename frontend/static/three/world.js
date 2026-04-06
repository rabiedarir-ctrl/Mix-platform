// ===========================
// 🔹 World Setup for Mix Platform
// ===========================
import { Engine } from "./engine.js";
import Sky from "./objects/sky.js";
import Ground from "./objects/ground.js";
import Light from "./objects/light.js";

export default class World {
    constructor(options = {}) {
        // ===========================
        // 🔹 إنشاء المحرك
        // ===========================
        this.engine = new Engine({
            camX: options.camX || 0,
            camY: options.camY || 5,
            camZ: options.camZ || 15,
            lookAt: options.lookAt || undefined,
            containerId: options.containerId || "world-container",
        });

        // ===========================
        // 🔹 إضافة السماء
        // ===========================
        this.sky = new Sky({
            color: options.skyColor || 0x87ceeb,
            dayNightCycle: options.dayNightCycle || true
        });
        this.engine.addObject(this.sky.getObject());
        this.engine.addUpdateFunction((deltaTime) => this.sky.update(deltaTime));

        // ===========================
        // 🔹 إضافة الأرض
        // ===========================
        this.ground = new Ground({
            width: options.groundWidth || 1000,
            height: options.groundHeight || 1000,
            color: options.groundColor || 0x228B22,
            texture: options.groundTexture || null
        });
        this.engine.addObject(this.ground.getObject());

        // ===========================
        // 🔹 إضافة الإضاءة
        // ===========================
        this.light = new Light({
            ambientIntensity: options.ambientIntensity || 0.6,
            directionalIntensity: options.directionalIntensity || 0.8,
            fillLight: options.fillLight || true
        });
        this.light.getLights().forEach(lightObj => this.engine.addObject(lightObj));

        console.log("🌐 World initialized");
    }

    getEngine() {
        return this.engine;
    }

    getScene() {
        return this.engine.getScene();
    }

    getCamera() {
        return this.engine.getCamera();
    }

    getRenderer() {
        return this.engine.getRenderer();
    }

    addObject(obj) {
        this.engine.addObject(obj);
    }

    removeObject(obj) {
        this.engine.removeObject(obj);
    }

    addUpdateFunction(fn) {
        this.engine.addUpdateFunction(fn);
    }
          }
