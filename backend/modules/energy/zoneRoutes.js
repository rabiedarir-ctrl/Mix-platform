// backend/modules/energy/zoneRoutes.js

const express = require('express');
const router = express.Router();
const zoneService = require('./zoneService');

// Middleware للتحقق من المستخدم (مثال JWT أو session)
function authMiddleware(req, res, next) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// تفعيل منطقة محددة
router.post('/activate/:zoneId', authMiddleware, (req, res) => {
    const { zoneId } = req.params;
    const { value, actionType } = req.body;

    if (!zoneService.zones[zoneId]) {
        return res.status(400).json({ error: 'Invalid zone ID' });
    }

    if (!value || value <= 0) {
        return res.status(400).json({ error: 'Invalid activation value' });
    }

    const zone = zoneService.activateZone(zoneId, value, actionType || 'direct');

    res.json({
        message: `Zone ${zoneId} activated successfully`,
        zone
    });
});

// استرجاع حالة منطقة محددة
router.get('/:zoneId', authMiddleware, (req, res) => {
    const { zoneId } = req.params;

    const zone = zoneService.getZoneStatus(zoneId);
    if (!zone) {
        return res.status(400).json({ error: 'Invalid zone ID' });
    }

    res.json({ zone });
});

// تفعيل جميع المناطق بقيمة واحدة
router.post('/activateAll', authMiddleware, (req, res) => {
    const { value } = req.body;
    if (!value || value <= 0) {
        return res.status(400).json({ error: 'Invalid activation value' });
    }

    zoneService.activateAllZones(value);

    res.json({
        message: 'All zones activated successfully',
        zones: zoneService.zones
    });
});

// مكافأة المستخدم بناءً على الطاقة الكلية للمناطق
router.post('/reward', authMiddleware, (req, res) => {
    const totalEnergy = zoneService.rewardUserByZones(req.user.id);

    res.json({
        message: 'User rewarded based on zones energy',
        totalEnergy
    });
});

// استرجاع كل المناطق وحالتها الحالية
router.get('/', authMiddleware, (req, res) => {
    res.json({ zones: zoneService.zones });
});

module.exports = router;
