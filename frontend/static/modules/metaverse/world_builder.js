// ===========================
// 🔹 استيراد Three.js
// ===========================
import * as THREE from "../../three/three.module.js";

// ===========================
// 🔹 World Builder
// ===========================
export default class WorldBuilder {
    constructor(scene) {
        this.scene = scene;
        this.objects = [];
    }

    // ===========================
    // 🔹 بناء العالم
    // ===========================
    buildWorld() {
        this.createLighting();
        this.createGround();
        this.createBuildings();
        this.createEnvironment();
    }

    // ===========================
    // 🔹 الإضاءة
    // ===========================
    createLighting() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        const directional = new THREE.DirectionalLight(0xffffff, 1);
        directional.position.set(10, 20, 10);
        directional.castShadow = true;

        this.scene.add(directional);
    }

    // ===========================
    // 🔹 الأرضية
    // ===========================
    createGround() {
        const geometry = new THREE.PlaneGeometry(200, 200);
        const material = new THREE.MeshStandardMaterial({
            color: 0x444444
        });

        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;

        this.scene.add(ground);
    }

    // ===========================
    // 🔹 المباني
    // ===========================
    createBuildings() {
        for (let i = 0; i < 20; i++) {
            const height = Math.random() * 10 + 5;

            const geometry = new THREE.BoxGeometry(5, height, 5);
            const material = new THREE.MeshStandardMaterial({
                color: Math.random() * 0xffffff
            });

            const building = new THREE.Mesh(geometry, material);

            building.position.set(
                (Math.random() - 0.5) * 100,
                height / 2,
                (Math.random() - 0.5) * 100
            );

            this.scene.add(building);
            this.objects.push(building);
        }
    }

    // ===========================
    // 🔹 البيئة (سماء + عناصر)
    // ===========================
    createEnvironment() {
        // سماء بسيطة
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);

        // عناصر إضافية (كرات طاقة مثلاً)
        for (let i = 0; i < 10; i++) {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(1, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0x00ffcc })
            );

            sphere.position.set(
                (Math.random() - 0.5) * 80,
                2,
                (Math.random() - 0.5) * 80
            );

            this.scene.add(sphere);
            this.objects.push(sphere);
        }
    }
}
