#!/bin/bash

# Verzeichnis der Datei ermitteln und hineinwechseln
cd "$(dirname "$0")"
BOT_FOLDER="Mc Server Stats Bot"

# Prüfen, ob der Bot-Ordner existiert
if [ ! -d "$BOT_FOLDER" ]; then
    echo "❌ Error: Folder '$BOT_FOLDER' not found."
    exit 1
fi

cd "$BOT_FOLDER"

while true; do
    clear
    echo "====================================="
    echo "   🚀 Minecraft Discord Stats Bot"
    echo "====================================="
    echo ""

    # Prüfen, ob Node.js installiert ist
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found. Please install it."
        exit 1
    fi

    # Abhängigkeiten prüfen
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi

    # Bot starten
    echo "✅ Bot is running..."
    node index.js

    echo "--------------------------------"
    echo "⚠️  Bot stopped or crashed. Restarting in 5s..."
    sleep 5
done