// ===========================
// 🔹 City World Module
// ===========================

import * as THREE from "three";

export default class CityWorld {
    constructor(scene, options = {}) {
        this.scene = scene;

        // ===========================
        // 🔹 الأرضية (المدينة)
        // ===========================
        this.createGround(options);

        // ===========================
        // 🔹 الطرق
        // ===========================
        this.createRoads();

        // ===========================
        // 🔹 المباني
        // ===========================
        this.buildings = [];
        this.createBuildings(options.buildingCount || 30);

        // ===========================
        // 🔹 الإضاءة
        // ===========================
        this.initLighting();

        // ===========================
        // 🔹 عناصر إضافية
        // ===========================
        this.objects = [];
    }

    // ===========================
    // 🔹 إنشاء الأرضية
    // ===========================
    createGround(options) {
        const geometry = new THREE.PlaneGeometry(300, 300);
        const material = new THREE.MeshStandardMaterial({
            color: 0x333333
        });

        this.ground = new THREE.Mesh(geometry, material);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;

        this.scene.add(this.ground);
    }

    // ===========================
    // 🔹 إنشاء الطرق
    // ===========================
    createRoads() {
        const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });

        for (let i = -100; i <= 100; i += 20) {
            const road = new THREE.Mesh(
                new THREE.PlaneGeometry(300, 4),
                roadMaterial
            );
            road.rotation.x = -Math.PI / 2;
            road.position.z = i;
            this.scene.add(road);
        }

        for (let i = -100; i <= 100; i += 20) {
            const road = new THREE.Mesh(
                new THREE.PlaneGeometry(4, 300),
                roadMaterial
            );
            road.rotation.x = -Math.PI / 2;
            road.position.x = i;
            this.scene.add(road);
        }
    }

    // ===========================
    // 🔹 إنشاء المباني
    // ===========================
    createBuildings(count) {
        for (let i = 0; i < count; i++) {
            const width = Math.random() * 5 + 2;
            const height = Math.random() * 20 + 5;
            const depth = Math.random() * 5 + 2;

            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(
                    Math.random(),
                    Math.random(),
                    Math.random()
                )
            });

            const building = new THREE.Mesh(geometry, material);

            building.position.set(
                (Math.random() - 0.5) * 200,
                height / 2,
                (Math.random() - 0.5) * 200
            );

            building.castShadow = true;
            building.receiveShadow = true;

            this.scene.add(building);
            this.buildings.push(building);
        }
    }

    // ===========================
    // 🔹 الإضاءة الحضرية
    // ===========================
    initLighting() {
        // ضوء عام
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        // ضوء الشمس
        const sun = new THREE.DirectionalLight(0xffffff, 0.8);
        sun.position.set(50, 100, 50);
        sun.castShadow = true;
        this.scene.add(sun);

        // أضواء الشوارع
        for (let i = -80; i <= 80; i += 20) {
            const light = new THREE.PointLight(0xffaa00, 0.5, 30);
            light.position.set(i, 5, 0);
            this.scene.add(light);
        }
    }

    // ===========================
    // 🔹 إضافة عنصر للعالم
    // ===========================
    addObject(object) {
        this.objects.push(object);
        this.scene.add(object);
    }

    // ===========================
    // 🔹 تحديث العالم
    // ===========================
    update(deltaTime) {
        // حركة خفيفة للمباني (تأثير حي)
        this.buildings.forEach(b => {
            b.rotation.y += 0.0005;
        });
    }
          }
