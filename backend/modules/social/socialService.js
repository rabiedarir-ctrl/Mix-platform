const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const Message = require('../models/messageModel');
const eventBus = require('../core/eventBus');

class SocialService {
    /**
     * إنشاء منشور جديد
     * @param {String} userId
     * @param {String} content
     * @param {Array} tags
     */
    static async createPost(userId, content, tags = []) {
        const post = new Post({ userId, content, tags });
        await post.save();

        // نشر حدث على EventBus
        eventBus.publish('social.post.created', { postId: post._id, userId });

        return post;
    }

    /**
     * إضافة تعليق على منشور
     * @param {String} postId
     * @param {String} userId
     * @param {String} content
     */
    static async addComment(postId, userId, content) {
        const comment = new Comment({ postId, userId, content });
        await comment.save();

        // نشر حدث على EventBus
        eventBus.publish('social.comment.created', { commentId: comment._id, postId, userId });

        return comment;
    }

    /**
     * إرسال رسالة خاصة بين مستخدمين
     * @param {String} fromUserId
     * @param {String} toUserId
     * @param {String} content
     */
    static async sendMessage(fromUserId, toUserId, content) {
        const message = new Message({ fromUserId, toUserId, content });
        await message.save();

        // نشر حدث على EventBus
        eventBus.publish('social.message.sent', { messageId: message._id, fromUserId, toUserId });

        return message;
    }

    /**
     * استرجاع كل المنشورات لمستخدم
     * @param {String} userId
     */
    static async getUserPosts(userId) {
        return await Post.find({ userId }).sort({ createdAt: -1 });
    }

    /**
     * استرجاع كل التعليقات لمنشور
     * @param {String} postId
     */
    static async getPostComments(postId) {
        return await Comment.find({ postId }).sort({ createdAt: 1 });
    }

    /**
     * استرجاع كل الرسائل بين مستخدمين
     * @param {String} userId
     * @param {String} peerId
     */
    static async getMessages(userId, peerId) {
        return await Message.find({
            $or: [
                { fromUserId: userId, toUserId: peerId },
                { fromUserId: peerId, toUserId: userId }
            ]
        }).sort({ createdAt: 1 });
    }
}

module.exports = SocialService;
