# 🚀 Mix Platform - دليل التشغيل المحلي

## نظرة عامة

هذا الدليل يشرح كيفية تشغيل منصة Mix Platform محليًا على جهازك.

---

## 📋 المتطلبات

### **المتطلبات الأساسية:**
- **Node.js v14+** ([تحميل](https://nodejs.org/))
- **npm** (يأتي مع Node.js)
- **Git** (اختياري)

### **المتطلبات الإضافية (للخيارات المتقدمة):**
- **Docker** ([تحميل](https://www.docker.com/)) - للتشغيل مع Docker
- **live-server** (سيُثبت تلقائياً)

---

## ⚡ البدء السريع

### **Linux / macOS:**

```bash
# 1. استنساخ المستودع
git clone https://github.com/rabiedarir-ctrl/Mix-platform.git
cd Mix-platform

# 2. تشغيل السكريبت
chmod +x run.sh
./run.sh

# 3. اختر الخيار 1 أو 2 أو 3
```

### **Windows:**

```bash
# 1. استنساخ المستودع
git clone https://github.com/rabiedarir-ctrl/Mix-platform.git
cd Mix-platform

# 2. تشغيل السكريبت
run.bat

# 3. اختر الخيار 1 أو 2 أو 3
```

---

## 🔧 الخيارات المتاحة

### **الخيار 1: Backend فقط**

```bash
cd backend
npm install  # (إذا لم يُثبت من قبل)
npm start
```

**النتيجة:**
- Backend يعمل على `http://localhost:3000`
- API متاح على `http://localhost:3000/api`

**الاستخدام:**
- للتطوير والاختبار
- استخدام Postman أو curl لاختبار APIs
- تطوير Frontend بشكل منفصل

---

### **الخيار 2: Backend مع Watch Mode**

```bash
cd backend
npm install  # (إذا لم يُثبت من قبل)
npm run dev
```

**المميزات:**
- إعادة تشغيل تلقائية عند تعديل الملفات
- أسهل للتطوير السريع

---

### **الخيار 3: Backend + Frontend معاً**

```bash
# السكريبت يقوم بكل شيء تلقائياً
./run.sh
# اختر الخيار 3
```

**أو يدويًا:**

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install -g live-server  # (مرة واحدة فقط)
live-server --port=8080
```

**النتيجة:**
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:8080`
- يمكن الوصول للموقع من المتصفح مباشرة

---

### **الخيار 4: Docker**

```bash
# تأكد من تثبيت Docker
docker --version

# تشغيل
docker-compose up

# أو في الخلفية
docker-compose up -d
```

**الخدمات:**
- **Backend:** `http://localhost:3000`
- **Frontend:** `http://localhost:8080`
- **Storage:** حاوية منفصلة للبيانات

**إيقاف:**
```bash
docker-compose down
```

---

## 🌐 الوصول للموقع

### **الصفحات الرئيسية:**

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| الرئيسية | `http://localhost:8080/` | الصفحة الأولى |
| الدخول | `http://localhost:8080/frontend/html/login.html` | تسجيل الدخول |
| لوحة التحكم | `http://localhost:8080/frontend/html/dashboard.html` | بيانات المستخدم |
| Health Check | `http://localhost:3000/health` | التحقق من Backend |

---

## 📝 بيانات الاختبار

### **اختبار الدخول:**

```
البريد الإلكتروني: test@example.com
كلمة المرور: 123456 (أي كلمة سر)
```

**ملاحظة:** الآن البيانات توضيحية. في الإنتاج، ستحتاج لقاعدة بيانات حقيقية.

---

## 🔍 استكشاف الأخطاء

### **المشكلة: Backend لا يعمل**

```bash
# 1. تحقق من المنفذ 3000 غير مستخدم
lsof -i :3000  # (Linux/macOS)
netstat -ano | findstr :3000  # (Windows)

# 2. إعادة تشغيل
cd backend
npm install
npm start
```

### **المشكلة: Frontend لا يتصل بـ Backend**

```bash
# 1. تحقق من .env
cat .env
# يجب أن يحتوي على:
# MIX_API_BASE=http://localhost:3000/api

# 2. افتح Developer Tools (F12)
# واذهب إلى Network tab
# ابحث عن الطلبات الفاشلة
```

### **المشكلة: npm install يفشل**

```bash
# 1. احذف node_modules و package-lock.json
rm -rf node_modules package-lock.json

# 2. إعادة التثبيت
npm install

# 3. أو استخدم npm cache clean
npm cache clean --force
npm install
```

### **المشكلة: Port 8080 أو 3000 مشغول**

```bash
# غير المنفذ في .env أو الأوامر
live-server --port=9000  # بدل 8080

# أو قتل العملية
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## 🛠️ أوامر مفيدة

### **Backend:**

```bash
cd backend

# تثبيت Dependencies
npm install

# تشغيل
npm start

# تشغيل مع watch mode
npm run dev

# اختبار
npm test
```

### **Frontend:**

```bash
cd frontend

# تثبيت live-server عالمياً
npm install -g live-server

# تشغيل server
live-server --port=8080

# أو مع إدخال مخصص
live-server --port=8080 --entry-file=html/login.html
```

### **Docker:**

```bash
# بناء الصور
docker-compose build

# تشغيل
docker-compose up

# تشغيل في الخلفية
docker-compose up -d

# عرض السجلات
docker-compose logs -f

# إيقاف
docker-compose stop

# حذف
docker-compose down
```

---

## 📊 هيكل المشروع

```
Mix-platform/
├── index.html              # الصفحة الرئيسية
├── .env                    # متغيرات البيئة
├── run.sh / run.bat        # سكريبتات البدء
│
├── frontend/               # واجهة المستخدم
│   ├── html/              # صفحات HTML
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   └── ...
│   ├── static/            # CSS و JS
│   │   ├── style.css
│   │   ├── pages/
│   │   │   └── api.js
│   │   └── ...
│   └── assets/            # الموارد
│       ├── models/
│       ├── textures/
│       └── audio/
│
├── backend/                # الخادم
│   ├── server.js          # الملف الرئيسي
│   ├── package.json       # Dependencies
│   ├── package-lock.json
│   └── logs/              # السجلات
│
├── storage/                # بيانات التخزين
│   └── logs/
│
└── docker-compose.yml      # تكوين Docker
```

---

## 🚀 الخطوات التالية

### **بعد التشغيل الناجح:**

1. ✅ اختبر صفحة الدخول
2. ✅ حاول تسجيل الدخول
3. ✅ افتح صفحة Dashboard
4. ✅ افتح Developer Tools (F12) وراقب الطلبات
5. ✅ ابدأ التطوير!

---

## 📚 مراجع إضافية

- [README الرئيسي](./README.md)
- [تقرير الإصلاح](./README_FIX.md)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)

---

## ❓ أسئلة شائعة

**س: هل يمكن تشغيل Frontend بدون Backend؟**

ج: نعم! ستعمل الصفحات الثابتة لكن الوظائف التفاعلية ستحتاج Backend.

**س: كيف أغير المنفذ؟**

ج: عدّل في `.env`:
```
BACKEND_PORT=4000
FRONTEND_PORT=9000
```

**س: هل البيانات تُحفظ؟**

ج: حالياً البيانات توضيحية. للبيانات الدائمة، استخدم قاعدة بيانات حقيقية.

---

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من الأخطاء في Console (F12)
2. اقرأ رسائل الخطأ بعناية
3. افتح Issue على GitHub
4. راجع [README_FIX.md](./README_FIX.md)

---

**استمتع بالتطوير! 🎉**