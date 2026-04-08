// ==========================================
// ⚡ Adaptive System - Mix Platform
// نظام التكيف الذكي (تعلم + تطوير + تخصيص)
// ==========================================

const eventBus = require('./eventBus');
const memoryService = require('./memoryService');
const energyService = require('./energyService');

// ==========================================
// 🧬 نموذج المستخدم (Dynamic Profile)
// ==========================================
function getUserProfile(userId) {
    let profile = memoryService.get(userId, 'profile');

    if (!profile) {
        profile = {
            level: 1,
            experience: 0,
            preferences: {},
            behaviorScore: 0,
            evolutionStage: "beginner"
        };

        memoryService.set(userId, 'profile', profile);
    }

    return profile;
}

// ==========================================
// 📊 تحديث الخبرة
// ==========================================
function updateExperience(userId, action) {
    let profile = getUserProfile(userId);

    let expGain = 1;

    if (action.focus > 0.8) expGain += 2;
    if (action.adaptation > 1.5) expGain += 2;

    profile.experience += expGain;

    // Level Up
    if (profile.experience > profile.level * 50) {
        profile.level += 1;
        profile.experience = 0;

        eventBus.emit('user:levelUp', {
            userId,
            level: profile.level
        });
    }

    memoryService.set(userId, 'profile', profile);
}

// ==========================================
// 🧠 تحليل السلوك
// ==========================================
function analyzeBehavior(userId) {
    const history = memoryService.getUserMemory(userId) || [];

    let score = 0;

    history.slice(-20).forEach(entry => {
        if (entry.intent === 'learn') score += 2;
        if (entry.intent === 'explore') score += 1;
        if (entry.intent === 'idle') score -= 1;
    });

    return score;
}

// ==========================================
// 🎯 تحديد المرحلة التطورية
// ==========================================
function updateEvolutionStage(userId) {
    let profile = getUserProfile(userId);

    if (profile.level > 10) profile.evolutionStage = "expert";
    else if (profile.level > 5) profile.evolutionStage = "advanced";
    else profile.evolutionStage = "beginner";

    memoryService.set(userId, 'profile', profile);
}

// ==========================================
// ⚡ تعديل سلوك النظام
// ==========================================
function adaptSystemBehavior(userId, action) {
    const profile = getUserProfile(userId);
    const energy = energyService.getEnergy(userId) || 0;

    let behavior = {
        responseSpeed: 1,
        difficulty: 1,
        assistanceLevel: 1
    };

    // حسب المستوى
    if (profile.level > 5) {
        behavior.difficulty = 1.5;
        behavior.assistanceLevel = 0.7;
    }

    // حسب الطاقة
    if (energy < 30) {
        behavior.responseSpeed = 0.7;
        behavior.assistanceLevel = 1.5;
    }

    // حسب النية
    if (action.command === 'system:learn') {
        behavior.difficulty += 0.5;
    }

    return behavior;
}

// ==========================================
// 🧬 تخصيص التجربة
// ==========================================
function personalize(userId, action) {
    let profile = getUserProfile(userId);

    if (!profile.preferences[action.command]) {
        profile.preferences[action.command] = 0;
    }

    profile.preferences[action.command] += 1;

    memoryService.set(userId, 'profile', profile);
}

// ==========================================
// 🔄 المعالجة الكاملة
// ==========================================
function processAdaptation(userId, action) {
    // 1. تحديث الخبرة
    updateExperience(userId, action);

    // 2. تحليل السلوك
    const behaviorScore = analyzeBehavior(userId);

    let profile = getUserProfile(userId);
    profile.behaviorScore = behaviorScore;

    // 3. تحديث المرحلة
    updateEvolutionStage(userId);

    // 4. تخصيص
    personalize(userId, action);

    // 5. تعديل سلوك النظام
    const behavior = adaptSystemBehavior(userId, action);

    // 6. إرسال حدث
    eventBus.emit('system:adapted', {
        userId,
        behavior,
        profile
    });

    return {
        behavior,
        profile
    };
}

// ==========================================
// 📡 ربط مع Signal Translator
// ==========================================
function bindToSignalTranslator() {
    eventBus.on('signal:translated', (action) => {
        processAdaptation(action.userId, action);
    });
}

// ==========================================
// 📊 API
// ==========================================
module.exports = {
    processAdaptation,
    getUserProfile,
    updateExperience,
    analyzeBehavior,
    updateEvolutionStage,
    adaptSystemBehavior,
    personalize,
    bindToSignalTranslator
};
