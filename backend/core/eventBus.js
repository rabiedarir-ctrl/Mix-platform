/**
 * Event Bus موحد لنظام Mix Platform
 * ---------------------------------
 * - يربط كل الخدمات الداخلية (Energy, Memory, Auth, Security)
 * - يرسل التحديثات للـ WebSocket
 * - يدعم الإضافة المستقبلية لأي أحداث جديدة
 */

const EventEmitter = require('events');
const bus = new EventEmitter();

// ======================
// تعريف الأحداث الأساسية
// ======================

// الطاقة
bus.EVENTS = {
    ENERGY_UPDATE: "energy:update",     // عند تعديل الطاقة
    ENERGY_TICK: "energy:tick",         // كل مرة الكرون تعمل
    MEMORY_SAVE: "memory:save",         // عند حفظ البيانات
    MEMORY_LOAD: "memory:load",         // عند تحميل البيانات
    USER_LOGIN: "user:login",           // عند دخول المستخدم
    USER_LOGOUT: "user:logout",         // عند خروج المستخدم
    SECURITY_ALERT: "security:alert",   // عند تنبيه أمني
    ADMIN_OVERRIDE: "admin:override"    // للتحكم الكامل للملك
};

// ======================
// وظائف مساعدة للبث
// ======================

bus.emitEvent = (eventName, payload) => {
    if (!eventName) return;
    bus.emit(eventName, payload);
    console.log(`[EventBus] Event emitted: ${eventName}`, payload || "");
};

// التسجيل على الحدث
bus.onEvent = (eventName, callback) => {
    if (!eventName || typeof callback !== "function") return;
    bus.on(eventName, callback);
};

// ======================
// مثال: ربط WebSocket تلقائي
// ======================

bus.registerWebSocket = (wss) => {
    Object.values(bus.EVENTS).forEach(eventName => {
        bus.on(eventName, (data) => {
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ event: eventName, data }));
                }
            });
        });
    });
};

module.exports = bus;
