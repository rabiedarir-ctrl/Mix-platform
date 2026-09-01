const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        // البيانات الأساسية
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profileImage: {
            type: String,
            default: null,
        },

        // نظام الطاقة
        energy: {
            type: Number,
            default: 100,
            min: 0,
        },
        cells: {
            type: Number,
            default: 0,
            min: 0,
        },
        level: {
            type: Number,
            default: 1,
            min: 1,
        },
        experience: {
            type: Number,
            default: 0,
            min: 0,
        },

        // المحفظة
        wallet: {
            type: Number,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            default: 'MIX',
        },

        // الإحصائيات
        score: {
            type: Number,
            default: 0,
            min: 0,
        },
        gamesPlayed: {
            type: Number,
            default: 0,
            min: 0,
        },
        dreamsCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        // الحالة
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        // الأدوار والأذونات
        role: {
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user',
        },

        // البيانات الإضافية
        bio: {
            type: String,
            maxlength: 500,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        website: {
            type: String,
            default: '',
        },

        // الإشعارات
        notifications: [
            {
                message: String,
                type: { type: String, enum: ['info', 'warning', 'error', 'success'] },
                createdAt: { type: Date, default: Date.now },
                read: { type: Boolean, default: false },
            },
        ],

        // الضبط
        preferences: {
            theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
            language: { type: String, default: 'ar' },
            notifications: { type: Boolean, default: true },
            emailNotifications: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', UserSchema);
