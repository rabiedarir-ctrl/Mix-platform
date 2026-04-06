// ===========================
// 🔹 Three.js Camera Setup
// ===========================
import * as THREE from "three";

export default class CameraBuilder {
    constructor(scene, options = {}) {
        const fov = options.fov || 75;
        const aspect = options.aspect || window.innerWidth / window.innerHeight;
        const near = options.near || 0.1;
        const far = options.far || 1000;

        // إنشاء كاميرا Perspective
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        // وضع الكاميرا الأولية
        this.camera.position.set(
            options.x || 0,
            options.y || 5,
            options.z || 10
        );

        // استهداف نقطة في المشهد (مثلاً مركز العالم)
        if (options.lookAt) {
            this.camera.lookAt(options.lookAt);
        } else {
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }

        // تحديث الحجم عند تغيير حجم النافذة
        window.addEventListener("resize", () => this.onWindowResize(), false);

        console.log("✅ Camera initialized");
    }

    getCamera() {
        return this.camera;
    }

    // ===========================
    // 🔹 تحديث الكاميرا عند تغيير حجم النافذة
    // ===========================
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    setPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }

    lookAtVector(vector) {
        this.camera.lookAt(vector);
    }
          }
