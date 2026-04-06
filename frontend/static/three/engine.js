// ===========================
// 🔹 Mix Platform Three.js Engine
// ===========================
import SceneBuilder from "./core/scene.js";
import CameraBuilder from "./core/camera.js";
import RendererBuilder from "./core/renderer.js";
import Loop from "./core/loop.js";

export class Engine {
    constructor(options = {}) {
        // ===========================
        // 🔹 إنشاء المشهد والكاميرا
        // ===========================
        this.sceneBuilder = new SceneBuilder();
        this.scene = this.sceneBuilder.getScene();

        this.cameraBuilder = new CameraBuilder(this.scene, {
            fov: options.fov,
            x: options.camX,
            y: options.camY,
            z: options.camZ,
            lookAt: options.lookAt
        });
        this.camera = this.cameraBuilder.getCamera();

        // ===========================
        // 🔹 إنشاء الـ Renderer
        // ===========================
        this.rendererBuilder = new RendererBuilder(this.scene, this.camera, {
            containerId: options.containerId || "world-container",
            shadowMap: true,
            antialias: true
        });
        this.renderer = this.rendererBuilder.getRenderer();

        // ===========================
        // 🔹 إنشاء حلقة الرسوم المتحركة
        // ===========================
        this.loop = new Loop(this.renderer, this.scene, this.camera);

        // ===========================
        // 🔹 وظائف التحديث المخصصة
        // ===========================
        this.updateFunctions = [];
        this.loop.addUpdateFunction(() => this.update());
    }

    // ===========================
    // 🔹 إضافة كائن إلى المشهد
    // ===========================
    addObject(object) {
        this.sceneBuilder.addObject(object);
    }

    removeObject(object) {
        this.sceneBuilder.removeObject(object);
    }

    // ===========================
    // 🔹 تحديث كل شيء في كل إطار
    // ===========================
    update() {
        this.updateFunctions.forEach(fn => fn());
    }

    addUpdateFunction(fn) {
        this.updateFunctions.push(fn);
    }

    // ===========================
    // 🔹 الوصول لمكونات المحرك
    // ===========================
    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }

    getLoop() {
        return this.loop;
    }
          }
