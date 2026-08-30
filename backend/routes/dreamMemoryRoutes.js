// ======================================================
// Mix Platform - Dream Memory Routes
// File: backend/routes/dreamMemoryRoutes.js
// ======================================================

"use strict";

const express = require("express");
const router = express.Router();

const DreamMemoryController =
    require("../models/DreamMemoryController");

const { authenticateToken } =
    require("../core/auth");

// ======================================================
// 🔐 التحقق من ملكية الذاكرة
// ======================================================

async function getOwnedMemory(req, res) {
    const memory = await DreamMemoryController.findOne({
        memoryId: req.params.memoryId,
        userId: req.user.userId
    });

    if (!memory) {
        res.status(404).json({
            message: "ذاكرة الحلم غير موجودة"
        });

        return null;
    }

    return memory;
}

// ======================================================
// 🧠 إنشاء ذاكرة حلم
// POST /api/dream-memory
// ======================================================

router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            memoryId,
            name,
            cellId,
            x,
            y,
            z,
            worldState,
            active
        } = req.body;

        if (!memoryId || !cellId) {
            return res.status(400).json({
                message: "memoryId و cellId مطلوبان"
            });
        }

        const existing =
            await DreamMemoryController.findOne({
                memoryId
            });

        if (existing) {
            return res.status(409).json({
                message: "معرف الذاكرة مستخدم مسبقًا"
            });
        }

        const memory =
            await DreamMemoryController.create({
                userId: req.user.userId,

                memoryId: String(memoryId),

                name:
                    name ||
                    "Dream Memory",

                active:
                    active !== false,

                location: {
                    cellId: String(cellId),
                    x: Number(x) || 0,
                    y: Number(y) || 0,
                    z: Number(z) || 0
                },

                worldState:
                    worldState || {}
            });

        return res.status(201).json({
            message: "تم إنشاء ذاكرة الحلم",
            memory
        });

    } catch (error) {

        console.error(
            "CREATE DREAM MEMORY ERROR:",
            error
        );

        return res.status(500).json({
            message: "تعذر إنشاء ذاكرة الحلم"
        });
    }
});

// ======================================================
// 🧠 جلب ذاكرة
// GET /api/dream-memory/:memoryId
// ======================================================

router.get(
    "/:memoryId",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            return res.json(memory);

        } catch (error) {

            console.error(
                "GET DREAM MEMORY ERROR:",
                error
            );

            return res.status(500).json({
                message: "تعذر جلب ذاكرة الحلم"
            });
        }
    }
);

// ======================================================
// 📍 جلب الذاكرة بواسطة الخلية
// GET /api/dream-memory/cell/:cellId
// ======================================================

router.get(
    "/cell/:cellId",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await DreamMemoryController.findByCell(
                    req.user.userId,
                    req.params.cellId
                );

            if (!memory) {
                return res.status(404).json({
                    message:
                        "لا توجد ذاكرة نشطة في هذه الخلية"
                });
            }

            return res.json(memory);

        } catch (error) {

            console.error(
                "GET CELL MEMORY ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "تعذر جلب ذاكرة الخلية"
            });
        }
    }
);

// ======================================================
// 🟢 تفعيل الذاكرة
// PUT /api/dream-memory/:memoryId/activate
// ======================================================

router.put(
    "/:memoryId/activate",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            await memory.activate();

            return res.json({
                message: "تم تفعيل ذاكرة الحلم",
                active: memory.active,
                version: memory.version
            });

        } catch (error) {

            console.error(
                "ACTIVATE MEMORY ERROR:",
                error
            );

            return res.status(500).json({
                message: "تعذر تفعيل الذاكرة"
            });
        }
    }
);

// ======================================================
// 🔴 تعطيل الذاكرة
// PUT /api/dream-memory/:memoryId/deactivate
// ======================================================

router.put(
    "/:memoryId/deactivate",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            await memory.deactivate();

            return res.json({
                message: "تم تعطيل ذاكرة الحلم",
                active: memory.active,
                version: memory.version
            });

        } catch (error) {

            console.error(
                "DEACTIVATE MEMORY ERROR:",
                error
            );

            return res.status(500).json({
                message: "تعذر تعطيل الذاكرة"
            });
        }
    }
);

// ======================================================
// 📍 تحديث موقع الذاكرة
// PUT /api/dream-memory/:memoryId/location
// ======================================================

