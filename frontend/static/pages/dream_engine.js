// 🔹 WebSocket للربط بالـ Backend
const dreamSocket = new WebSocket("ws://const API_BASE = "https://اسم-الخادم.onrender.com/api/dreams");

dreamSocket.onopen = () => {
    console.log("Connected to Dream Engine backend");
};

dreamSocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log("Dream data received:", data);
        updateDreamWorld(data);
    } catch (err) {
        console.error("Failed to parse dream data:", err);
    }
};

dreamSocket.onerror = (err) => {
    console.error("Dream Engine WebSocket error:", err);
};

createNPCMesh() {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

    const npc = new THREE.Mesh(geometry, material);
    npc.position.set(5, 1, 5);

    this.scene.add(npc);
    return npc;
}

// -------------------------------
// 🔹 تحديث عالم الأحلام ثلاثي الأبعاد
function updateDreamWorld(dreamData) {
    // مثال: تحويل كلمات رئيسية إلى كائنات
    if (!dreamData.keywords) return;

    dreamData.keywords.forEach((keyword, index) => {
        // توليد موقع عشوائي لكل كائن في العالم
        const x = Math.random() * 100 - 50;
        const y = Math.random() * 20 + 1;
        const z = Math.random() * 100 - 50;

        // ربط الكائن بالكلمة
        createDreamObject(keyword, { x, y, z }, index);
    });

    // يمكن إضافة مؤثرات صوتية أو ضوئية هنا
}

// -------------------------------
// 🔹 إنشاء كائن في DreamWorld
function createDreamObject(name, position, id) {
    if (typeof window.DreamWorld === "undefined") {
        console.warn("DreamWorld not initialized");
        return;
    }

    const object = window.DreamWorld.createObject({
        name: name,
        id: `dream_obj_${id}`,
        position: position,
        color: 0x66ccff,
        size: 2
    });

    // إضافة حركة بسيطة للكائن
    object.rotationSpeed = Math.random() * 0.02;

    window.DreamWorld.addObject(object);
}



// -------------------------------
// 🔹 تحديث حركة الكائنات
function animateDreamObjects() {
    if (typeof window.DreamWorld === "undefined") return;
    window.DreamWorld.objects.forEach(obj => {
        obj.rotation.y += obj.rotationSpeed || 0.01;
    });
    requestAnimationFrame(animateDreamObjects);
}

// -------------------------------
// 🔹 بدء المحرك
function startDreamEngine() {
    console.log("Dream Engine started");
    animateDreamObjects();
}

// -------------------------------
// 🔹 التصدير
export { startDreamEngine, updateDreamWorld, createDreamObject };
