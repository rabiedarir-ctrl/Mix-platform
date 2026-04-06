#!/bin/bash

# ===================================================
# Mix Platform - Environment & Dependency Checker
# ===================================================
# هذا السكريبت يتحقق من:
# - ملفات البيئة
# - وجود مجلدات backend وfrontend
# - تثبيت الاعتماديات
# - الملفات الأساسية مثل worlds, assets, cache
# ===================================================

echo "🔹 بدء التحقق من بيئة Mix Platform..."

# ---------- التحقق من ملفات البيئة ----------
ENV_FILE="./.env"
if [ -f "$ENV_FILE" ]; then
  echo "✅ ملف البيئة موجود: $ENV_FILE"
else
  echo "⚠️  ملف البيئة غير موجود! انسخ .env.example إلى .env"
fi

# ---------- التحقق من مجلدات المشروع ----------
for DIR in "backend" "frontend" "storage" "storage/worlds" "storage/cache" "assets"; do
  if [ -d "$DIR" ]; then
    echo "✅ المجلد موجود: $DIR"
  else
    echo "❌ المجلد مفقود: $DIR"
  fi
done

# ---------- التحقق من اعتماديات Backend ----------
cd backend || { echo "❌ مجلد backend غير موجود!"; exit 1; }
if [ -d "node_modules" ]; then
  echo "✅ اعتماديات Backend مثبتة"
else
  echo "⚠️ اعتماديات Backend غير مثبتة. استخدم 'npm install'"
fi
cd ..

# ---------- التحقق من اعتماديات Frontend ----------
cd frontend || { echo "❌ مجلد frontend غير موجود!"; exit 1; }
if [ -d "node_modules" ]; then
  echo "✅ اعتماديات Frontend مثبتة"
else
  echo "⚠️ اعتماديات Frontend غير مثبتة. استخدم 'npm install'"
fi
cd ..

# ---------- التحقق من ملفات العوالم ----------
for WORLD in "defaultWorld.json" "dreamWorld.json" "cityWorld.json"; do
  if [ -f "storage/worlds/$WORLD" ]; then
    echo "✅ الملف موجود: storage/worlds/$WORLD"
  else
    echo "❌ الملف مفقود: storage/worlds/$WORLD"
  fi
done

# ---------- التحقق من ملفات cache ----------
if [ -d "storage/cache" ]; then
  echo "✅ مجلد cache موجود"
else
  echo "❌ مجلد cache مفقود"
fi

# ---------- التحقق من ملفات assets ----------
for ASSET in "avatar.glb" "city.glb" "sky.jpg" "ground.png" "ambient.mp3" "dream.mp3"; do
  if [ -f "assets/models/$ASSET" ] || [ -f "assets/textures/$ASSET" ] || [ -f "assets/audio/$ASSET" ]; then
    echo "✅ الملف موجود: $ASSET"
  else
    echo "⚠️ الملف مفقود: $ASSET"
  fi
done

echo "🔹 التحقق اكتمل!"
