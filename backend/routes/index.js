// backend/routes/index.js

const express = require('express');
const router = express.Router();

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// Modules
const walletRoutes = require('../modules/wallet/walletRoutes');
// لاحقًا يمكن إضافة المزيد من الموديولات:
// const gameRoutes = require('../modules/games/gameRoutes');
// const socialRoutes = require('../modules/social/socialRoutes');

// Health Check Endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: Date.now() });
});

// استخدام Middleware للتحقق من المستخدم لكل المسارات الحساسة
router.use('/wallet', authMiddleware, walletRoutes);

// مثال: إضافة موديولات أخرى
// router.use('/games', authMiddleware, gameRoutes);
// router.use('/social', authMiddleware, socialRoutes);

module.exports = router;
