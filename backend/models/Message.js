const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: { // نص، صوت، إشعار، أو حدث تفاعلي
        type: String,
        enum: ['text', 'voice', 'notification', 'event'],
        default: 'text'
    },
    linkedDream: { // إمكانية ربط الرسالة بحلم
        type: mongoose.Schema.Types.Mixed
    },
    read: {
        type: Boolean,
        default: false
    },
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
MessageSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// -------------------------------
// 🔹 وسم الرسالة كمقروءة
MessageSchema.methods.markAsRead = function() {
    this.read = true;
    return this.read;
};

// -------------------------------
// 🔹 ربط حلم بالرسالة
MessageSchema.methods.linkDream = function(dreamData) {
    this.linkedDream = dreamData;
    return this.linkedDream;
};

// -------------------------------
// 🔹 التصدير
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
