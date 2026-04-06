require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// 🔹 إنشاء التطبيق
const app = express();

// ===============================
// ⚙️ ENV CONFIG
// ===============================
const PORT = process.env.BACKEND_PORT || 3000;
const API_BASE = process.env.API_BASE || "/api";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// ===============================
// 🔐 MIDDLEWARE
// ===============================

// CORS
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// JSON Parser
app.use(express.json());

// ===============================
// 📁 ضمان وجود مجلدات التخزين
// ===============================
const storagePath = path.join(__dirname, "../storage");
const logsPath = path.join(__dirname, "../logs");

if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath, { recursive: true });
}

// ===============================
// 🧪 HEALTH CHECK API
// ===============================
app.get(`${API_BASE}/health`, (req, res) => {
  res.json({
    status: "OK",
    service: "Mix Platform API",
    time: new Date(),
  });
});

// ===============================
// 🔗 ROUTES (ربط تدريجي)
// ===============================

try {
  const userRoutes = require("./routes/userRoutes");
  app.use(`${API_BASE}/users`, userRoutes);
} catch (e) {
  console.warn("⚠️ userRoutes not found");
}

try {
  const socialRoutes = require("./routes/socialRoutes");
  app.use(`${API_BASE}/social`, socialRoutes);
} catch (e) {
  console.warn("⚠️ socialRoutes not found");
}

try {
  const walletRoutes = require("./routes/walletRoutes");
  app.use(`${API_BASE}/wallet`, walletRoutes);
} catch (e) {
  console.warn("⚠️ walletRoutes not found");
}

try {
  const gameRoutes = require("./routes/gameRoutes");
  app.use(`${API_BASE}/games`, gameRoutes);
} catch (e) {
  console.warn("⚠️ gameRoutes not found");
}

try {
  const dreamRoutes = require("./routes/dreamRoutes");
  app.use(`${API_BASE}/dreams`, dreamRoutes);
} catch (e) {
  console.warn("⚠️ dreamRoutes not found");
}

// ===============================
// 🌐 STATIC FILES (اختياري)
// ===============================
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/storage", express.static(path.join(__dirname, "../storage")));

// ===============================
// ❌ 404 HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ===============================
// 🚨 ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// ===============================
// 🚀 START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Mix Platform running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}${API_BASE}`);
});
