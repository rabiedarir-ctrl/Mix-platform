#!/bin/bash

# ===================================================
# Mix Platform - Unified Start Script
# ===================================================
# هذا السكريبت يقوم بتشغيل Backend و Frontend
# مع التأكد من وجود ملفات البيئة وتحميل cache
# ===================================================

# ---------- إعداد البيئة ----------
echo "🔹 تحقق من ملفات البيئة..."
ENV_FILE="./.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "⚠️  ملف البيئة غير موجود! انسخ .env.example إلى .env"
  cp .env.example .env
fi

# ---------- تشغيل Backend ----------
echo "🚀 تشغيل Backend..."
cd backend || { echo "❌ مجلد backend غير موجود!"; exit 1; }

# تثبيت الاعتماديات إذا لم تكن مثبتة
if [ ! -d "node_modules" ]; then
  echo "📦 تثبيت الاعتماديات..."
  npm install
fi

# تشغيل السيرفر
echo "🎯 بدء السيرفر على المنفذ 3000..."
node server.js &
BACKEND_PID=$!
echo "✅ Backend يعمل بالـ PID: $BACKEND_PID"

# ---------- تشغيل Frontend ----------
echo "🚀 تشغيل Frontend..."
cd ../frontend || { echo "❌ مجلد frontend غير موجود!"; exit 1; }

# تثبيت الاعتماديات إذا لزم الأمر
if [ ! -d "node_modules" ]; then
  echo "📦 تثبيت الاعتماديات..."
  npm install
fi

# تشغيل Frontend (مثلاً إذا تستخدم live server أو http-server)
npx live-server ./ --port=8080 &
FRONTEND_PID=$!
echo "✅ Frontend يعمل بالـ PID: $FRONTEND_PID"

# ---------- مراقبة السيرفر ----------
echo "🔹 Mix Platform بدأ بنجاح!"
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:8080"
echo "📌 لمقاطعة التشغيل: استخدم CTRL+C"

# ---------- انتظار العمليات ----------
wait $BACKEND_PID $FRONTEND_PID
