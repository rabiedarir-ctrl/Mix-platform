// backend/models/energyModel.js

const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalEnergy: {
        type: Number,
        default: 0
    },
    currentEnergy: {
        type: Number,
        default: 100
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    history: [
        {
            timestamp: { type: Date, default: Date.now },
            delta: Number,
            reason: String // مثال: "cell used", "game won", "daily bonus"
        }
    ]
}, { timestamps: true });

/**
 * تحديث الطاقة للمستخدم
 * @param {Number} delta - التغير في الطاقة (+/-)
 * @param {String} reason - سبب التغيير
 */
energySchema.methods.updateEnergy = async function(delta, reason = 'system') {
    this.currentEnergy += delta;
    this.totalEnergy += delta > 0 ? delta : 0; // إجمالي الطاقة لا ينقص
    this.lastUpdated = new Date();
    this.history.push({ timestamp: new Date(), delta, reason });
    await this.save();
    return this;
};

module.exports = mongoose.model('Energy', energySchema);
