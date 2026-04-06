// ===========================
// 🔹 Three.js Main Loop
// ===========================
export default class Loop {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        // مصفوفة الوظائف التي سيتم استدعاؤها في كل إطار
        this.updateFunctions = [];

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        console.log("✅ Animation loop initialized");
    }

    // ===========================
    // 🔹 إضافة وظيفة إلى حلقة التحديث
    // ===========================
    addUpdateFunction(fn) {
        if (typeof fn === "function") {
            this.updateFunctions.push(fn);
        }
    }

    // ===========================
    // 🔹 حلقة التحديث الرئيسية
    // ===========================
    animate() {
        requestAnimationFrame(this.animate);

        // استدعاء كل الوظائف المضافة
        this.updateFunctions.forEach(fn => fn());

        // تحديث المشهد
        this.renderer.render(this.scene, this.camera);
    }
}
