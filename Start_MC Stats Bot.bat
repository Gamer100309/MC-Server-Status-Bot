@echo off
chcp 65001 >nul
title MC Discord Stats Bot - RedCity Industries

cd /d "%~dp0"
set "BOT_FOLDER=Mc Server Stats Bot"

if not exist "%BOT_FOLDER%" (
    echo [❌] Error: Folder "%BOT_FOLDER%" not found.
    pause
    exit /b
)

cd "%BOT_FOLDER%"

:restart
cls
echo =====================================
echo    🚀 Minecraft Discord Stats Bot
echo =====================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [❌] Node.js not found. Please install it from https://nodejs.org/
    pause
    exit /b
)

if not exist "node_modules" (
    echo [📦] Installing dependencies...
    call npm install
)

echo [✅] Bot is running...
node index.js

echo --------------------------------
echo [⚠️] Bot stopped or crashed. Restarting in 5s...
timeout /t 5
goto restart