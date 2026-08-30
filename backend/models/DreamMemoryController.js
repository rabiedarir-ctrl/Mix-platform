// ======================================================
// Mix Platform - Dream Memory Controller
// File: backend/models/DreamMemoryController.js
// ======================================================

"use strict";

const mongoose = require("mongoose");

// ======================================================
// 🔹 الأوامر المسموح بها فقط
// ======================================================

const ALLOWED_ACTIONS = [
    "activate",
    "deactivate",
    "move",
    "teleport",
    "set_position",
    "set_world_state",
    "spawn_object",
    "remove_object",
    "set_scene",
    "pause",
    "resume"
];

// ======================================================
// 🔹 أمر تحكم واحد
// ======================================================

const ControlActionSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            enum: ALLOWED_ACTIONS
        },

        payload: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        enabled: {
            type: Boolean,
            default: true
        },

        executed: {
            type: Boolean,
            default: false
        },

        executedAt: {
            type: Date,
            default: null
        }
    },
    {
        _id: true
    }
);

// ======================================================
// 🔹 موقع الذاكرة
// ======================================================

const MemoryLocationSchema = new mongoose.Schema(
    {
        cellId: {
            type: String,
            required: true,
            index: true
        },

        x: {
            type: Number,
            default: 0
        },

        y: {
            type: Number,
            default: 0
        },

        z: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
);

// ======================================================
// 🔹 نموذج ذاكرة التحكم
// ======================================================

const DreamMemoryControllerSchema = new mongoose.Schema(
    {
        // صاحب الذاكرة
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // معرف ذاكرة الحلم
        memoryId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        // اسم الذاكرة
        name: {
            type: String,
            default: "Dream Memory"
        },

        // ==================================================
        // 🧠 حالة الذاكرة
        // ==================================================

        active: {
            type: Boolean,
            default: true,
            index: true
        },

        locked: {
            type: Boolean,
            default: false
        },

        // ==================================================
        // 📍 الخلية والموقع
        // ==================================================

        location: {
            type: MemoryLocationSchema,
            required: true
        },

        // ==================================================
        // 🌍 حالة عالم الحلم
        // ==================================================

        worldState: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        // ==================================================
        // 🎮 أوامر التحكم المسموح بها
        // ==================================================

        actions: {
            type: [ControlActionSchema],
            default: []
        },

        // ==================================================
        // 🔢 رقم إصدار الحالة
        // يمنع تطبيق حالة قديمة فوق حالة أحدث
        // ==================================================

        version: {
            type: Number,
            default: 1,
            min: 1
        },

        // آخر وقت تمت فيه مزامنة الذاكرة
        lastSyncAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// ======================================================
// 🔹 التحقق من الأمر
// ======================================================

DreamMemoryControllerSchema.methods.canExecute = function (
    action
) {
    if (!this.active) {
        return false;
    }

    if (this.locked) {
        return false;
    }

    return ALLOWED_ACTIONS.includes(action);
};

// ======================================================
// 🔹 إضافة أمر آمن
// ======================================================

DreamMemoryControllerSchema.methods.addAction = function (
    action,
    payload = {}
) {
    if (!ALLOWED_ACTIONS.includes(action)) {
        throw new Error(
            `Action not allowed: ${action}`
        );
    }

    this.actions.push({
        action,
        payload,
        enabled: true,
        executed: false
    });

    this.version += 1;

    return this.save();
};

// ======================================================
// 🔹 تنفيذ حالة الأمر
// ملاحظة: هذا يسجل الحالة فقط.
// محرك المنصة هو الذي ينفذ الأمر فعليًا.
// ======================================================

DreamMemoryControllerSchema.methods.markExecuted = async function (
    actionId
) {
    const action = this.actions.id(actionId);

    if (!action) {
        throw new Error("Action not found");
    }

    if (!action.enabled) {
        throw new Error("Action disabled");
    }

    action.executed = true;
    action.executedAt = new Date();

    this.lastSyncAt = new Date();

    await this.save();

    return action;
};

// ======================================================
// 🔹 تحديث موقع الذاكرة
// ======================================================

DreamMemoryControllerSchema.methods.setLocation = async function (
    location
) {
    if (!location || !location.cellId) {
        throw new Error("cellId is required");
    }

    this.location.cellId = String(location.cellId);

    this.location.x =
        Number(location.x) || 0;

    this.location.y =
        Number(location.y) || 0;

    this.location.z =
        Number(location.z) || 0;

    this.version += 1;

    await this.save();

    return this.location;
};

// ======================================================
// 🔹 تحديث حالة العالم
// ======================================================

DreamMemoryControllerSchema.methods.setWorldState = async function (
    state
) {
    if (!state || typeof state !== "object") {
        throw new Error("Invalid world state");
    }

    this.worldState = state;

    this.version += 1;

    await this.save();

    return this.worldState;
};

// ======================================================
// 🔹 تفعيل الذاكرة
// ======================================================

DreamMemoryControllerSchema.methods.activate = function () {
    this.active = true;
    this.version += 1;

    return this.save();
};

// ======================================================
// 🔹 تعطيل الذاكرة
// ======================================================

DreamMemoryControllerSchema.methods.deactivate = function () {
    this.active = false;
    this.version += 1;

    return this.save();
};

// ======================================================
// 🔒 قفل التحكم
// ======================================================

DreamMemoryControllerSchema.methods.lock = function () {
    this.locked = true;
    this.version += 1;

    return this.save();
};

// ======================================================
// 🔓 فتح التحكم
// ======================================================

DreamMemoryControllerSchema.methods.unlock = function () {
    this.locked = false;
    this.version += 1;

    return this.save();
};

// ======================================================
// 🔹 جلب الأوامر النشطة غير المنفذة
// ======================================================

DreamMemoryControllerSchema.methods.getPendingActions =
    function () {
        return this.actions.filter(
            action =>
                action.enabled &&
                !action.executed
        );
    };

// ======================================================
// 🔹 البحث عن ذاكرة مرتبطة بخلية
// ======================================================

DreamMemoryControllerSchema.statics.findByCell =
    function (userId, cellId) {
        return this.findOne({
            userId,
            "location.cellId": cellId,
            active: true
        });
    };

// ======================================================
// 🔹 Model
// ======================================================

const DreamMemoryController =
    mongoose.model(
        "DreamMemoryController",
        DreamMemoryControllerSchema
    );

// ======================================================
// 🔹 التصدير
// ======================================================

module.exports =
    DreamMemoryController;
