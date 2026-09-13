
"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");
const { authenticateToken } = require("../core/auth");

const router = express.Router();
const rateLimit = require("express-rate-limit");
const router = express.Router();

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        message: "محاولات كثيرة جدًا، يرجى المحاولة لاحقًا"
    }
});

function createToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

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

function publicUser(user) {
    return {
        id: user._id.toString(),
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
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        bio: user.bio,
        location: user.location,
        website: user.website,
        notifications: user.notifications,
        preferences: user.preferences,
        createdAt: user.createdAt
    };
}

/* =====================================================
   REGISTER
   POST /api/users/register
===================================================== */

router.post("/login", authRateLimiter, async (req, res)}
    try {
        const {
            username,
            email,
            password,
            confirmPassword,
            fullname,
            phone,
            terms
        } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message:
                    "اسم المستخدم والبريد الإلكتروني وكلمة المرور مطلوبة"
            });
        }

        if (confirmPassword !== undefined &&
            password !== confirmPassword) {
            return res.status(400).json({
                message: "كلمتا المرور غير متطابقتين"
            });
        }

        if (terms !== undefined &&
            terms !== true &&
            terms !== "true" &&
            terms !== "on") {
            return res.status(400).json({
                message: "يجب الموافقة على الشروط"
            });
        }

        const cleanUsername = String(username).trim();
        const cleanEmail = String(email).trim().toLowerCase();

        if (cleanUsername.length < 3) {
            return res.status(400).json({
                message: "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل"
            });
        }

        if (cleanUsername.length > 30) {
            return res.status(400).json({
                message: "اسم المستخدم طويل جدًا"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                message: "البريد الإلكتروني غير صالح"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: cleanEmail },
                { username: cleanUsername }
            ]
        }).lean();

        if (existingUser) {
            if (existingUser.email === cleanEmail) {
                return res.status(409).json({
                    message: "البريد الإلكتروني مستخدم مسبقًا"
                });
            }

            return res.status(409).json({
                message: "اسم المستخدم مستخدم مسبقًا"
            });
        }

        const user = new User({
            username: cleanUsername,
            email: cleanEmail,
            password,
            fullname: fullname
                ? String(fullname).trim()
                : "",
            phone: phone
                ? String(phone).trim()
                : "",
            termsAcceptedAt:
                terms !== undefined
                    ? new Date()
                    : null
        });

        await user.save();

        const token = createToken(user);

        return res.status(201).json({
            message: "تم إنشاء الحساب بنجاح",
            token,
            user: publicUser(user)
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "البريد الإلكتروني أو اسم المستخدم مستخدم مسبقًا"
            });
        }

        return res.status(500).json({
            message: "حدث خطأ أثناء التسجيل"
        });
    }
});

/* =====================================================
   LOGIN
   POST /api/users/login
===================================================== */

router.post("/login",authRateLimiter, async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "البريد الإلكتروني وكلمة المرور مطلوبان"
            });
        }

        const cleanEmail =
            String(email).trim().toLowerCase();

        const user = await User
            .findOne({ email: cleanEmail })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                message:
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "هذا الحساب غير نشط"
            });
        }

        const passwordValid =
            await user.comparePassword(password);

        if (!passwordValid) {
            return res.status(401).json({
                message:
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            });
        }

        user.lastLogin = new Date();

        await user.save();

        const token = createToken(user);

        return res.status(200).json({
            message: "تم تسجيل الدخول بنجاح",
            token,
            user: publicUser(user)
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message:
                "حدث خطأ أثناء تسجيل الدخول"
        });
    }
});

/* =====================================================
   CURRENT USER
   GET /api/users/me
===================================================== */

router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await User
            .findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "المستخدم غير موجود"
            });
        }

        return res.status(200).json(
            publicUser(user)
        );

    } catch (error) {
        console.error("GET ME ERROR:", error);

        return res.status(500).json({
            message:
                "تعذر جلب بيانات المستخدم"
        });
    }
});

/* =====================================================
   GET USER
   GET /api/users/:userId
===================================================== */

router.get("/:userId", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "معرف المستخدم غير صالح"
            });
        }

        const user = await User
            .findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "المستخدم غير موجود"
            });
        }

        return res.status(200).json(
            publicUser(user)
        );

    } catch (error) {
        console.error("GET USER ERROR:", error);

        return res.status(500).json({
            message:
                "تعذر جلب بيانات المستخدم"
        });
    }
});

/* =====================================================
   ENERGY
   PUT /api/users/:userId/energy
===================================================== */

router.put(
    "/:userId/energy",
    authenticateToken,
    async (req, res) => {
        try {
            const { userId } = req.params;

            if (req.user.userId !== userId) {
                return res.status(403).json({
                    message:
                        "غير مسموح بتعديل حساب مستخدم آخر"
                });
            }

            const energyChange =
                Number(req.body.energyChange || 0);

            const cellsChange =
                Number(req.body.cellsChange || 0);

            if (
                !Number.isFinite(energyChange) ||
                !Number.isFinite(cellsChange)
            ) {
                return res.status(400).json({
                    message: "قيم الطاقة أو الخلايا غير صالحة"
                });
            }

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    message: "المستخدم غير موجود"
                });
            }

            user.updateEnergy(energyChange);

            user.cells = Math.max(
                0,
                user.cells + cellsChange
            );

            await user.save();

            return res.status(200).json({
                energy: user.energy,
                cells: user.cells
            });

        } catch (error) {
            console.error(
                "ENERGY UPDATE ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "تعذر تحديث الطاقة والخلايا"
            });
        }
    }
);

/* =====================================================
   ADD DREAM
   POST /api/users/:userId/dreams
===================================================== */

router.post(
    "/:userId/dreams",
    authenticateToken,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { dreamData } = req.body;

            if (req.user.userId !== userId) {
                return res.status(403).json({
                    message:
                        "غير مسموح بتعديل حساب مستخدم آخر"
                });
            

// تطبيق مُحدد معدل الطلبات على جميع 
الطلبات app.use ( limiter ) ; app.get ( ' / : path ' , function ( req , res ) { let path = req.params.path ; if ( isValidPath ( path ) ) res.sendFile ( path ) ; } ) ;
            }

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
                dreams: user.dreams,
                dreamsCount: user.dreamsCount
            });

        } catch (error) {
            console.error(
                "ADD DREAM ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "تعذر إضافة الحلم"
            });
        }
    }
);

module.exports = router;
