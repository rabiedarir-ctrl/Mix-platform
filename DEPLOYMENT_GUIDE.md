# ==========================================
# Mix Platform - Database & Deployment
# ==========================================

## 🗄️ إعداد قاعدة البيانات (MongoDB)

### خطوات التثبيت:

#### 1. الحصول على MongoDB Atlas (مجاني)

1. اذهب إلى: https://www.mongodb.com/cloud/atlas
2. سجل حساب جديد (مجاني)
3. أنشئ مشروع (Project)
4. أنشئ cluster (مجاني - 512 MB)
5. انسخ Connection String

#### 2. تحديث .env

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mix-platform?retryWrites=true&w=majority
DB_NAME=mix-platform

# Production
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this
```

#### 3. تثبيت MongoDB Compass (اختياري)

- تحميل: https://www.mongodb.com/products/compass
- يتيح عرض البيانات بصريًا

---

## 🚀 النشر على Vercel

### أسهل طريقة للـ Frontend

#### الخطوة 1: إعداد Vercel

```bash
# 1. تثبيت Vercel CLI
npm install -g vercel

# 2. تسجيل الدخول
vercel login

# 3. نشر المشروع
vercel
```

#### الخطوة 2: إعدادات Vercel

في مجلد `frontend` أنشئ `vercel.json`:

```json
{
  "buildCommand": "echo 'Frontend ready'",
  "outputDirectory": "."
}
```

#### الخطوة 3: متغيرات البيئة

في لوحة التحكم Vercel:

```
Env Variables:
VITE_API_BASE=https://your-backend.herokuapp.com/api
MIX_API_BASE=https://your-backend.herokuapp.com/api
```

---

## 🏗️ النشر على Heroku (Backend)

### الخطوة 1: إعداد Heroku

```bash
# 1. إنشاء حساب Heroku
# https://www.heroku.com/

# 2. تثبيت Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 3. تسجيل الدخول
heroku login

# 4. إنشاء تطبيق
heroku create mix-platform-backend

# 5. إضافة MongoDB
heroku addons:create mongolab:sandbox --app=mix-platform-backend
```

### الخطوة 2: متغيرات البيئة في Heroku

```bash
heroku config:set \
  NODE_ENV=production \
  JWT_SECRET="your-super-secret-key" \
  --app=mix-platform-backend

# التحقق
heroku config --app=mix-platform-backend
```

### الخطوة 3: ملف Procfile

في جذر المشروع:

```
web: cd backend && node server.js
```

### الخطوة 4: النشر

```bash
# 1. إضافة جميع التغييرات
git add .
git commit -m "Ready for deployment"

# 2. دفع إلى Heroku
git push heroku main

# 3. عرض السجلات
heroku logs --tail --app=mix-platform-backend

# 4. الرابط
heroku open --app=mix-platform-backend
```

---

## ☁️ النشر على AWS (متقدم)

### خيار EC2:

```bash
# 1. إنشاء instance EC2
# - اختر Ubuntu 20.04 LTS
# - افتح ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000

# 2. الاتصال والإعداد
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. تثبيت البرامج
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 4. استنساخ المستودع
git clone https://github.com/rabiedarir-ctrl/Mix-platform.git
cd Mix-platform

# 5. تثبيت Dependencies
cd backend && npm install

# 6. إعداد .env
nano .env
# أضف متغيراتك

# 7. استخدام PM2 للإبقاء على الخادم
sudo npm install -g pm2
pm2 start backend/server.js --name "mix-backend"
pm2 save
pm2 startup

# 8. إعداد Nginx كـ Reverse Proxy
sudo apt install -y nginx
```

ملف Nginx (`/etc/nginx/sites-available/default`):

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# تفعيل الموقع
sudo nginx -t
sudo systemctl restart nginx

# إضافة SSL مع Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🐳 النشر مع Docker

### على أي خادم:

```bash
# 1. تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. بناء الصورة
docker build -t mix-platform .

# 3. تشغيل
docker run -d \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-secret" \
  -p 3000:3000 \
  --name mix-backend \
  mix-platform

# 4. عرض السجلات
docker logs -f mix-backend
```

---

## 📋 قائمة التحقق قبل النشر

- [ ] تثبيت MongoDB و الحصول على Connection String
- [ ] تحديث .env بقيم الإنتاج
- [ ] تغيير JWT_SECRET إلى قيمة آمنة
- [ ] اختبار التطبيق محليًا
- [ ] إضافة Procfile
- [ ] إضافة .gitignore للـ node_modules
- [ ] دفع المشروع إلى GitHub
- [ ] ربط Heroku بـ GitHub
- [ ] إعداد Vercel للـ Frontend
- [ ] اختبار الـ API endpoints
- [ ] إضافة CORS headers الصحيحة
- [ ] فعّل HTTPS
- [ ] ضبط قاعدة البيانات الاحتياطية

---

## 🔧 أوامر مفيدة

### Heroku:

```bash
# عرض السجلات
heroku logs --tail

# تشغيل أمر مرة واحدة
heroku run node backend/server.js

# إعادة التشغيل
heroku restart

# تسميات للمراحل
heroku labels:add staging
```

### GitHub Actions (CI/CD تلقائي):

أنشئ `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "mix-platform-backend"
          heroku_email: ${{secrets.HEROKU_EMAIL}}
```

---

## 🌐 المجالات المخصصة

### شراء مجال:

1. **Namecheap** (رخيص)
2. **GoDaddy**
3. **Google Domains**

### ربط مع Heroku:

```bash
# 1. إضافة المجال
heroku domains:add www.example.com

# 2. في مزود المجال، أضف:
CNAME record pointing to your-app.herokuapp.com

# 3. التحقق
heroku domains
```

### ربط مع Vercel:

- في لوحة تحكم Vercel
- اختر Project → Settings → Domains
- أضف المجال
- اتبع التعليمات

---

## 📊 مراقبة الأداء

### Heroku Metrics:

```bash
heroku metrics
```

### MongoDB Monitoring:

- في Atlas Dashboard
- Real-time metrics و alerts

### New Relic (مجاني):

```bash
npm install newrelic
require('newrelic');  # في بداية server.js
```

---

## 🔒 الأمان

### قبل النشر:

1. **لا تضع كلمات السر في Git**
   ```bash
   echo .env >> .gitignore
   ```

2. **استخدم متغيرات البيئة**
   ```javascript
   const secret = process.env.JWT_SECRET;
   ```

3. **فعّل HTTPS**
   ```bash
   # Let's Encrypt
   certbot --nginx -d yourdomain.com
   ```

4. **صحح CORS**
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com'
   }));
   ```

---

## 🎯 ملخص المراحل

```
المرحلة 1: التطوير المحلي ✓ (مكتمل)
    ↓
المرحلة 2: إعداد قاعدة البيانات
    → MongoDB Atlas
    → تحديث connection string
    ↓
المرحلة 3: النشر
    → Backend: Heroku
    → Frontend: Vercel
    → Database: MongoDB Atlas
    ↓
المرحلة 4: المراقبة و الصيانة
    → Logs و Metrics
    → Auto-scaling
    → Backups
```

---

## 📞 الدعم

- Heroku Documentation: https://devcenter.heroku.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Vercel: https://vercel.com/docs
- AWS: https://aws.amazon.com/documentation

---

**هل تريد مساعدة في خطوة معينة؟ اخبرني!** 🚀
