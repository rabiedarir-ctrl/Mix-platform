#!/bin/bash
# ==========================================
# Mix Platform - Setup & Run Script
# ==========================================

echo "════════════════════════════════════════"
echo "🚀 Mix Platform - Setup & Run"
echo "════════════════════════════════════════"

# الألوان
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ===========================
# 1. التحقق من Node.js و npm
# ===========================
echo -e "${BLUE}1️⃣  التحقق من البيئة...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js غير مثبت. يرجى تثبيته من: https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js موجود: $(node --version)${NC}"
echo -e "${GREEN}✅ npm موجود: $(npm --version)${NC}"

# ===========================
# 2. التحقق من ملف .env
# ===========================
echo ""
echo -e "${BLUE}2️⃣  التحقق من .env...${NC}"

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  ملف .env غير موجود. جاري الإنشاء من env.example...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ تم إنشاء .env${NC}"
else
    echo -e "${GREEN}✅ .env موجود${NC}"
fi

# ===========================
# 3. تثبيت Backend Dependencies
# ===========================
echo ""
echo -e "${BLUE}3️⃣  تثبيت Backend Dependencies...${NC}"

if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⏳ جاري تثبيت npm packages...${NC}"
    cd backend
    npm install
    cd ..
    echo -e "${GREEN}✅ تم تثبيت Dependencies${NC}"
else
    echo -e "${GREEN}✅ Dependencies موجود${NC}"
fi

# ===========================
# 4. إنشاء مجلدات Storage
# ===========================
echo ""
echo -e "${BLUE}4️⃣  إنشاء مجلدات التخزين...${NC}"

mkdir -p storage/logs
mkdir -p backend/logs
mkdir -p frontend/assets/{models,textures,audio,icons}
mkdir -p frontend/static

echo -e "${GREEN}✅ تم إنشاء المجلدات${NC}"

# ===========================
# 5. خيار البدء
# ===========================
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ التحضير اكتمل!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}اختر الخيار:${NC}"
echo "1️⃣  تشغيل Backend فقط (npm start)"
echo "2️⃣  تشغيل Backend بـ watch mode (npm run dev)"
echo "3️⃣  تشغيل مع Frontend Server (live-server)"
echo "4️⃣  تشغيل مع Docker (docker-compose)"
echo "5️⃣  الخروج"
echo ""
read -p "اختر رقم الخيار (1-5): " choice

case $choice in
    1)
        echo -e "${GREEN}🚀 تشغيل Backend...${NC}"
        cd backend
        npm start
        ;;
    2)
        echo -e "${GREEN}🚀 تشغيل Backend بـ watch mode...${NC}"
        cd backend
        npm run dev
        ;;
    3)
        echo -e "${GREEN}🚀 تشغيل Frontend + Backend...${NC}"
        if ! command -v live-server &> /dev/null; then
            echo -e "${YELLOW}⚠️  live-server غير مثبت. جاري التثبيت...${NC}"
            npm install -g live-server
        fi
        
        # بدء Backend في الخلفية
        cd backend
        npm start &
        BACKEND_PID=$!
        cd ..
        
        # انتظر قليلاً لبدء Backend
        echo -e "${YELLOW}⏳ انتظر بدء Backend...${NC}"
        sleep 3
        
        # بدء Frontend
        echo -e "${GREEN}🌐 بدء Frontend على http://localhost:8080${NC}"
        cd frontend
        live-server --port=8080 --entry-file=html/login.html
        
        # عند الإغلاق، اغلق Backend أيضاً
        kill $BACKEND_PID
        ;;
    4)
        echo -e "${GREEN}🚀 تشغيل مع Docker...${NC}"
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}❌ Docker غير مثبت${NC}"
            exit 1
        fi
        docker-compose up
        ;;
    5)
        echo -e "${GREEN}👋 مع السلامة!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ خيار غير صحيح${NC}"
        exit 1
        ;;
esac