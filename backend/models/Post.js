const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    energyImpact: { // تأثير المنشور على طاقة المستخدم أو الخلايا
        type: Number,
        default: 0
    },
    dreamsLinked: [{
        type: mongoose.Schema.Types.Mixed
    }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        createdAt: { type: Date, default: Date.now }
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
PostSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// -------------------------------
// 🔹 إضافة تعليق جديد
PostSchema.methods.addComment = function(userId, commentText) {
    this.comments.push({
        userId,
        comment: commentText
    });
    return this.comments;
};

// -------------------------------
// 🔹 ربط حلم جديد بالمنشور
PostSchema.methods.linkDream = function(dreamData) {
    this.dreamsLinked.push(dreamData);
    return this.dreamsLinked;
};

// -------------------------------
// 🔹 التصدير
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
