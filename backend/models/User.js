const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    energy: {
        type: Number,
        default: 100
    },
    cells: {
        type: Number,
        default: 0
    },
    dreams: [{
        type: mongoose.Schema.Types.Mixed
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// -------------------------------
// 🔹 تشفير كلمة المرور قبل الحفظ
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// -------------------------------
// 🔹 تحقق كلمة المرور
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// -------------------------------
// 🔹 تحديث الطاقة تلقائيًا
UserSchema.methods.updateEnergy = function(amount) {
    this.energy = Math.max(0, this.energy + amount);
    return this.energy;
};

// -------------------------------
// 🔹 إضافة حلم جديد
UserSchema.methods.addDream = function(dreamData) {
    this.dreams.push(dreamData);
    return this.dreams;
};

// -------------------------------
// 🔹 التصدير
const User = mongoose.model('User', UserSchema);
module.exports = User;
