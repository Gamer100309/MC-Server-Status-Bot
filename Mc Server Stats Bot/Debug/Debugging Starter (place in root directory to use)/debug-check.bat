@echo off
chcp 65001 >nul
title MC Discord Stats Bot - Debug Check
color 0B

:: Sicherstellen, dass wir im Hauptverzeichnis arbeiten
cd /d "%~dp0"

echo ========================================
echo    🔍 MC Status Bot - Debug Check
echo ========================================
echo.

:: Master Debug ausführen (sucht jetzt im Ordner Debug/)
node Debug/master-debug.js

if errorlevel 1 (
    color 0C
    echo.
    echo ========================================
    echo    ❌ DEBUG FEHLGESCHLAGEN
    echo ========================================
    echo Bitte behebe die oben genannten Fehler.
    echo.
    pause
) else (
    color 0A
    echo.
    echo ========================================
    echo    ✅ ALLE CHECKS BESTANDEN
    echo ========================================
    echo.
    set /p start="Möchtest du den Bot jetzt starten? (J/N): "
    if /i "%start%"=="J" (
        cls
        node index.js
    )
)