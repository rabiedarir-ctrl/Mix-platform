const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        // المنشور
        content: {
            type: String,
            required: true,
            maxlength: 5000,
        },
        images: [String],
        videos: [String],

        // المؤلف
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // التفاعلات
        likes: [
            {
                userId: mongoose.Schema.Types.ObjectId,
                createdAt: { type: Date, default: Date.now },
            },
        ],
        comments: [
            {
                userId: mongoose.Schema.Types.ObjectId,
                content: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
        shares: {
            type: Number,
            default: 0,
        },

        // الحالة
        isPublished: {
            type: Boolean,
            default: true,
        },
        isDraft: {
            type: Boolean,
            default: false,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },

        // التصنيفات
        tags: [String],
        category: String,

        // الإحصائيات
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Indexes
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ 'likes.userId': 1 });

module.exports = mongoose.model('Post', PostSchema);
