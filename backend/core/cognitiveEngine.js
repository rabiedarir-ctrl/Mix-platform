// ==========================================
// 🧠 Cognitive Engine - Mix Platform
// تحليل الفكر + النية + الحالة + التكيف
// ==========================================

// Dependencies
const eventBus = require('./eventBus');
const memoryService = require('./memoryService');
const energyService = require('./energyService');

// Internal State
let cognitiveState = {
    lastIntent: null,
    currentState: "neutral",
    focusLevel: 0,
    adaptationLevel: 1
};

// ==========================================
// 🔍 تحليل النية (Intent Detection)
// ==========================================
function detectIntent(input) {
    if (!input) return "idle";

    const text = input.toLowerCase();

    if (text.includes("بحث") || text.includes("search")) return "explore";
    if (text.includes("تعلم") || text.includes("learn")) return "learn";
    if (text.includes("لعب") || text.includes("game")) return "play";
    if (text.includes("شراء") || text.includes("buy")) return "transaction";
    if (text.includes("مساعدة") || text.includes("help")) return "assist";

    return "unknown";
}

// ==========================================
// 🧠 تحليل الحالة (Cognitive State)
// ==========================================
function analyzeState(userId) {
    const energy = energyService.getEnergy(userId) || 0;
    const memory = memoryService.getUserMemory(userId) || [];

    let state = "neutral";

    if (energy > 80) state = "high_focus";
    else if (energy < 30) state = "low_energy";

    if (memory.length > 50) {
        state = "experienced";
    }

    cognitiveState.currentState = state;
    return state;
}

// ==========================================
// ⚡ حساب مستوى التركيز
// ==========================================
function calculateFocus(userId) {
    const energy = energyService.getEnergy(userId) || 0;

    let focus = 0;

    if (energy > 70) focus = 0.9;
    else if (energy > 40) focus = 0.6;
    else focus = 0.3;

    cognitiveState.focusLevel = focus;
    return focus;
}

// ==========================================
// 🧬 التعلم والتكيف (Adaptive Learning)
// ==========================================
function adapt(userId, intent) {
    let history = memoryService.getUserMemory(userId) || [];

    const similarActions = history.filter(h => h.intent === intent).length;

    let adaptation = 1;

    if (similarActions > 10) adaptation = 1.5;
    if (similarActions > 30) adaptation = 2;

    cognitiveState.adaptationLevel = adaptation;

    return adaptation;
}

// ==========================================
// 🔄 تحويل الفكر إلى Event
// ==========================================
function emitCognitiveEvent(userId, data) {
    const eventPayload = {
        userId,
        intent: data.intent,
        state: data.state,
        focus: data.focus,
        adaptation: data.adaptation,
        timestamp: Date.now()
    };

    eventBus.emit('cognitive:event', eventPayload);
}

// ==========================================
// 🧠 المعالجة الرئيسية
// ==========================================
function processInput(userId, input) {
    // 1. تحليل النية
    const intent = detectIntent(input);

    // 2. تحليل الحالة
    const state = analyzeState(userId);

    // 3. حساب التركيز
    const focus = calculateFocus(userId);

    // 4. التكيف
    const adaptation = adapt(userId, intent);

    // 5. حفظ في الذاكرة
    memoryService.store(userId, {
        input,
        intent,
        state,
        focus,
        timestamp: Date.now()
    });

    // 6. إصدار حدث
    emitCognitiveEvent(userId, {
        intent,
        state,
        focus,
        adaptation
    });

    // 7. تحديث الحالة العامة
    cognitiveState.lastIntent = intent;

    return {
        intent,
        state,
        focus,
        adaptation
    };
}

// ==========================================
// 📊 واجهة عامة (Public API)
// ==========================================
module.exports = {
    processInput,
    detectIntent,
    analyzeState,
    calculateFocus,
    adapt,

    getState: () => cognitiveState
};
