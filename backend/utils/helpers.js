const crypto = require('crypto');

// -------------------------------
// 🔹 توليد UUID فريد
function generateUUID() {
    return crypto.randomUUID();
}

// -------------------------------
// 🔹 توليد رقم عشوائي بين min و max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// -------------------------------
// 🔹 التحقق من البريد الإلكتروني
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// -------------------------------
// 🔹 التحقق من كلمة المرور (طول + أحرف خاصة)
function isValidPassword(password) {
    return typeof password === 'string' && password.length >= 6;
}

// -------------------------------
// 🔹 تنسيق التاريخ بشكل ISO
function formatDateISO(date = new Date()) {
    return date.toISOString();
}

// -------------------------------
// 🔹 تحديث طاقة المستخدم
function updateEnergy(user, delta) {
    if (!user.energy) user.energy = 0;
    user.energy += delta;
    if (user.energy < 0) user.energy = 0;
    return user.energy;
}

// -------------------------------
// 🔹 إنشاء رسالة تنبيه / Notification
function createNotification(userId, message, type = "info") {
    return {
        id: generateUUID(),
        userId,
        message,
        type,
        timestamp: formatDateISO()
    };
}

// -------------------------------
// 🔹 تصدير الوظائف
module.exports = {
    generateUUID,
    randomInt,
    isValidEmail,
    isValidPassword,
    formatDateISO,
    updateEnergy,
    createNotification
};
