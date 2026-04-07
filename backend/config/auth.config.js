// ===================================================
// Mix Platform - Authentication Configuration
// ===================================================

require("dotenv").config();

const authConfig = {
  // =========================
  // تفعيل المصادقة
  // =========================
  enabled: process.env.AUTH_ENABLED === "true" || true,

  // =========================
  // إعدادات JWT
  // =========================
  jwt: {
    enabled: process.env.JWT_ENABLED === "true" || true,
    secret: process.env.JWT_SECRET || "mix_secret_key",
    expiresIn: process.env.JWT_EXPIRES || "7d",
    algorithm: process.env.JWT_ALGO || "HS256"
  },

  // =========================
  // سياسات كلمات المرور
  // =========================
  passwordPolicy: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8,
    maxLength: parseInt(process.env.PASSWORD_MAX_LENGTH, 10) || 64,
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS === "true" || true,
    requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL === "true" || true,
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPER === "true" || true
  },

  // =========================
  // صلاحيات المستخدمين
  // =========================
  roles: {
    admin: ["create", "read", "update", "delete", "manage"],
    user: ["read", "update"],
    guest: ["read"]
  },

  // =========================
  // محاولات الدخول
  // =========================
  loginAttempts: {
    maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
    lockTime: parseInt(process.env.LOGIN_LOCK_TIME, 10) || 15 * 60 * 1000 // 15 دقيقة
  },

  // =========================
  // Helpers
  // =========================
  helpers: {
    isAuthEnabled() {
      return authConfig.enabled;
    },
    isJWTEnabled() {
      return authConfig.jwt.enabled;
    },
    getJWTOptions() {
      return {
        secret: authConfig.jwt.secret,
        expiresIn: authConfig.jwt.expiresIn,
        algorithm: authConfig.jwt.algorithm
      };
    },
    getRoles() {
      return Object.keys(authConfig.roles);
    }
  }
};

module.exports = authConfig;
