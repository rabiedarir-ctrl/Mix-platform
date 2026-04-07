// ===================================================
// Mix Platform - Log Configuration
// ===================================================

const path = require("path");

const logConfig = {
  // مستوى السجلات: error, warn, info, debug
  level: process.env.LOG_LEVEL || "info",

  // =========================
  // ملفات السجلات
  // =========================
  files: {
    root: path.join(__dirname, "../logs"),
    system: path.join(__dirname, "../logs/system.log"),
    backend: path.join(__dirname, "../logs/backend.log"),
    cache: path.join(__dirname, "../logs/cache.log"),
    access: path.join(__dirname, "../logs/access.log")
  },

  // =========================
  // تدوير Logs
  // =========================
  rotation: {
    enabled: process.env.LOG_ROTATION_ENABLED === "true" || true,
    maxSize: process.env.LOG_ROTATION_MAXSIZE || "5MB",
    maxFiles: parseInt(process.env.LOG_ROTATION_MAXFILES, 10) || 5
  },

  // =========================
  // تنسيقات
  // =========================
  format: {
    timestamp: true,
    colorize: process.env.LOG_COLORIZE === "true" || true,
    json: process.env.LOG_JSON === "true" || false
  },

  // =========================
  // Helpers
  // =========================
  helpers: {
    getFile(type) {
      return logConfig.files[type] || logConfig.files.backend;
    },
    isRotationEnabled() {
      return logConfig.rotation.enabled;
    }
  }
};

module.exports = logConfig;
