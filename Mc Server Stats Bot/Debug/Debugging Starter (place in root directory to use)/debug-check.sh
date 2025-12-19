#!/bin/bash

# Farben für die Ausgabe definieren
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fenster-Titel setzen (funktioniert in den meisten Linux-Terminals)
echo -ne "\033]0;MC Discord Stats Bot - Debug Check\007"

# Sicherstellen, dass wir im Verzeichnis des Skripts arbeiten
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${CYAN}========================================${NC}"
echo -e "    🔍 MC Status Bot - Debug Check"
echo -e "${CYAN}========================================${NC}"
echo ""

# Master Debug ausführen
if [ -f "Debug/master-debug.js" ]; then
    node Debug/master-debug.js
else
    echo -e "${RED}❌ Debug/master-debug.js nicht gefunden!${NC}"
    exit 1
fi

# Prüfen des Exit-Codes (entspricht errorlevel)
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}    ❌ DEBUG FEHLGESCHLAGEN${NC}"
    echo -e "${RED}========================================${NC}"
    echo "Bitte behebe die oben genannten Fehler."
    echo ""
    read -p "Drücken Sie die Eingabetaste zum Beenden..."
else
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}    ✅ ALLE CHECKS BESTANDEN${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    # Abfrage zum Starten des Bots
    read -p "Möchtest du den Bot jetzt starten? (J/N): " start
    
    if [[ "$start" =~ ^[Jj]$ ]]; then
        clear
        if [ -f "index.js" ]; then
            node index.js
        else
            echo -e "${RED}❌ index.js nicht im Hauptverzeichnis gefunden!${NC}"
        fi
    fi
fi