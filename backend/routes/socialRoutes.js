
"use strict";

const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const Message = require("../models/Message");
const { authenticateToken } = require("../core/auth");

// ==================================================
// 1. جلب المنشورات
// GET /api/social/posts
// ==================================================

router.get("/posts", authenticateToken, async (req, res) => {
    try {
        const posts = await Post.find({
            isPublished: true,
            isDraft: false
        })
            .populate("author", "username name avatar")
            .sort({ createdAt: -1 })
            .limit(100);

        res.json(posts);

    } catch (error) {
        console.error("GET POSTS ERROR:", error);

        res.status(500).json({
            message: "تعذر جلب المنشورات"
        });
    }
});

// ==================================================
// 2. إنشاء منشور
// POST /api/social/posts
// ==================================================

router.post("/posts", authenticateToken, async (req, res) => {
    try {
        const { content, images, videos, tags, category } = req.body;

        if (!content || typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                message: "محتوى المنشور مطلوب"
            });
        }

        if (content.length > 5000) {
            return res.status(400).json({
                message: "المنشور يتجاوز 5000 حرف"
            });
        }

        const newPost = new Post({
            author: req.user.userId,
            content: content.trim(),
            images: Array.isArray(images) ? images : [],
            videos: Array.isArray(videos) ? videos : [],
            tags: Array.isArray(tags) ? tags : [],
            category: category || undefined
        });

        await newPost.save();

        await newPost.populate("author", "username name avatar");

        res.status(201).json({
            message: "تم إنشاء المنشور بنجاح",
            post: newPost
        });

    } catch (error) {
        console.error("CREATE POST ERROR:", error);

        res.status(500).json({
            message: "تعذر إنشاء المنشور"
        });
    }
});

// ==================================================
// 3. حذف منشور
// DELETE /api/social/posts/:postId
// ==================================================

router.delete("/posts/:postId", authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "المنشور غير موجود"
            });
        }

        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "ليس لديك صلاحية حذف هذا المنشور"
            });
        }

        await post.deleteOne();

        res.json({
            message: "تم حذف المنشور بنجاح"
        });

    } catch (error) {
        console.error("DELETE POST ERROR:", error);

        res.status(500).json({
            message: "تعذر حذف المنشور"
        });
    }
});

// ==================================================
// 4. إعجاب / إلغاء إعجاب
// POST /api/social/posts/:postId/like
// ==================================================

router.post("/posts/:postId/like", authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "المنشور غير موجود"
            });
        }

        const userId = req.user.userId;

        const alreadyLiked = post.likes.some(
            like => like.userId.toString() === userId
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                like => like.userId.toString() !== userId
            );

            await post.save();

            return res.json({
                message: "تم إلغاء الإعجاب",
                liked: false,
                likesCount: post.likes.length
            });
        }

        post.likes.push({
            userId
        });

        await post.save();

        res.json({
            message: "تم تسجيل الإعجاب",
            liked: true,
            likesCount: post.likes.length
        });

    } catch (error) {
        console.error("LIKE POST ERROR:", error);

        res.status(500).json({
            message: "تعذر تسجيل الإعجاب"
        });
    }
});

// ==================================================
// 5. إضافة تعليق
// POST /api/social/posts/:postId/comments
// ==================================================

router.post("/posts/:postId/comments", authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                message: "نص التعليق مطلوب"
            });
        }

        if (content.length > 2000) {
            return res.status(400).json({
                message: "التعليق طويل جداً"
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "المنشور غير موجود"
            });
        }

        post.comments.push({
            userId: req.user.userId,
            content: content.trim()
        });

        await post.save();

        res.status(201).json({
            message: "تم إضافة التعليق بنجاح",
            comments: post.comments
        });

    } catch (error) {
        console.error("ADD COMMENT ERROR:", error);

        res.status(500).json({
            message: "تعذر إضافة التعليق"
        });
    }
});

// ==================================================
// 6. إرسال رسالة
// POST /api/social/messages
// ==================================================

router.post("/messages", authenticateToken, async (req, res) => {
    try {
        const { receiverId, content, type } = req.body;

        if (!receiverId || !content || !content.trim()) {
            return res.status(400).json({
                message: "المستلم ومحتوى الرسالة مطلوبان"
            });
        }

        const newMessage = new Message({
            senderId: req.user.userId,
            receiverId,
            content: content.trim(),
            type: type || "text"
        });

        await newMessage.save();

        res.status(201).json({
            message: "تم إرسال الرسالة",
            newMessage
        });

    } catch (error) {
        console.error("SEND MESSAGE ERROR:", error);

        res.status(500).json({
            message: "تعذر إرسال الرسالة"
        });
    }
});

// ==================================================
// 7. جلب الرسائل
// GET /api/social/messages/:userId
// ==================================================

router.get("/messages/:userId", authenticateToken, async (req, res) => {
    try {
        // منع الوصول إلى رسائل حساب آخر
        if (req.params.userId !== req.user.userId) {
            return res.status(403).json({
                message: "غير مسموح بالوصول إلى هذه الرسائل"
            });
        }

        const userId = req.user.userId;

        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(500);

        res.json(messages);

    } catch (error) {
        console.error("GET MESSAGES ERROR:", error);

        res.status(500).json({
            message: "تعذر جلب الرسائل"
        });
    }
});

// ==================================================
// تصدير Router
// ==================================================

module.exports = router;
                   
