// ===========================
// 🔹 Player Controls Module
// ===========================

class PlayerControls {
    constructor(camera, scene, speed = 0.1) {
        this.camera = camera;
        this.scene = scene;
        this.speed = speed;

        // حالة مفاتيح الحركة
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        this.initListeners();
    }

    // ===========================
    // 🔹 الاستماع لمفاتيح الحركة
    // ===========================
    initListeners() {
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
    }

    onKeyDown(e) {
        switch(e.code) {
            case "KeyW": this.keys.forward = true; break;
            case "KeyS": this.keys.backward = true; break;
            case "KeyA": this.keys.left = true; break;
            case "KeyD": this.keys.right = true; break;
        }
    }

    onKeyUp(e) {
        switch(e.code) {
            case "KeyW": this.keys.forward = false; break;
            case "KeyS": this.keys.backward = false; break;
            case "KeyA": this.keys.left = false; break;
            case "KeyD": this.keys.right = false; break;
        }
    }

    // ===========================
    // 🔹 تحديث موقع اللاعب
    // ===========================
    update() {
        if (this.keys.forward) this.camera.position.z -= this.speed;
        if (this.keys.backward) this.camera.position.z += this.speed;
        if (this.keys.left) this.camera.position.x -= this.speed;
        if (this.keys.right) this.camera.position.x += this.speed;
    }
}

// ===========================
// 🔹 تصدير الوحدة
// ===========================
export default PlayerControls;
