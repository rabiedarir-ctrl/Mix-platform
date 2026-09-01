@echo off
REM ==========================================
REM Mix Platform - Check System
REM ==========================================

setlocal enabledelayedexpansion

echo ========================================
echo Mix Platform - System Check
echo ========================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version
if %errorlevel% equ 0 (
    echo [OK] Node.js is installed
) else (
    echo [ERROR] Node.js is not installed
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check npm
echo.
echo Checking npm...
npm --version
if %errorlevel% equ 0 (
    echo [OK] npm is installed
) else (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

REM Check Git
echo.
echo Checking Git...
git --version
if %errorlevel% equ 0 (
    echo [OK] Git is installed
) else (
    echo [WARNING] Git is not installed (optional)
)

REM Check Docker
echo.
echo Checking Docker...
docker --version
if %errorlevel% equ 0 (
    echo [OK] Docker is installed
) else (
    echo [WARNING] Docker is not installed (optional for docker-compose)
)

REM Check .env
echo.
echo Checking .env file...
if exist .env (
    echo [OK] .env file exists
) else (
    echo [WARNING] .env file not found
    echo Creating from env.example...
    if exist env.example (
        copy env.example .env
        echo [OK] .env created
    ) else (
        echo [ERROR] env.example not found
    )
)

REM Check directories
echo.
echo Checking directories...
if exist backend (
    echo [OK] backend directory exists
) else (
    echo [ERROR] backend directory not found
)

if exist frontend (
    echo [OK] frontend directory exists
) else (
    echo [ERROR] frontend directory not found
)

REM Summary
echo.
echo ========================================
echo System Check Complete
echo ========================================
echo.
echo You can now run: run.bat
echo.
pause