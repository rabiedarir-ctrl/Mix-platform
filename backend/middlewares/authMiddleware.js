// backend/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const eventBus = require('../core/eventBus'); // لربط الأحداث مع النظام
const UserModel = require('../models/userModel'); // نموذج المستخدم

// استبدل هذا بمفتاحك السري الحقيقي أو استخدم process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'mixplatform-secret';

module.exports = async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // التحقق من وجود المستخدم في قاعدة البيانات
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        // إضافة المستخدم للـ request ليكون متاح في كل ملفات النظام
        req.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            energy: user.energy || 0
        };

        // نشر حدث دخول المستخدم لنظام Cells / Energy
        eventBus.publish('user.authenticated', { userId: user.id });

        next(); // السماح بالمرور للـ controller
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal Server Error in Auth Middleware' });
    }
};
