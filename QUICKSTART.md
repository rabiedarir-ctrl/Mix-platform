# 🎉 Mix Platform - دليل البدء السريع

> منصة متكاملة لإدارة الطاقة، الخلايا، الألعاب، الشبكات الاجتماعية، وعالم الأحلام ثلاثي الأبعاد.

## 📦 الميزات

✨ **الميزات الأساسية:**
- 🔐 نظام مصادقة JWT آمن
- 📊 لوحة تحكم شخصية
- 🧬 نظام الخلايا والطاقة
- 🎮 ألعاب مدمجة (BTC Game)
- 🌙 محرك الأحلام والعوالم الافتراضية
- 💬 شبكات اجتماعية ومراسلات
- 💰 محفظة رقمية
- 🌐 عالم Metaverse ثلاثي الأبعاد

---

## 🚀 البدء السريع

### **الخطوة 1: استنساخ المستودع**

```bash
git clone https://github.com/rabiedarir-ctrl/Mix-platform.git
cd Mix-platform
```

### **الخطوة 2: تشغيل السكريبت التلقائي**

**Linux / macOS:**
```bash
chmod +x run.sh
./run.sh
```

**Windows:**
```bash
run.bat
```

### **الخطوة 3: اختيار الخيار**

السكريبت سيعرض عليك الخيارات:
- **1️⃣ Backend فقط** - للاختبار والتطوير
- **2️⃣ Backend مع watch mode** - للتطوير السريع
- **3️⃣ Backend + Frontend** - للعمل الكامل
- **4️⃣ Docker** - للبيئة معزولة

### **الخطوة 4: الوصول للموقع**

```
🌐 Frontend: http://localhost:8080
🔧 Backend: http://localhost:3000
📊 API: http://localhost:3000/api
```

---

## 📝 بيانات الاختبار

```
📧 البريد: test@example.com
🔑 كلمة المرور: 123456
```

---

## 📚 أدلة مفصلة

- **[دليل التشغيل المحلي](./SETUP_GUIDE.md)** - شرح مفصل لكل الخيارات
- **[تقرير الإصلاح](./README_FIX.md)** - المشاكل التي تم إصلاحها
- **[README الأصلي](./README.md)** - معلومات المشروع

---

## 🛠️ المتطلبات

- **Node.js v14+** ([تحميل](https://nodejs.org/))
- **npm** (يأتي مع Node.js)
- **Docker** (اختياري) ([تحميل](https://www.docker.com/))

---

## 📂 هيكل المشروع

```
📁 Mix-platform/
├── 📄 index.html                    # الصفحة الرئيسية
├── 📄 .env                          # متغيرات البيئة
├── 🚀 run.sh / run.bat              # سكريبتات البدء
├── 📁 frontend/                     # واجهة المستخدم
│   ├── html/                        # صفحات HTML
│   ├── static/                      # CSS و JavaScript
│   └── assets/                      # الموارد (صور، نماذج، صوت)
├── 📁 backend/                      # الخادم
│   ├── server.js                    # الملف الرئيسي
│   └── package.json                 # Dependencies
└── 📁 storage/                      # بيانات التخزين
```

---

## 🔌 نقاط النهاية (Endpoints)

### **المصادقة:**
- `POST /api/users/login` - تسجيل الدخول
- `POST /api/users/register` - إنشاء حساب
- `GET /api/users/me` - بيانات المستخدم

### **الشبكات الاجتماعية:**
- `GET /api/social/posts` - جلب المنشورات
- `POST /api/social/posts` - إنشاء منشور

### **الألعاب:**
- `POST /api/games/btc/start` - بدء اللعبة

### **المتجر:**
- `GET /api/store/items` - المنتجات

### **المحفظة:**
- `GET /api/wallet/:userId/balance` - الرصيد

---

## 🐳 البدء مع Docker

```bash
# بناء الصور
docker-compose build

# تشغيل الخدمات
docker-compose up

# في الخلفية
docker-compose up -d

# عرض السجلات
docker-compose logs -f

# إيقاف
docker-compose down
```

---

## 🔍 استكشاف الأخطاء

### **Backend لا يعمل؟**
```bash
cd backend
npm install
npm start
```

### **Frontend لا يتصل بـ Backend؟**
- تحقق من `.env`
- افتح Developer Tools (F12) واذهب لـ Network tab
- تحقق من الطلبات الفاشلة

### **Port مشغول؟**
```bash
# غير المنفذ في .env
live-server --port=9000
```

---

## 📖 للمزيد من المعلومات

📚 [اقرأ دليل التشغيل الكامل](./SETUP_GUIDE.md)

---

## 📄 الترخيص

Apache License 2.0 - اقرأ [LICENSE](./LICENSE)

---

## 👨‍💻 المطور

**Darir Rabie** - [GitHub Profile](https://github.com/rabiedarir-ctrl)

---

**🎉 استمتع بالتطوير!**