"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const notificationSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
            maxlength: 500
        },
        type: {
            type: String,
            enum: ["info", "warning", "error", "success"],
            default: "info"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    { _id: true }
);

const dreamSchema = new mongoose.Schema(
    {
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: true }
);

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },

        fullname: {
            type: String,
            trim: true,
            maxlength: 100,
            default: ""
        },

        phone: {
            type: String,
            trim: true,
            maxlength: 30,
            default: ""
        },

        profileImage: {
            type: String,
            default: null
        },

        energy: {
            type: Number,
            default: 100,
            min: 0
        },

        cells: {
            type: Number,
            default: 0,
            min: 0
        },

        level: {
            type: Number,
            default: 1,
            min: 1
        },

        experience: {
            type: Number,
            default: 0,
            min: 0
        },

        wallet: {
            type: Number,
            default: 0,
            min: 0
        },

        currency: {
            type: String,
            default: "MIX"
        },

        score: {
            type: Number,
            default: 0,
            min: 0
        },

        gamesPlayed: {
            type: Number,
            default: 0,
            min: 0
        },

        dreamsCount: {
            type: Number,
            default: 0,
            min: 0
        },

        dreams: {
            type: [dreamSchema],
            default: []
        },

        isActive: {
            type: Boolean,
            default: true
        },

        lastLogin: {
            type: Date,
            default: null
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        termsAcceptedAt: {
            type: Date,
            default: null
        },

        role: {
            type: String,
            enum: ["user", "admin", "moderator"],
            default: "user"
        },

        bio: {
            type: String,
            maxlength: 500,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        website: {
            type: String,
            default: ""
        },

        notifications: {
            type: [notificationSchema],
            default: []
        },

        preferences: {
            theme: {
                type: String,
                enum: ["light", "dark"],
                default: "dark"
            },

            language: {
                type: String,
                default: "ar"
            },

            notifications: {
                type: Boolean,
                default: true
            },

            emailNotifications: {
                type: Boolean,
                default: false
            }
        }
    },
    {
        timestamps: true
    }
);

/*
 * تشفير كلمة المرور قبل الحفظ.
 * إذا كانت كلمة المرور لم تتغير، لا نعيد تشفيرها.
 */
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/*
 * مقارنة كلمة المرور المدخلة مع كلمة المرور المشفرة.
 */
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

/*
 * تحديث الطاقة مع منعها من النزول تحت صفر.
 */
UserSchema.methods.updateEnergy = function (amount) {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
        throw new Error("Invalid energy value");
    }

    this.energy = Math.max(0, this.energy + value);

    return this.energy;
};

/*
 * إضافة حلم للمستخدم.
 */
UserSchema.methods.addDream = function (dreamData) {
    this.dreams.push({
        data: dreamData
    });

    this.dreamsCount = this.dreams.length;

    return this.dreams[this.dreams.length - 1];
};

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ createdAt: -1 });

module.exports =
    mongoose.models.User ||
    mongoose.model("User", UserSchema);
