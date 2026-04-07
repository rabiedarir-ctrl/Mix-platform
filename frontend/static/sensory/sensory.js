/**
 * Mix Platform - Sensory & Master Engine
 * نظام التواصل الاستشعاري والحسي
 * يتعامل مع إشارات الدماغ و الكومة الضوئية للجسد
 * مرتبط بمحرك العالم Dashboard و World تلقائيًا
 */

import { World } from './world.js';
import { Dashboard } from './dashboard.js';

const Sensory = (() => {

    // ===========================
    // 🔹 الحالة الداخلية
    // ===========================
    const state = {
        brainSignals: {},     // بيانات إشارات الدماغ الحالية
        lightStack: {},       // الكومة الضوئية الحالية للجسد
        listeners: [],        // مستمعو التغيرات
        connected: false
    };

    // ===========================
    // 🔹 التوصيل وتهيئة النظام
    // ===========================
    function init(config = {}) {
        state.connected = true;
        console.log("Sensory system initialized.");

        if(config.brainSource) connectBrainSource(config.brainSource);
        if(config.lightStackSource) connectLightStack(config.lightStackSource);
    }

    // ===========================
    // 🔹 الاتصال بمصدر إشارات الدماغ
    // ===========================
    function connectBrainSource(source) {
        state.brainSource = source;
        console.log("Brain source connected.");
    }

    // ===========================
    // 🔹 الاتصال بالكومة الضوئية
    // ===========================
    function connectLightStack(source) {
        state.lightStackSource = source;
        console.log("Light Stack source connected.");
    }

    // ===========================
    // 🔹 تحديث البيانات في الوقت الحقيقي
    // ===========================
    function updateBrainSignals(data) {
        state.brainSignals = { ...state.brainSignals, ...data };
        notifyListeners("brainSignals", state.brainSignals);

        // تحديث الطاقة مباشرة في World
        World.updateEnergyFromBrain(state.brainSignals);
        Dashboard.update();
    }

    function updateLightStack(data) {
        state.lightStack = { ...state.lightStack, ...data };
        notifyListeners("lightStack", state.lightStack);

        // تحديث التأثيرات الضوئية مباشرة في World
        World.updateLightEffects(state.lightStack);
        Dashboard.update();
    }

    // ===========================
    // 🔹 الاشتراكات للتغيرات
    // ===========================
    function onChange(callback) {
        if(typeof callback === "function") state.listeners.push(callback);
    }

    function notifyListeners(type, payload) {
        state.listeners.forEach(cb => {
            try { cb(type, payload); }
            catch(e){ console.error(e); }
        });
    }

    // ===========================
    // 🔹 واجهة قياس الطاقة والحالة
    // ===========================
    function getCurrentState() {
        return {
            brainSignals: state.brainSignals,
            lightStack: state.lightStack,
            connected: state.connected
        };
    }

    function isConnected() { return state.connected; }

    // ===========================
    // 🔹 تصدير الوظائف
    // ===========================
    return {
        init,
        updateBrainSignals,
        updateLightStack,
        onChange,
        getCurrentState,
        isConnected
    };

})();
