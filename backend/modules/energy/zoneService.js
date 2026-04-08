// backend/modules/energy/zoneService.js

const eventBus = require('../../core/eventBus');
const { v4: uuidv4 } = require('uuid');

/**
 * تعريف المناطق الستة في جسم الإنسان
 */
const zones = {
    zone1: { name: 'داخلية', type: 'electromagneticHeap', nplus: 0, nminus: 0, energy: 0 },
    zone2: { name: 'خارجية', type: 'lightOxid', nplus: 0, nminus: 0, energy: 0 },
    zone3: { name: 'خارجية/داخلية', type: 'pocketEMOxid', nplus: 0, nminus: 0, energy: 0 },
    zone4: { name: 'خارجية/خارجية', type: 'electronShell', nplus: 0, nminus: 0, energy: 0 },
    zone5: { name: 'داخلية/داخلية', type: 'lightHeapOrigin', nplus: 0, nminus: 0, energy: 0 },
    zone6: { name: 'داخلية/خارجية', type: 'irisLightLayer', nplus: 0, nminus: 0, energy: 0 }
};

/**
 * حساب الطاقة وضبط نوى+ و نوى- لكل منطقة
 * @param {string} zoneId 
 * @param {number} actionValue 
 * @param {string} actionType - 'direct' | 'indirect'
 */
function activateZone(zoneId, actionValue, actionType = 'direct') {
    const zone = zones[zoneId];
    if (!zone) return false;

    // حساب النوى+ والنوى- بناء على قاعدة علم تفوق ذاتي
    const nplusContribution = actionValue * 0.203125; // نسبة قوة ضوئية
    const nminusContribution = actionValue - nplusContribution;

    if (actionType === 'direct') {
        zone.nplus += nplusContribution;
        zone.nminus += nminusContribution;
        zone.energy += actionValue;
    } else if (actionType === 'indirect') {
        // تأثير جزئي على الطاقة
        zone.nplus += nplusContribution * 0.5;
        zone.nminus += nminusContribution * 0.5;
        zone.energy += actionValue * 0.5;
    }

    // نشر الحدث عبر EventBus
    eventBus.publish('zone.activated', {
        zoneId,
        nplus: zone.nplus,
        nminus: zone.nminus,
        energy: zone.energy,
        actionType
    });

    return zone;
}

/**
 * استرجاع حالة المنطقة
 * @param {string} zoneId 
 */
function getZoneStatus(zoneId) {
    return zones[zoneId] || null;
}

/**
 * تفعيل جميع المناطق في دورة
 * @param {number} baseEnergy 
 */
function activateAllZones(baseEnergy = 1) {
    Object.keys(zones).forEach((zoneId) => {
        activateZone(zoneId, baseEnergy, 'direct');
    });
}

/**
 * ربط مع نظام Energy و Cells
 * يمكن مكافأة المستخدم بناءً على الطاقة الكلية للمناطق
 */
function rewardUserByZones(userId) {
    const totalEnergy = Object.values(zones).reduce((sum, z) => sum + z.energy, 0);
    eventBus.publish('user.rewardEnergy', { userId, energy: totalEnergy });
    return totalEnergy;
}

module.exports = {
    zones,
    activateZone,
    getZoneStatus,
    activateAllZones,
    rewardUserByZones
};
