const mongoose = require('mongoose');

const DreamWorldSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dreamId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'عالم الحلم'
    },
    description: {
        type: String
    },
    sceneData: { // بيانات المشهد ثلاثي الأبعاد (objects, positions, colors)
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    energyImpact: { // تأثير هذا الحلم على طاقة المستخدم
        type: Number,
        default: 0
    },
    events: [{ // الأحداث التفاعلية داخل عالم الحلم
        type: mongoose.Schema.Types.Mixed
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// -------------------------------
// 🔹 تحديث وقت التعديل تلقائيًا
DreamWorldSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// -------------------------------
// 🔹 إضافة كائن/مشهد جديد
DreamWorldSchema.methods.addSceneObject = function(objData) {
    if (!this.sceneData.objects) this.sceneData.objects = [];
    this.sceneData.objects.push(objData);
    return this.sceneData.objects;
};

// -------------------------------
// 🔹 إضافة حدث تفاعلي جديد
DreamWorldSchema.methods.addEvent = function(eventData) {
    this.events.push(eventData);
    return this.events;
};

// -------------------------------
// 🔹 التصدير
const DreamWorld = mongoose.model('DreamWorld', DreamWorldSchema);
module.exports = DreamWorld;
