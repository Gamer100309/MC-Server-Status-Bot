#!/bin/bash

# Farben definieren
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear
echo -e "\n${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}    🔍 DEBUG TOOLS - QUICK INVENTORY CHECK (Linux)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}\n"

# In den Debug-Ordner wechseln
if ! cd Debug 2>/dev/null; then
    echo -e "${RED}❌ Debug folder not found!${NC}"
    echo "Please run this from the bot root directory."
    read -p "Press Enter to exit..."
    exit 1
fi

echo "Scanning Debug folder..."
echo ""

FOUND=0
MISSING=0

echo -e "${GREEN}✅ FOUND FILES:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Dateien auflisten (entspricht dem for %%F in (*.js *.bat *.sh))
for file in *.js *.bat *.sh README.md; do
    if [ -f "$file" ]; then
        echo -e "    ✓ $file"
        ((FOUND++))
    fi
done

echo ""
echo -e "${RED}❌ EXPECTED BUT MISSING:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Liste der erwarteten Dateien
EXPECTED=(
    "performance-monitor.js"
    "backup-manager.js"
    "health-monitor.js"
    "state-cleanup.js"
    "auto-fixer.js"
    "language-validator.js"
)

for file in "${EXPECTED[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "    ✗ $file"
        ((MISSING++))
    fi
done

echo -e "\n${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "    📊 SUMMARY"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}\n"

echo "Found:   $FOUND files"
echo "Missing: $MISSING files"
echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ All expected debug tools are present!${NC}"
else
    echo -e "${YELLOW}⚠️  Some tools are missing. Copy them from the code blocks.${NC}"
fi

echo ""
read -n 1 -s -r -p "Press any key to continue..."
echo ""

cd ..