router.put(
    "/:memoryId/location",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            const location =
                await memory.updateLocation(
                    req.body
                );

            return res.json({
                message: "تم تحديث موقع الذاكرة",
                location,
                version: memory.version
            });

        } catch (error) {

            console.error(
                "UPDATE MEMORY LOCATION ERROR:",
                error
            );

            return res.status(400).json({
                message: error.message
            });
        }
    }
);

// ======================================================
// 🌍 تحديث حالة عالم الحلم
// PUT /api/dream-memory/:memoryId/world
// ======================================================

router.put(
    "/:memoryId/world",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            const worldState =
                await memory.setWorldState(
                    req.body
                );

            return res.json({
                message:
                    "تم تحديث حالة عالم الحلم",

                worldState,

                version:
                    memory.version
            });

        } catch (error) {

            console.error(
                "UPDATE WORLD STATE ERROR:",
                error
            );

            return res.status(400).json({
                message: error.message
            });
        }
    }
);

// ======================================================
// 🎮 إضافة أمر تحكم مسموح
// POST /api/dream-memory/:memoryId/actions
// ======================================================

router.post(
    "/:memoryId/actions",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            const {
                action,
                payload
            } = req.body;

            if (!action) {
                return res.status(400).json({
                    message: "action مطلوب"
                });
            }

            await memory.addAction(
                action,
                payload || {}
            );

            return res.status(201).json({
                message:
                    "تمت إضافة أمر التحكم",

                version:
                    memory.version,

                pendingActions:
                    memory.getPendingActions()
            });

        } catch (error) {

            console.error(
                "ADD MEMORY ACTION ERROR:",
                error
            );

            return res.status(400).json({
                message: error.message
            });
        }
    }
);

// ======================================================
// 🎮 جلب الأوامر غير المنفذة
// GET /api/dream-memory/:memoryId/actions/pending
// ======================================================

router.get(
    "/:memoryId/actions/pending",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            return res.json({
                memoryId:
                    memory.memoryId,

                active:
                    memory.active,

                locked:
                    memory.locked,

                version:
                    memory.version,

                actions:
                    memory.getPendingActions()
            });

        } catch (error) {

            console.error(
                "GET PENDING ACTIONS ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "تعذر جلب أوامر الذاكرة"
            });
        }
    }
);

// ======================================================
// ✅ تسجيل تنفيذ أمر
// PUT /api/dream-memory/:memoryId/actions/:actionId/execute
// ======================================================

router.put(
    "/:memoryId/actions/:actionId/execute",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            if (!memory.canExecute(
                memory.actions.id(
                    req.params.actionId
                )?.action
            )) {
                return res.status(403).json({
                    message:
                        "الذاكرة غير مفعلة أو الأمر غير مسموح"
                });
            }

            const action =
                await memory.markExecuted(
                    req.params.actionId
                );

            return res.json({
                message:
                    "تم تسجيل تنفيذ الأمر",

                action,

                version:
                    memory.version,

                lastSyncAt:
                    memory.lastSyncAt
            });

        } catch (error) {

            console.error(
                "EXECUTE MEMORY ACTION ERROR:",
                error
            );

            return res.status(400).json({
                message: error.message
            });
        }
    }
);

// ======================================================
// 🔒 قفل الذاكرة
// PUT /api/dream-memory/:memoryId/lock
// ======================================================

router.put(
    "/:memoryId/lock",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            await memory.lock();

            return res.json({
                message:
                    "تم قفل ذاكرة التحكم",

                locked:
                    memory.locked
            });

        } catch (error) {

            console.error(
                "LOCK MEMORY ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "تعذر قفل الذاكرة"
            });
        }
    }
);

// ======================================================
// 🔓 فتح الذاكرة
// PUT /api/dream-memory/:memoryId/unlock
// ======================================================

router.put(
    "/:memoryId/unlock",
    authenticateToken,
    async (req, res) => {
        try {

            const memory =
                await getOwnedMemory(req, res);

            if (!memory) return;

            await memory.unlock();

            return res.json({
                message:
                    "تم فتح ذاكرة التحكم",

                locked:
                    memory.locked
            });

        } catch (error) {

            console.error(
                "UNLOCK MEMORY ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "تعذر فتح الذاكرة"
            });
        }
    }
);

// ======================================================
// 🔹 Export
// ======================================================

module.exports = router;
