#!/bin/bash
# ==========================================
# Mix Platform - System Check
# ==========================================

echo "========================================"
echo "Mix Platform - System Check"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}[OK]${NC} Node.js: $(node --version)"
else
    echo -e "${RED}[ERROR]${NC} Node.js not found"
    echo "Install from: https://nodejs.org/"
    exit 1
fi

# Check npm
echo ""
echo "Checking npm..."
if command -v npm &> /dev/null; then
    echo -e "${GREEN}[OK]${NC} npm: $(npm --version)"
else
    echo -e "${RED}[ERROR]${NC} npm not found"
    exit 1
fi

# Check Git
echo ""
echo "Checking Git..."
if command -v git &> /dev/null; then
    echo -e "${GREEN}[OK]${NC} Git: $(git --version | cut -d' ' -f3)"
else
    echo -e "${YELLOW}[WARNING]${NC} Git not found (optional)"
fi

# Check Docker
echo ""
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}[OK]${NC} Docker: $(docker --version | cut -d' ' -f3)"
else
    echo -e "${YELLOW}[WARNING]${NC} Docker not found (optional for docker-compose)"
fi

# Check directories
echo ""
echo "Checking directories..."

if [ -d "backend" ]; then
    echo -e "${GREEN}[OK]${NC} backend directory exists"
else
    echo -e "${RED}[ERROR]${NC} backend directory not found"
    exit 1
fi

if [ -d "frontend" ]; then
    echo -e "${GREEN}[OK]${NC} frontend directory exists"
else
    echo -e "${RED}[ERROR]${NC} frontend directory not found"
    exit 1
fi

if [ -d "storage" ]; then
    echo -e "${GREEN}[OK]${NC} storage directory exists"
else
    echo -e "${YELLOW}[WARNING]${NC} storage directory not found (will be created)"
fi

# Check .env
echo ""
echo "Checking .env file..."
if [ -f ".env" ]; then
    echo -e "${GREEN}[OK]${NC} .env file exists"
else
    echo -e "${YELLOW}[WARNING]${NC} .env file not found"
    if [ -f "env.example" ]; then
        echo "Creating from env.example..."
        cp env.example .env
        echo -e "${GREEN}[OK]${NC} .env created"
    fi
fi

# Summary
echo ""
echo "========================================"
echo "System Check Complete"
echo "========================================"
echo ""
echo "You can now run: ./run.sh"
echo ""
