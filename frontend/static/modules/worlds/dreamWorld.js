// ===========================
// 🔹 Dream World Module
// ===========================

import * as THREE from "three";
import Sky from "../objects/sky.js";

export default class DreamWorld {
    constructor(scene, options = {}) {
        this.scene = scene;

        // ===========================
        // 🔹 إعداد الأرضية بأسلوب حلمي
        // ===========================
        const groundColor = options.groundColor || 0x6a0dad; // أرجواني فانتازي
        const groundSize = options.groundSize || { width: 150, height: 1, depth: 150 };

        const groundGeometry = new THREE.BoxGeometry(
            groundSize.width,
            groundSize.height,
            groundSize.depth
        );
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: groundColor,
            transparent: true,
            opacity: 0.8,
            roughness: 0.3,
            metalness: 0.2
        });

        this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        this.groundMesh.position.y = -0.5;
        this.groundMesh.receiveShadow = true;
        this.scene.add(this.groundMesh);

        // ===========================
        // 🔹 إعداد السماء الديناميكية
        // ===========================
        this.sky = new Sky(scene, { dreamMode: true });

        // ===========================
        // 🔹 إعداد الإضاءة الغامضة
        // ===========================
        this.initLighting();

        // ===========================
        // 🔹 عناصر إضافية فانتازية
        // ===========================
        this.objects = [];
        this.effects = []; // يمكن إضافة تأثيرات سحرية أو جزيئات
    }

    // ===========================
    // 🔹 إعداد الإضاءة الغامضة
    // ===========================
    initLighting() {
        // ضوء ناعم أسفل الأرضية
        const ambient = new THREE.AmbientLight(0xffaaff, 0.5);
        this.scene.add(ambient);

        // ضوء ديناميكي لتأثير حلمي
        const pointLight = new THREE.PointLight(0xddaaff, 1, 100);
        pointLight.position.set(0, 10, 0);
        pointLight.castShadow = true;
        this.scene.add(pointLight);
    }

    // ===========================
    // 🔹 إضافة عناصر للعالم
    // ===========================
    addObject(object) {
        this.objects.push(object);
        this.scene.add(object);
    }

    addEffect(effect) {
        this.effects.push(effect);
        this.scene.add(effect);
    }

    // ===========================
    // 🔹 تحديث العالم ضمن الحلقة الرسومية
    // ===========================
    update(deltaTime) {
        // تحديث السماء
        this.sky.update(deltaTime);

        // تحديث التأثيرات (جزيئات، ألوان متغيرة)
        this.effects.forEach(effect => {
            if(effect.update) effect.update(deltaTime);
        });

        // تحديث أي عناصر متحركة
        this.objects.forEach(obj => {
            if(obj.update) obj.update(deltaTime);
        });
    }
}
