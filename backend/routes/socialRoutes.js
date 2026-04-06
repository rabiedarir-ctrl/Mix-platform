const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Message = require('../models/Message');
const { authenticateToken } = require('../core/auth');

// -------------------------------
// 🔹 إنشاء منشور جديد
router.post('/posts', authenticateToken, async (req, res) => {
    try {
        const { userId, content } = req.body;

        const newPost = new Post({
            authorId: userId,
            content
        });

        await newPost.save();
        res.status(201).json({ message: 'تم إنشاء المنشور', post: newPost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 جلب جميع المنشورات
router.get('/posts', authenticateToken, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 إضافة تعليق على منشور
router.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, comment } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'المنشور غير موجود' });

        post.comments.push({ userId, comment });
        await post.save();

        res.json({ message: 'تم إضافة التعليق', comments: post.comments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 إرسال رسالة لمستخدم آخر
router.post('/messages', authenticateToken, async (req, res) => {
    try {
        const { senderId, receiverId, content, type } = req.body;

        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            type
        });

        await newMessage.save();
        res.status(201).json({ message: 'تم إرسال الرسالة', newMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 جلب الرسائل الخاصة بمستخدم
router.get('/messages/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ createdAt: -1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 التصدير
module.exports = router;
