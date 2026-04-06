// ===========================
// 🔹 Mix Platform Engine
// ===========================

import * as THREE from "three";

export class Engine {
    constructor(options = {}) {

        // ===========================
        // 🔹 إعدادات
        // ===========================
        this.containerId = options.containerId || "game-container";

        // ===========================
        // 🔹 Scene
        // ===========================
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // ===========================
        // 🔹 Camera
        // ===========================
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.set(
            options.camX || 0,
            options.camY || 5,
            options.camZ || 10
        );

        // ===========================
        // 🔹 Renderer
        // ===========================
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        document.getElementById(this.containerId)
            .appendChild(this.renderer.domElement);

        // ===========================
        // 🔹 Clock
        // ===========================
        this.clock = new THREE.Clock();

        // ===========================
        // 🔹 Update Functions
        // ===========================
        this.updateFunctions = [];

        // ===========================
        // 🔹 Resize Handler
        // ===========================
        window.addEventListener("resize", () => this.onResize());

        // ===========================
        // 🔹 بدء التشغيل
        // ===========================
        this.animate();
    }

    // ===========================
    // 🔹 إضافة وظيفة للتحديث
    // ===========================
    addUpdateFunction(fn) {
        this.updateFunctions.push(fn);
    }

    // ===========================
    // 🔹 Loop
    // ===========================
    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // تنفيذ كل التحديثات
        this.updateFunctions.forEach(fn => fn(delta));

        this.renderer.render(this.scene, this.camera);
    }

    // ===========================
    // 🔹 Resize
    // ===========================
    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    // ===========================
    // 🔹 Getters
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
}
