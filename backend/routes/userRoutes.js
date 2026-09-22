"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const User = require("../models/User");
const { authenticateToken } = require("../core/auth");

const router = express.Router();

/*
 * Rate limiting للتسجيل وتسجيل الدخول
 */
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        message: "محاولات كثيرة جدًا، يرجى المحاولة لاحقًا"
    }
});

/*
 * إنشاء JWT
 */
function createToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET غير موجود");
    }

    return jwt.sign(
        {
            userId: user._id.toString(),
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
}

/*
 * بيانات المستخدم التي يمكن إرسالها للواجهة
 * لا نرسل كلمة المرور أو بيانات حساسة.
 */
function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        phone: user.phone,
        profileImage: user.profileImage,
        energy: user.energy,
        cells: user.cells,
        level: user.level,
        experience: user.experience,
        wallet: user.wallet,
        currency: user.currency,
        score: user.score,
        gamesPlayed: user.gamesPlayed,
        dreamsCount: user.dreamsCount,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        bio: user.bio,
        location: user.location,
        website: user.website,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

/*
 * REGISTER
 * POST /api/users/register
 */
router.post(
    "/register",
    authRateLimiter,
    async (req, res) => {
        try {
            const {
                username,
                email,
                password,
                confirmPassword,
                fullname,
                phone,
                termsAccepted
            } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    message:
                        "اسم المستخدم والبريد الإلكتروني وكلمة المرور مطلوبة"
                });
            }

            if (username.trim().length < 3) {
                return res.status(400).json({
                    message:
                        "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل"
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    message:
                        "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"
                });
            }

            if (
                confirmPassword !== undefined &&
                password !== confirmPassword
            ) {
                return res.status(400).json({
                    message:
                        "كلمة المرور وتأكيد كلمة المرور غير متطابقين"
                });
            }

            if (termsAccepted !== true) {
                return res.status(400).json({
                    message:
                        "يجب الموافقة على الشروط والأحكام"
                });
            }

            const normalizedUsername =
                username.trim();

            const normalizedEmail =
                email.trim().toLowerCase();

            const existingUser =
                await User.findOne({
                    $or: [
                        {
                            username:
                                normalizedUsername
                        },
                        {
                            email:
                                normalizedEmail
                        }
                    ]
                });

            if (existingUser) {
                if (
                    existingUser.username ===
                    normalizedUsername
                ) {
                    return res.status(409).json({
                        message:
                            "اسم المستخدم مستخدم بالفعل"
                    });
                }

                return res.status(409).json({
                    message:
                        "البريد الإلكتروني مستخدم بالفعل"
                });
            }

            const user = new User({
                username: normalizedUsername,
                email: normalizedEmail,
                password,
                fullname:
                    fullname
                        ? fullname.trim()
                        : "",
                phone:
                    phone
                        ? phone.trim()
                        : "",
                termsAcceptedAt:
                    new Date()
            });

            await user.save();

            const token =
                createToken(user);

            return res.status(201).json({
                message:
                    "تم إنشاء الحساب بنجاح",
                token,
                user:
                    publicUser(user)
            });

        } catch (error) {
            console.error(
                "REGISTER ERROR:",
                error
            );

            if (
                error.code === 11000
            ) {
                return res.status(409).json({
                    message:
                        "اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل"
                });
            }

            if (
                error instanceof mongoose.Error.ValidationError
            ) {
                return res.status(400).json({
                    message:
                        "بيانات التسجيل غير صحيحة",
                    errors:
                        Object.values(
                            error.errors
                        ).map(
                            (item) =>
                                item.message
                        )
                });
            }

            return res.status(500).json({
                message:
                    "حدث خطأ أثناء إنشاء الحساب"
            });
        }
    }
);

/*
 * LOGIN
 * POST /api/users/login
 */
router.post(
    "/login",
    authRateLimiter,
    async (req, res) => {
        try {
            const {
                email,
                username,
                password
            } = req.body;

            const login =
                email || username;

            if (!login || !password) {
                return res.status(400).json({
                    message:
                        "اسم المستخدم أو البريد الإلكتروني وكلمة المرور مطلوبة"
                });
            }

            const query = login.includes("@")
                ? {
                    email:
                        login
                            .trim()
                            .toLowerCase()
                }
                : {
                    username:
                        login.trim()
                };

            const user =
                await User.findOne(query)
                    .select("+password");

            if (!user) {
                return res.status(401).json({
                    message:
                        "بيانات تسجيل الدخول غير صحيحة"
                });
            }

            if (!user.isActive) {
                return res.status(403).json({
                    message:
                        "هذا الحساب غير نشط"
                });
            }

            const passwordValid =
                await user.comparePassword(
                    password
                );

            if (!passwordValid) {
                return res.status(401).json({
                    message:
                        "بيانات تسجيل الدخول غير صحيحة"
                });
            }

            user.lastLogin =
                new Date();

            await user.save();

            const token =
                createToken(user);

            return res.status(200).json({
                message:
                    "تم تسجيل الدخول بنجاح",
                token,
                user:
                    publicUser(user)
            });

        } catch (error) {
            console.error(
                "LOGIN ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "حدث خطأ أثناء تسجيل الدخول"
            });
        }
    }
);

