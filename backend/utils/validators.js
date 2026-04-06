const { isValidEmail, isValidPassword, randomInt } = require('./helpers');

// -------------------------------
// 🔹 التحقق من بيانات تسجيل المستخدم
function validateUserRegistration(data) {
    const { username, email, password } = data;

    if (!username || typeof username !== 'string' || username.length < 3) {
        return { valid: false, message: 'اسم المستخدم غير صالح' };
    }

    if (!email || !isValidEmail(email)) {
        return { valid: false, message: 'البريد الإلكتروني غير صالح' };
    }

    if (!password || !isValidPassword(password)) {
        return { valid: false, message: 'كلمة المرور غير صالحة' };
    }

    return { valid: true };
}

// -------------------------------
// 🔹 التحقق من بيانات تسجيل الدخول
function validateUserLogin(data) {
    const { email, password } = data;

    if (!email || !isValidEmail(email)) {
        return { valid: false, message: 'البريد الإلكتروني غير صالح' };
    }

    if (!password) {
        return { valid: false, message: 'كلمة المرور مطلوبة' };
    }

    return { valid: true };
}

// -------------------------------
// 🔹 التحقق من بيانات رسالة اجتماعية
function validateMessage(data) {
    const { senderId, receiverId, content } = data;

    if (!senderId || !receiverId) {
        return { valid: false, message: 'المُرسل أو المستقبل مفقود' };
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return { valid: false, message: 'المحتوى غير صالح' };
    }

    return { valid: true };
}

// -------------------------------
// 🔹 التحقق من تحديث طاقة المستخدم أو النقاط
function validateEnergyUpdate(data) {
    const { userId, energyChange } = data;

    if (!userId) return { valid: false, message: 'معرّف المستخدم مفقود' };
    if (typeof energyChange !== 'number') return { valid: false, message: 'تغيير الطاقة غير صالح' };

    return { valid: true };
}

// -------------------------------
// 🔹 التحقق من بيانات حلم / DreamWorld
function validateDreamWorld(data) {
    const { userId, dreamId, title, sceneData } = data;

    if (!userId || !dreamId) return { valid: false, message: 'معرّف المستخدم أو الحلم مفقود' };
    if (!title || typeof title !== 'string') return { valid: false, message: 'عنوان الحلم غير صالح' };
    if (!sceneData) return { valid: false, message: 'بيانات المشهد مفقودة' };

    return { valid: true };
}

// -------------------------------
// 🔹 التحقق من بيانات لعبة BTC
function validateGameUpdate(data) {
    const { userId, score, energyChange } = data;

    if (!userId) return { valid: false, message: 'معرّف المستخدم مفقود' };
    if (score !== undefined && typeof score !== 'number') return { valid: false, message: 'النقاط غير صالحة' };
    if (energyChange !== undefined && typeof energyChange !== 'number') return { valid: false, message: 'تغيير الطاقة غير صالح' };

    return { valid: true };
}

// -------------------------------
// 🔹 تصدير كل الفاليداتور
module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateMessage,
    validateEnergyUpdate,
    validateDreamWorld,
    validateGameUpdate
};
