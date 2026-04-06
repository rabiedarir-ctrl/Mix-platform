// ===========================
// 🔹 GLTF Loader Module
// ===========================

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class GLTFModelLoader {
    constructor() {
        this.loader = new GLTFLoader();
        this.cache = {}; // تخزين النماذج لتفادي إعادة التحميل
    }

    // ===========================
    // 🔹 تحميل نموذج
    // ===========================
    load(url) {
        return new Promise((resolve, reject) => {

            // إذا كان موجود في cache
            if (this.cache[url]) {
                resolve(this.clone(this.cache[url]));
                return;
            }

            this.loader.load(
                url,
                (gltf) => {
                    this.cache[url] = gltf.scene;
                    resolve(this.clone(gltf.scene));
                },
                undefined,
                (error) => {
                    console.error("GLTF Load Error:", error);
                    reject(error);
                }
            );
        });
    }

    // ===========================
    // 🔹 Clone النموذج
    // ===========================
    clone(source) {
        return source.clone(true);
    }
}

// ===========================
// 🔹 تصدير instance جاهز
// ===========================
const gltfLoader = new GLTFModelLoader();
export default gltfLoader;