/*
 * CURRENT USER
 * GET /api/users/me
 */
router.get(
    "/me",
    authenticateToken,
    async (req, res) => {
        try {
            const user =
                await User.findById(
                    req.user.userId
                );

            if (!user) {
                return res.status(404).json({
                    message:
                        "المستخدم غير موجود"
                });
            }

            return res.status(200).json({
                user:
                    publicUser(user)
            });

        } catch (error) {
            console.error(
                "GET ME ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "حدث خطأ أثناء جلب بيانات المستخدم"
            });
        }
    }
);

/*
 * GET USER
 * GET /api/users/:userId
 */
router.get(
    "/:userId",
    authenticateToken,
    async (req, res) => {
        try {
            const {
                userId
            } = req.params;

            if (
                !mongoose.Types.ObjectId.isValid(
                    userId
                )
            ) {
                return res.status(400).json({
                    message:
                        "معرف المستخدم غير صالح"
                });
            }

            const user =
                await User.findById(
                    userId
                );

            if (!user) {
                return res.status(404).json({
                    message:
                        "المستخدم غير موجود"
                });
            }

            return res.status(200).json({
                user:
                    publicUser(user)
            });

        } catch (error) {
            console.error(
                "GET USER ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "حدث خطأ أثناء جلب المستخدم"
            });
        }
    }
);

/*
 * UPDATE ENERGY
 * PUT /api/users/:userId/energy
 */
router.put(
    "/:userId/energy",
    authenticateToken,
    async (req, res) => {
        try {
            const {
                userId
            } = req.params;

            const {
                amount
            } = req.body;

            if (
                req.user.userId !==
                userId &&
                req.user.role !== "admin"
            ) {
                return res.status(403).json({
                    message:
                        "غير مصرح لك بتعديل طاقة هذا المستخدم"
                });
            }

            if (
                !mongoose.Types.ObjectId.isValid(
                    userId
                )
            ) {
                return res.status(400).json({
                    message:
                        "معرف المستخدم غير صالح"
                });
            }

            const numericAmount =
                Number(amount);

            if (
                !Number.isFinite(
                    numericAmount
                )
            ) {
                return res.status(400).json({
                    message:
                        "قيمة الطاقة غير صالحة"
                });
            }

            const user =
                await User.findById(
                    userId
                );

            if (!user) {
                return res.status(404).json({
                    message:
                        "المستخدم غير موجود"
                });
            }

            user.updateEnergy(
                numericAmount
            );

            await user.save();

            return res.status(200).json({
                message:
                    "تم تحديث الطاقة",
                energy:
                    user.energy,
                user:
                    publicUser(user)
            });

        } catch (error) {
            console.error(
                "UPDATE ENERGY ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "حدث خطأ أثناء تحديث الطاقة"
            });
        }
    }
);

/*
 * ADD DREAM
 * POST /api/users/:userId/dreams
 */
router.post(
    "/:userId/dreams",
    authenticateToken,
    async (req, res) => {
        try {
            const {
                userId
            } = req.params;

            if (
                req.user.userId !==
                userId &&
                req.user.role !== "admin"
            ) {
                return res.status(403).json({
                    message:
                        "غير مصرح لك بإضافة حلم لهذا المستخدم"
                });
            }

            if (
                !mongoose.Types.ObjectId.isValid(
                    userId
                )
            ) {
                return res.status(400).json({
                    message:
                        "معرف المستخدم غير صالح"
                });
            }

            if (
                req.body === undefined ||
                req.body === null
            ) {
                return res.status(400).json({
                    message:
                        "بيانات الحلم مطلوبة"
                });
            }

            const user =
                await User.findById(
                    userId
                );

            if (!user) {
                return res.status(404).json({
                    message:
                        "المستخدم غير موجود"
                });
            }

            const dream =
                user.addDream(
                    req.body
                );

            await user.save();

            return res.status(201).json({
                message:
                    "تم حفظ الحلم",
                dream,
                dreamsCount:
                    user.dreamsCount
            });

        } catch (error) {
            console.error(
                "ADD DREAM ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "حدث خطأ أثناء حفظ الحلم"
            });
        }
    }
);

module.exports = router;
