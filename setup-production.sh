#!/bin/bash
# ==========================================
# Mix Platform - Production Setup
# ==========================================

echo "🚀 Mix Platform - Production Setup"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Directories
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
STORAGE_DIR="$PROJECT_DIR/storage"
LOGS_DIR="$PROJECT_DIR/logs"

echo -e "${BLUE}📁 Project Directory: $PROJECT_DIR${NC}"

# ===========================
# 1. Create directories
# ===========================
echo ""
echo -e "${BLUE}1️⃣  Creating directories...${NC}"

mkdir -p "$STORAGE_DIR"/{cache,backups}
mkdir -p "$LOGS_DIR"
mkdir -p "$BACKEND_DIR/logs"
mkdir -p "$FRONTEND_DIR/assets"/{models,textures,audio,icons}
mkdir -p "$FRONTEND_DIR/static"

echo -e "${GREEN}✅ Directories created${NC}"

# ===========================
# 2. Check and create .env
# ===========================
echo ""
echo -e "${BLUE}2️⃣  Checking environment variables...${NC}"

if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  .env not found${NC}"
    echo -e "${YELLOW}📝 Creating from env.example...${NC}"
    cp "$PROJECT_DIR/env.example" "$PROJECT_DIR/.env"
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env with production values!${NC}"
else
    echo -e "${GREEN}✅ .env exists${NC}"
    echo -e "${YELLOW}⚠️  Make sure JWT_SECRET is set to a strong value${NC}"
fi

# ===========================
# 3. Install dependencies
# ===========================
echo ""
echo -e "${BLUE}3️⃣  Installing dependencies...${NC}"

cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Backend dependencies...${NC}"
    npm install --production
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Backend dependencies exist${NC}"
    npm update
fi

cd "$PROJECT_DIR"

# ===========================
# 4. Set permissions
# ===========================
echo ""
echo -e "${BLUE}4️⃣  Setting permissions...${NC}"

chmod 755 "$STORAGE_DIR"
chmod 755 "$LOGS_DIR"
chmod 755 "$BACKEND_DIR/logs"
chmod 644 "$PROJECT_DIR/.env"

echo -e "${GREEN}✅ Permissions set${NC}"

# ===========================
# 5. Database initialization
# ===========================
echo ""
echo -e "${BLUE}5️⃣  Initializing storage...${NC}"

# Create JSON files if they don't exist
for file in users social messages wallets dreams dream_worlds; do
    if [ ! -f "$STORAGE_DIR/$file.json" ]; then
        echo "[]" > "$STORAGE_DIR/$file.json"
        echo -e "${GREEN}✅ Created $file.json${NC}"
    fi
done

# ===========================
# 6. Summary
# ===========================
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Production setup completed!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Edit .env with production values"
echo "2. Set up a reverse proxy (Nginx/Apache)"
echo "3. Configure SSL/TLS certificates"
echo "4. Set up process manager (PM2/Supervisor)"
echo "5. Configure database (MongoDB/PostgreSQL)"
echo ""
echo -e "${YELLOW}🚀 To start production server:${NC}"
echo "   cd backend"
echo "   NODE_ENV=production npm start"
echo ""
echo -e "${YELLOW}📊 Using PM2 (recommended):${NC}"
echo "   npm install -g pm2"
echo "   pm2 start backend/server.js --name mix-backend"
echo "   pm2 start backend/server.js --name mix-backend -- NODE_ENV=production"
echo ""
echo -e "${GREEN}Happy deploying! 🎉${NC}"
