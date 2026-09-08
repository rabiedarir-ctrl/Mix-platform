"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const app = express();

/* =====================================================
   CONFIG
===================================================== */

const PORT = Number(process.env.PORT) || 3000;

/* =====================================================
   MIDDLEWARE
===================================================== */

const frontendUrl =
    process.env.FRONTEND_URL || "*";

app.use(
    cors({
        origin: frontendUrl,
        credentials: frontendUrl !== "*"
    })
);

app.use(express.json({ limit: "2mb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "2mb"
    })
);

/* =====================================================
   HEALTH
===================================================== */

app.get("/api/health", async (req, res) => {
    const mongoose =
        require("mongoose");

    const connected =
        mongoose.connection.readyState === 1;

    res.status(
        connected ? 200 : 503
    ).json({
        status: connected
            ? "OK"
            : "ERROR",

        database: connected
            ? "Connected"
            : "Disconnected",

        service: "Mix Platform API",

        timestamp:
            new Date().toISOString()
    });
});

/* =====================================================
   API ROUTES
===================================================== */

app.use(
    "/api/users",
    userRoutes
);

/* =====================================================
   ROOT
===================================================== */

app.get("/", (req, res) => {
    res.json({
        name: "Mix Platform API",
        status: "running",
        version: "1.0.0"
    });
});

/* =====================================================
   404
===================================================== */

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        path: req.path
    });
});

/* =====================================================
   ERROR HANDLER
===================================================== */

app.use((error, req, res, next) => {
    console.error(
        "SERVER ERROR:",
        error
    );

    res.status(500).json({
        message:
            "حدث خطأ داخلي في الخادم"
    });
});

/* =====================================================
   START
===================================================== */

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI غير موجود في Environment Variables"
            );
        }

        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET غير موجود في Environment Variables"
            );
        }

        await connectDB();

        app.listen(
            PORT,
            "0.0.0.0",
            () => {
                console.log(
                    `Mix Platform API running on port ${PORT}`
                );
            }
        );

    } catch (error) {
        console.error(
            "STARTUP ERROR:",
            error.message
        );

        process.exit(1);
    }
}

startServer();

module.exports = app;
