// backend/middlewares/errorHandler.advanced.js

const fs = require('fs');
const path = require('path');
const eventBus = require('../core/eventBus');

const LOGS_DIR = path.join(__dirname, '../../logs');
const ERROR_LOG_FILE = path.join(LOGS_DIR, 'errors.log');

// التأكد من وجود مجلد logs
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * تصنيف الأخطاء
 */
const classifyError = (err) => {
    if (err.isValidation) return 'Validation';
    if (err.isAuth) return 'Authentication';
    if (err.isCritical) return 'Critical';
    return 'System';
};

/**
 * Advanced Error Handler Middleware
 */
module.exports = function errorHandler(err, req, res, next) {
    const timestamp = new Date().toISOString();
    const errorType = classifyError(err);

    const errorEntry = {
        timestamp,
        type: errorType,
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        userId: req.user ? req.user.id : 'guest',
        ip: req.ip || req.connection.remoteAddress,
    };

    // تسجيل الخطأ في ملف
    fs.appendFile(ERROR_LOG_FILE, JSON.stringify(errorEntry) + '\n', (fsErr) => {
        if (fsErr) console.error('Error Logging Failed:', fsErr);
    });

    // نشر الحدث في EventBus للـ Cells Engine والـ Dashboard
    eventBus.publish('system.error', errorEntry);

    // إذا كان الخطأ حرج، يمكن إضافة إشعارات مباشرة للنظام أو المسؤول
    if (errorType === 'Critical') {
        eventBus.publish('system.alert', {
            level: 'critical',
            message: err.message,
            stack: err.stack,
            timestamp
        });
    }

    // إرسال استجابة موحدة للعميل
    res.status(err.status || 500).json({
        error: {
            type: errorType,
            message: err.message || 'Internal Server Error',
            code: err.code || 'INTERNAL_ERROR'
        }
    });
};
