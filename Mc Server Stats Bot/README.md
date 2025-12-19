# 🤖 Minecraft Multi-Server Status Bot v4.0

Ein professioneller Discord Bot für Minecraft Server Status Monitoring mit Multi-Language Support.

## ✨ Features

- 🌍 **Multi-Guild Support** - Ein Bot für mehrere Discord Server
- 🌐 **Multi-Language System** - Deutsch & Englisch (+ Custom Languages)
- 🎨 **Vollständig Anpassbar** - Farben, Emojis, Buttons, Texte
- 📊 **Live Status Monitoring** - Automatische Updates
- 🖼️ **Server Icons** - Automatisches Speichern von Server-Favicons
- 🔧 **30 Debug Tools** - Professionelles Testing & Debugging
- ⚙️ **Setup via Discord** - Keine Config-Dateien bearbeiten
- 🔐 **Permissions System** - Granulare Berechtigungssteuerung

## 📦 Installation

```bash
# 1. Repository clonen
git clone https://github.com/yourname/minecraft-status-bot
cd minecraft-status-bot

# 2. Dependencies installieren
npm install

# 3. Config erstellen
cp global-config.example.json global-config.json

# 4. Bot Token eintragen
# Öffne global-config.json und füge deinen Discord Bot Token ein

# 5. Bot starten
node index.js
```

## 🎯 Commands

```
/setup      - Interaktives Setup-Menü
/reload     - Config & Monitoring neu laden
/refresh    - Status-Messages neu erstellen
/botinfo    - Bot Statistiken anzeigen
/checkperms - Bot Berechtigungen prüfen
```

## 🧪 Testing

```bash
# Alle Tests ausführen (Windows)
Test_all_debug_tools.bat

# Alle Tests ausführen (Linux/Mac)
./Test_all_debug_tools.sh

# Einzelne Tests
node Debug/master-debug.js
node Debug/check-config.js
node Debug/token-validator.js
```

## 📁 Projekt Struktur

```
Bot/
├── index.js              # Haupteinstiegspunkt
├── global-config.json    # Bot Token & Defaults
├── package.json          # Dependencies
├── cogs/                 # 12 Module
│   ├── CommandHandler.js
│   ├── ConfigManager.js
│   ├── MessageHandler.js
│   └── ...
├── texts/                # Multi-Language
│   ├── de.json
│   └── en.json
└── Debug/                # 30 Debug Tools
    ├── master-debug.js
    └── ...
```

## 🌐 Neue Sprache hinzufügen

1. Kopiere `texts/en.json` → `texts/es.json`
2. Ändere `_meta` Sektion
3. Übersetze Texte
4. Bot restart → Sprache erscheint automatisch

## 🤝 Contributing

Pull Requests sind willkommen! Bitte:

1. Fork das Repository
2. Branch erstellen (`git checkout -b feature/amazing`)
3. Changes committen (`git commit -m 'Add amazing feature'`)
4. Tests laufen lassen (`Test_all_debug_tools.bat`)
5. Push to branch (`git push origin feature/amazing`)
6. Pull Request öffnen

## 📄 Lizenz

**GNU General Public License v3.0** - Siehe [LICENSE](LICENSE) für Details

### Was bedeutet das?

✅ **Du darfst:**
- Den Bot kostenlos nutzen (privat & kommerziell)
- Den Quellcode ansehen & studieren
- Den Code modifizieren & anpassen
- Modifizierte Versionen weitergeben

⚠️ **Du musst:**
- Diese Lizenz in allen Kopien behalten
- Deine Änderungen unter GPL v3 teilen
- Den Quellcode bereitstellen
- Den Original-Autor nennen

❌ **Du darfst nicht:**
- Den Bot ohne Quellcode verkaufen
- Die Lizenz restriktiver machen
- Copyright-Hinweise entfernen

## 🙏 Credits

**Author:** RedCity Industries | Gamer100309  
**Project:** Minecraft Multi-Server Status Bot v4.0  
**GitHub:** [Gamer100309](https://github.com/Gamer100309)

### Genutzte Libraries:
- [discord.js](https://discord.js.org/) - Discord API Library (Apache-2.0)
- [minecraft-server-util](https://www.npmjs.com/package/minecraft-server-util) - Minecraft Server Status (MIT)

## 📊 Statistiken

- **Lines of Code**: ~5000+
- **Modules**: 12
- **Commands**: 5
- **Debug Tools**: 30
- **Languages**: 2 (+ Custom)

---

**v4.0** - Made with ❤️ by RedCity Industries | Gamer100309  
**License:** GPL v3.0 - Free & Open Source  
**Discord:** Ein Bot für die Community! 🎮
