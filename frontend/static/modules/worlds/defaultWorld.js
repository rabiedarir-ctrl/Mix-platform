// ===========================
// 🔹 Default World Module
// ===========================

import * as THREE from "three";
import Sky from "../objects/sky.js";

export default class DefaultWorld {
    constructor(scene, options = {}) {
        this.scene = scene;

        // ===========================
        // 🔹 إعداد الأرضية
        // ===========================
        const groundColor = options.groundColor || 0x228B22;
        const groundSize = options.groundSize || { width: 100, height: 1, depth: 100 };

        const groundGeometry = new THREE.BoxGeometry(
            groundSize.width,
            groundSize.height,
            groundSize.depth
        );
        const groundMaterial = new THREE.MeshStandardMaterial({ color: groundColor });
        this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        this.groundMesh.position.y = -0.5; // لضمان سطح الأرضية عند y=0
        this.groundMesh.receiveShadow = true;
        this.scene.add(this.groundMesh);

        // ===========================
        // 🔹 إعداد السماء
        // ===========================
        this.sky = new Sky(scene);

        // ===========================
        // 🔹 إعداد الإضاءة
        // ===========================
        this.initLighting();

        // ===========================
        // 🔹 عناصر إضافية في العالم
        // ===========================
        this.objects = [];
    }

    // ===========================
    // 🔹 إعداد الإضاءة
    // ===========================
    initLighting() {
        // ضوء الشمس
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // ضوء عام (Ambient)
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);
    }

    // ===========================
    // 🔹 إضافة عناصر للعالم
    // ===========================
    addObject(object) {
        this.objects.push(object);
        this.scene.add(object);
    }

    // ===========================
    // 🔹 تحديث عناصر العالم (يمكن استخدامه لاحقًا)
    // ===========================
    update(deltaTime) {
        this.sky.update(deltaTime);
        // يمكن تحديث أي عناصر متحركة هنا
    }
                                               }
