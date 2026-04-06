// ===========================
// 🔹 Player Avatar Module
// ===========================

class PlayerAvatar {
    constructor(scene, options = {}) {
        this.scene = scene;

        // الخصائص الأساسية للـ Avatar
        this.color = options.color || 0x00ff00;
        this.size = options.size || { x: 1, y: 2, z: 1 };
        this.position = options.position || { x: 0, y: 0, z: 0 };

        // إنشاء الـ Mesh الأساسي للـ Avatar
        this.mesh = this.createMesh();
        this.scene.add(this.mesh);
    }

    // ===========================
    // 🔹 إنشاء Mesh للـ Avatar
    // ===========================
    createMesh() {
        const geometry = new THREE.BoxGeometry(
            this.size.x,
            this.size.y,
            this.size.z
        );

        const material = new THREE.MeshStandardMaterial({
            color: this.color,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.position.x, this.position.y, this.position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    // ===========================
    // 🔹 تحديث موقع الـ Avatar (Linked to PlayerManager)
    // ===========================
    updatePosition(position) {
        this.mesh.position.copy(position);
    }

    // ===========================
    // 🔹 تغيير مظهر الـ Avatar
    // ===========================
    setColor(hexColor) {
        this.mesh.material.color.setHex(hexColor);
    }

    setSize(size) {
        this.mesh.scale.set(size.x, size.y, size.z);
    }

    // ===========================
    // 🔹 إزالة الـ Avatar من المشهد
    // ===========================
    remove() {
        this.scene.remove(this.mesh);
    }
}

// ===========================
// 🔹 تصدير الوحدة
// ===========================
export default PlayerAvatar;
