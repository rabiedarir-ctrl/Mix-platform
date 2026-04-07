/**
 * memoryService.js
 * ----------------
 * إدارة الذاكرة لنظام Mix Platform
 * - حفظ البيانات
 * - استرجاع البيانات
 * - دعم الأحداث عبر Event Bus
 * - قابل للتوسع مع DB أو AI
 */

const bus = require('../core/eventBus');

// محاكاة تخزين البيانات مؤقت (يمكن استبداله بقاعدة بيانات لاحقاً)
let memoryStore = {};

/**
 * حفظ عنصر في الذاكرة
 * @param {string} key
 * @param {any} value
 */
function saveMemory(key, value) {
    if (!key) return null;

    memoryStore[key] = value;

    // إرسال حدث لحفظ البيانات
    bus.emitEvent(bus.EVENTS.MEMORY_SAVE, {
        key,
        value,
        timestamp: Date.now()
    });

    return memoryStore[key];
}

/**
 * استرجاع عنصر من الذاكرة
 * @param {string} key
 * @returns {any} value
 */
function loadMemory(key) {
    const value = memoryStore[key] || null;

    // إرسال حدث تحميل البيانات
    bus.emitEvent(bus.EVENTS.MEMORY_LOAD, {
        key,
        value,
        timestamp: Date.now()
    });

    return value;
}

/**
 * حذف عنصر من الذاكرة
 * @param {string} key
 */
function deleteMemory(key) {
    if (!memoryStore[key]) return null;

    const value = memoryStore[key];
    delete memoryStore[key];

    bus.emitEvent(bus.EVENTS.MEMORY_SAVE, {
        key,
        value: null,
        action: "delete",
        timestamp: Date.now()
    });

    return true;
}

/**
 * استرجاع كل البيانات المخزنة
 */
function getAllMemory() {
    return { ...memoryStore };
}

/**
 * إعادة ضبط الذاكرة بالكامل
 */
function resetMemory() {
    memoryStore = {};
    bus.emitEvent(bus.EVENTS.MEMORY_SAVE, {
        action: "reset",
        timestamp: Date.now()
    });
}

module.exports = {
    saveMemory,
    loadMemory,
    deleteMemory,
    getAllMemory,
    resetMemory
};
