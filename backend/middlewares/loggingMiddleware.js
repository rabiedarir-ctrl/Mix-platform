// backend/middlewares/loggingMiddleware.js

const fs = require('fs');
const path = require('path');
const eventBus = require('../core/eventBus'); // ربط مع Event System
const LOGS_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOGS_DIR, 'requests.log');

// التأكد من وجود مجلد logs
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Middleware لتسجيل كل الطلبات الواردة والخارجة
 */
module.exports = function loggingMiddleware(req, res, next) {
    const startTime = Date.now();

    // تسجيل كل التفاصيل قبل إرسال الاستجابة
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: duration,
            userId: req.user ? req.user.id : 'guest',
            ip: req.ip || req.connection.remoteAddress
        };

        // كتابة الدخول في ملف
        fs.appendFile(LOG_FILE, JSON.stringify(logEntry) + '\n', (err) => {
            if (err) console.error('Logging Error:', err);
        });

        // نشر حدث لكل طلب (يمكن للخلايا أو Services الاشتراك)
        eventBus.publish('request.logged', logEntry);
    });

    next();
};
