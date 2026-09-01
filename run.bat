@echo off
REM ==========================================
REM Mix Platform - Setup & Run Script (Windows)
REM ==========================================

setlocal enabledelayedexpansion

echo ========================================
echo Mix Platform - Setup ^& Run
echo ========================================
echo.

REM ===========================
REM 1. Check Node.js and npm
REM ===========================
echo [1] Checking environment...

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js: 
node --version
echo [OK] npm: 
npm --version

REM ===========================
REM 2. Check .env
REM ===========================
echo.
echo [2] Checking .env...

if not exist .env (
    echo [INFO] .env not found. Creating from env.example...
    copy env.example .env
    echo [OK] .env created
) else (
    echo [OK] .env exists
)

REM ===========================
REM 3. Install Backend Dependencies
REM ===========================
echo.
echo [3] Installing Backend Dependencies...

if not exist backend\node_modules (
    echo [INFO] Installing npm packages...
    cd backend
    call npm install
    cd ..
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies exist
)

REM ===========================
REM 4. Create Storage Folders
REM ===========================
echo.
echo [4] Creating storage folders...

if not exist storage\logs mkdir storage\logs
if not exist backend\logs mkdir backend\logs
if not exist frontend\assets\models mkdir frontend\assets\models
if not exist frontend\assets\textures mkdir frontend\assets\textures
if not exist frontend\assets\audio mkdir frontend\assets\audio
if not exist frontend\assets\icons mkdir frontend\assets\icons
if not exist frontend\static mkdir frontend\static

echo [OK] Folders created

REM ===========================
REM 5. Start Options
REM ===========================
echo.
echo ========================================
echo [OK] Setup completed!
echo ========================================
echo.
echo Choose an option:
echo 1 - Run Backend only (npm start)
echo 2 - Run Backend with watch mode (npm run dev)
echo 3 - Run with Frontend Server
echo 4 - Run with Docker (docker-compose)
echo 5 - Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo [INFO] Starting Backend...
    cd backend
    call npm start
) else if "%choice%"=="2" (
    echo [INFO] Starting Backend with watch mode...
    cd backend
    call npm run dev
) else if "%choice%"=="3" (
    echo [INFO] Installing live-server globally...
    npm install -g live-server
    echo [INFO] Starting Backend...
    cd backend
    start npm start
    cd ..
    timeout /t 3
    echo [INFO] Starting Frontend on http://localhost:8080...
    cd frontend
    call live-server --port=8080
) else if "%choice%"=="4" (
    echo [INFO] Starting with Docker...
    call docker-compose up
) else if "%choice%"=="5" (
    echo Goodbye!
    exit /b 0
) else (
    echo ERROR: Invalid choice
    pause
    exit /b 1
)

pause