@echo off
chcp 65001 >nul
color 0B
cls

echo.
echo ═══════════════════════════════════════════════════════════
echo    🔍 DEBUG TOOLS - QUICK INVENTORY CHECK
echo ═══════════════════════════════════════════════════════════
echo.

cd Debug 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Debug folder not found!
    echo Please run this from the bot root directory.
    pause
    exit /b 1
)

echo Scanning Debug folder...
echo.

set FOUND=0
set MISSING=0

echo ✅ FOUND FILES:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
for %%F in (*.js *.bat *.sh) do (
    echo    ✓ %%F
    set /a FOUND+=1
)
if exist README.md (
    echo    ✓ README.md
    set /a FOUND+=1
)
echo.

echo ❌ EXPECTED BUT MISSING:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if not exist "performance-monitor.js" (
    echo    ✗ performance-monitor.js
    set /a MISSING+=1
)
if not exist "backup-manager.js" (
    echo    ✗ backup-manager.js
    set /a MISSING+=1
)
if not exist "health-monitor.js" (
    echo    ✗ health-monitor.js
    set /a MISSING+=1
)
if not exist "state-cleanup.js" (
    echo    ✗ state-cleanup.js
    set /a MISSING+=1
)
if not exist "auto-fixer.js" (
    echo    ✗ auto-fixer.js
    set /a MISSING+=1
)
if not exist "language-validator.js" (
    echo    ✗ language-validator.js
    set /a MISSING+=1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo    📊 SUMMARY
echo ═══════════════════════════════════════════════════════════
echo.
echo Found:    %FOUND% files
echo Missing:  %MISSING% files
echo.

if %MISSING% EQU 0 (
    color 0A
    echo ✅ All expected debug tools are present!
) else (
    color 0E
    echo ⚠️  Some tools are missing. Copy them from the code blocks.
)

echo.
echo Press any key to continue...
pause >nul

cd ..