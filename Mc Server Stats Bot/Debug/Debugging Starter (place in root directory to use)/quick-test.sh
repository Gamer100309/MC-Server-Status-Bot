#!/bin/bash

# Farben definieren
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "    🤖 Bot Connection Test"
echo -e "${CYAN}========================================${NC}"
echo ""

# Node.js Check
if ! command -v node &> /dev/null
then
    echo -e "${RED}[❌] Node.js nicht gefunden!${NC}"
    read -p "Drücken Sie die Eingabetaste zum Beenden..."
    exit 1
fi

echo -e "${GREEN}[✅] Node.js gefunden${NC}"
echo ""

# Verzeichnis-Wechsel (entspricht cd /d %~dp0Debug)
# Wir gehen in den Unterordner "Debug", der im selben Verzeichnis wie das Skript liegt
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/Debug" || { echo -e "${RED}[❌] Debug-Ordner nicht gefunden!${NC}"; exit 1; }

echo "Teste Bot-Verbindung zu Discord..."
echo ""

# Live Test ausführen
node test-bot-connection.js

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}[❌] Bot-Test fehlgeschlagen!${NC}"
else
    echo ""
    echo -e "${GREEN}[✅] Bot-Test erfolgreich!${NC}"
fi

echo ""
read -p "Drücken Sie die Eingabetaste zum Beenden..."