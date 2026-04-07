/**
 * Mix Platform - Master Engine
 * تشغيل كل خدمات المنصة تلقائياً
 */

import { Sensory } from './sensory.js';
import { World } from './world.js';
import { Dashboard } from './dashboard.js';

const MasterEngine = (() => {
    let running = false;

    function init() {
        // تهيئة Sensory
        Sensory.init({
            brainSource: window.brainDevice,
            lightStackSource: window.lightDevice
        });

        // تهيئة العالم و Dashboard
        World.init({ defaultEnergy: 0 });
        Dashboard.init();

        // الاشتراك مباشرة لتحديثات Sensory
        Sensory.onChange((type, data) => {
            if(type === "brainSignals") World.updateEnergyFromBrain(data);
            if(type === "lightStack") World.updateLightEffects(data);
            Dashboard.update();
        });

        running = true;
        animate();
        console.log("Master Engine initialized and running.");
    }

    function animate() {
        if(!running) return;
        requestAnimationFrame(animate);

        World.update();
        World.render();
        Dashboard.update();
    }

    function stop() {
        running = false;
        console.log("Master Engine stopped.");
    }

    return {
        init,
        stop
    };
})();
