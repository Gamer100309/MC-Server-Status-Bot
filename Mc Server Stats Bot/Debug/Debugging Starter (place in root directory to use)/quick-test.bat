@echo off
title MC Discord Stats Bot - Quick Connection Test
color 0B
echo ========================================
echo    🤖 Bot Connection Test
echo ========================================
echo.

:: Node.js Check
where node >nul 2>nul
if errorlevel 1 (
    color 0C
    echo [❌] Node.js nicht gefunden!
    pause
    exit /b
)

echo [✅] Node.js gefunden
echo.

:: WICHTIG: Springe in den Debug-Ordner
cd /d "%~dp0Debug"

echo Teste Bot-Verbindung zu Discord...
echo.

:: Live Test ausführen (jetzt ohne Pfadangabe, da wir schon im Ordner sind)
node test-bot-connection.js

if errorlevel 1 (
    color 0C
    echo.
    echo [❌] Bot-Test fehlgeschlagen!
) else (
    color 0A
    echo.
    echo [✅] Bot-Test erfolgreich!
)

echo.
pause