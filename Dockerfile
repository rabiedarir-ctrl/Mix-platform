# ===============================
# 🚀 MIX PLATFORM - DOCKERFILE
# ===============================

# 🔹 استخدام نسخة خفيفة من Node.js
FROM node:18-alpine

# 🔹 إنشاء مجلد العمل
WORKDIR /app

# 🔹 نسخ ملفات package.json أولاً (لتسريع الكاش)
COPY backend/package*.json ./backend/

# 🔹 تثبيت dependencies
WORKDIR /app/backend
RUN npm install

# 🔹 الرجوع للجذر ونسخ باقي المشروع
WORKDIR /app
COPY . .

# 🔹 إنشاء مجلدات التخزين إذا لم تكن موجودة
RUN mkdir -p storage logs

# 🔹 فتح المنفذ
EXPOSE 3000

# 🔹 تشغيل السيرفر
WORKDIR /app/backend
CMD ["node", "server.js"]
