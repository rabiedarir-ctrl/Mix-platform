const mongoose = require('mongoose');

const DreamSchema = new mongoose.Schema(
    {
        // البيانات الأساسية
        title: {
            type: String,
            required: true,
            maxlength: 200,
        },
        description: {
            type: String,
            maxlength: 5000,
        },

        // المؤلف
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // محتوى الحلم
        sceneObjects: [
            {
                type: String,
                position: { x: Number, y: Number, z: Number },
                rotation: { x: Number, y: Number, z: Number },
                scale: { x: Number, y: Number, z: Number },
            },
        ],
        events: [
            {
                timestamp: Number,
                action: String,
                description: String,
            },
        ],

        // الخصائص
        mood: {
            type: String,
            enum: ['peaceful', 'exciting', 'scary', 'confusing', 'joyful'],
            default: 'peaceful',
        },
        lucidity: {
            type: Number,
            min: 0,
            max: 100,
            default: 50,
        },
        duration: {
            type: Number,
            default: 0, // بالدقائق
        },

        // التفاعلات
        likes: {
            type: Number,
            default: 0,
        },
        comments: [
            {
                userId: mongoose.Schema.Types.ObjectId,
                content: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],

        // الحالة
        isPublic: {
            type: Boolean,
            default: false,
        },
        tags: [String],

        // الذكريات
        aiAnalysis: {
            summary: String,
            themes: [String],
            symbols: [String],
            interpretation: String,
        },
    },
    { timestamps: true }
);

// Indexes
DreamSchema.index({ user: 1, createdAt: -1 });
DreamSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Dream', DreamSchema);
