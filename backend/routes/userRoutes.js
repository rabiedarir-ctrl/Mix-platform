// ======================================================
// Mix Platform - User Routes
// File: backend/routes/userRoutes.js
// ======================================================

"use strict";

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken } = require("../core/auth");

// ======================================================
// 🔐 إنشاء JWT
// ======================================================

function createToken(user) {
    return jwt.sign(
        {
            userId: user._id.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
}

// ======================================================
// 📝 تسجيل مستخدم جدي��
// POST /api/users/register
// ======================================================

router.post("/api/users/register", async (req, res) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;

        // التحقق من البيانات المطلوبة
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "اسم المستخدم والبريد الإلكتروني وكلمة المرور مطلوبة"
            });
        }

        // تنظيف البيانات
        const cleanUsername = String(username).trim();
        const cleanEmail = String(email).trim().toLowerCase();

        if (!cleanUsername || !cleanEmail || !password) {
            return res.status(400).json({
                message: "بيانات التسجيل غير صالحة"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"
            });
        }

        // التحقق من وجود البريد
        const existingEmail = await User.findOne({
            email: cleanEmail
        });

        if (existingEmail) {
            return res.status(409).json({
                message: "البريد الإلكتروني مستخدم مسبقًا"
            });
        }

        // التحقق من وجود اسم المستخدم
        const existingUsername = await User.findOne({
            username: cleanUsername
        });

        if (existingUsername) {
            return res.status(409).json({
                message: "اسم المستخدم مستخدم مسبقًا"
            });
        }

        // إنشاء المستخدم
        const user = new User({
            username: cleanUsername,
            email: cleanEmail,
            password,
            level: 1,
            wallet: 0,
            energy: 100,
            cells: 0
        });

        // UserSchema يقوم بتشفير كلمة المرور قبل الحفظ
        await user.save();

        return res.status(201).json({
            message: "تم التسجيل بنجاح",
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
            level: user.level,
            wallet: user.wallet,
            energy: user.energy,
            cells: user.cells
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        // أخطاء MongoDB الخاصة بالـ unique indexes
        if (error.code === 11000) {
            return res.status(409).json({
                message: "البريد الإلكتروني أو اسم المستخدم مستخدم مسبقًا"
            });
        }

        return res.status(500).json({
            message: "حدث خطأ أثناء التسجيل"
        });
    }
});

// ======================================================
// 🔑 تسجيل الدخول
// POST /api/users/login
// ======================================================

router.post("/api/users//login", async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        // التحقق من البيانات
        if (!email || !password) {
            return res.status(400).json({
                message: "البريد الإلكتروني وكلمة المرور مطلوبان"
            });
        }

        const cleanEmail = String(email)
            .trim()
            .toLowerCase();

        // البحث عن المستخدم
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            });
        }

        // التحقق من كلمة المرور
        const passwordValid =
            await user.comparePassword(password);

        if (!passwordValid) {
            return res.status(401).json({
                message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            });
        }

        // إنشاء JWT
        const token = createToken(user);

        // البيانات التي يحتاجها Frontend
        return res.status(200).json({
            message: "تم تسجيل الدخول بنجاح",

            token,

            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                level: user.level,
                wallet: user.wallet,
                energy: user.energy,
                cells: user.cells,
                dreams: user.dreams || []
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "حدث خطأ أثناء تسجيل الدخول"
        });
    }
});

// ======================================================
// 👤 بيانات المستخدم الحالي
// GET /api/users/me
// ======================================================

router.get("/api/users/me", authenticateToken, async (req, res) => {
    try {

        const userId = req.user.userId;

        const user = await User
            .findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "المستخدم غير موجود"
            });
        }

        return res.status(200).json({
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            level: user.level,
            wallet: user.wallet,
            energy: user.energy,
            cells: user.cells,
            dreams: user.dreams || [],
            createdAt: user.createdAt
        });

    } catch (error) {

        console.error("GET ME ERROR:", error);

        return res.status(500).json({
            message: "تعذر جلب بيانات المستخدم"
        });
    }
});

// ======================================================
// 👤 جلب مستخدم بواسطة ID
// GET /api/users/:userId
// ======================================================

router.get("/api/users/:userId", authenticateToken, async (req, res) => {
    try {

        const { userId } = req.params;

        const user = await User
            .findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "المستخدم غير موجود"
            });
        }

        return res.status(200).json(user);

    } catch (error) {

        console.error("GET USER ERROR:", error);

        return res.status(500).json({
            message: "تعذر جلب بيانات المستخدم"
        });
    }
});

// ======================================================
// ⚡ تحديث الطاقة والخلايا
// PUT /api/users/:userId/energy
// ======================================================

router.put("/api/users/:userId/energy", authenticateToken, async (req, res) => {
    try {

        const { userId } = req.params;

        const {
            energyChange = 0,
            cellsChange = 0
        } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "المستخدم غير موجود"
            });
        }

        if (Number(energyChange) !== 0) {
            user.updateEnergy(Number(energyChange));
        }

        if (Number(cellsChange) !== 0) {
            user.cells += Number(cellsChange);
        }

        await user.save();

        return res.status(200).json({
            energy: user.energy,
            cells: user.cells
        });

    } catch (error) {

        console.error("ENERGY UPDATE ERROR:", error);

        return res.status(500).json({
            message: "تعذر تحديث الطاقة والخلايا"
        });
    }
});

// ======================================================
// 🌙 إضافة حلم للمستخدم
// POST /api/users/:userId/dreams
// ======================================================

router.post("/api/users/:userId/dreams", authenticateToken, async (req, res) => {
    try {

        const { userId } = req.params;
        const { dreamData } = req.body;

        if (dreamData === undefined) {
            return res.status(400).json({
                message: "بيانات الحلم مطلوبة"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "المستخدم غير موجود"
            });
        }

        user.addDream(dreamData);

        await user.save();

        return res.status(201).json({
            dreams: user.dreams
        });

    } catch (error) {

        console.error("ADD DREAM ERROR:", error);

        return res.status(500).json({
            message: "تعذر إضافة الحلم"
        });
    }
});

// ======================================================
// 📤 تصدير Router
// ======================================================

module.exports = router;
