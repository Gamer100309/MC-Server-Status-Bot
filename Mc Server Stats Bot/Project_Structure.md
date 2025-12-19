# 🤖 Minecraft Multi-Server Status Bot v4.0

## 📁 Projekt Struktur

```
Bot/
├── index.js                    # Haupteinstiegspunkt
├── global-config.json          # Bot Token & Defaults
├── package.json                # Dependencies
├── Project_Structure.md        # Diese Datei - Projekt Dokumentation
│
├── cogs/                       # Modulare Komponenten (12 Module)
│   ├── Logger.js               # Logging System
│   ├── ConfigManager.js        # Config Verwaltung
│   ├── StateManager.js         # Zustandsverwaltung
│   ├── IconManager.js          # Server Icon Handling
│   ├── PermissionManager.js    # Berechtigungssystem
│   ├── StatusChecker.js        # Minecraft Server Abfragen
│   ├── EmbedBuilder.js         # Discord Embed Erstellung
│   ├── MonitoringManager.js    # Status Monitoring
│   ├── CommandHandler.js       # Slash Command Handler
│   ├── InteractionHandler.js   # Button/Menu Handler
│   ├── MessageHandler.js       # Multi-Language Text System
│   └── SetupMenus.js           # Setup Menu Definitionen
│
├── configs/                    # Guild Configs (automatisch erstellt)
│   └── guild_*.json
│
├── states/                     # Message States (automatisch erstellt)
│   └── guild_*.json
│
├── Icons/                      # Server Icons (automatisch erstellt)
│   └── guild_*/
│       ├── online/             # Automatisch gespeicherte Icons
│       └── local/              # Manuell hochgeladene Icons
│
├── texts/                      # Multi-Language Texte
│   ├── de.json                 # Deutsche Übersetzung
│   ├── en.json                 # Englische Übersetzung (Default)
│   └── custom_*.json           # Custom Languages (optional)
│
├── Debug/                      # Debug & Testing Tools (30 Tools)
│   ├── Debug-README.md         # Vollständige Dokumentation
│   ├── /System Report/         # System Reports (automatisch)
│   │
│   ├── Test_all_debug_tools.bat   # 🪟 Testet alle 30 Tools
│   ├── test-all-debug-tools.sh    # 🐧 Linux/Mac Version
│   ├── Quick_Inventory.bat        # ⚡ Zeigt vorhandene Tools
│   ├── quick-inventory.sh         # 🐧 Linux/Mac Version
│   ├── debug-check.bat            # 🚀 Schneller Basis-Check
│   ├── debug-check.sh             # 🐧 Linux/Mac Version
│   │
│   ├── master-debug.js         # 🎯 Haupt-Check (alle Tests)
│   ├── fix-paths.js            # 🔧 Pfad-Fixer für Debug Tools
│   ├── fix-syntax.js           # 🔧 Syntax-Fixer (console.log)
│   │
│   ├── check-config.js         # ✅ Config Validierung
│   ├── check-dependencies.js   # 📦 Package Check
│   ├── check-modules.js        # 🔍 Modul Discovery
│   ├── check-commands.js       # ⚙️ Command Discovery
│   ├── check-languages.js      # 🌐 Sprachen Validierung
│   ├── check-guilds.js         # 🏰 Guild Analyse
│   ├── check-permissions.js    # 🔐 Permission Calculator
│   ├── check-files.js          # 📁 Struktur Validierung
│   ├── test-bot-connection.js  # 🔌 Live Discord Test
│   │
│   ├── performance-monitor.js  # 📊 Performance Metriken
│   ├── error-analyzer.js       # 🔍 Log Analyse
│   ├── config-validator.js     # ✅ Deep Config Check
│   ├── network-test.js         # 🌐 Connectivity Testing
│   ├── status-simulator.js     # 👁️ Status Preview
│   ├── backup-manager.js       # 💾 Backup Verwaltung
│   ├── health-monitor.js       # ❤️ Live Health Monitoring
│   ├── guild-reporter.js       # 📄 Guild Reports
│   ├── token-validator.js      # 🔑 Token Validierung
│   │
│   ├── command-tester.js       # 🎮 Command Simulation
│   ├── state-analyzer.js       # 📊 State File Analyse
│   ├── state-cleanup.js        # 🧹 State Bereinigung
│   ├── message-preview.js      # 👁️ Message Preview (ASCII)
│   ├── emoji-tester.js         # 😀 Emoji Kompatibilität
│   ├── auto-fixer.js           # 🔧 Auto-Fixer
│   ├── language-validator.js   # 🌐 Deep Language Check
│   ├── icon-tester.js          # 🖼️ Icon Testing
│   ├── monitoring-simulator.js # 📡 Monitoring Simulation
│   └── export-report.js        # 📄 System Report Export
│
└── logs/                       # Log Dateien (automatisch erstellt)
    └── bot-YYYY-MM-DD.log
```

## 🎯 Modul Beschreibungen

### **Core System**

#### **index.js**
- Haupteinstiegspunkt & Bot Initialisierung
- Event Handler Registrierung (ready, interactionCreate)
- Globales Error Handling
- Monitoring Start & State Recovery

#### **global-config.json**
- Bot Token & Client ID
- Default Einstellungen (Intervalle, Farben, Emojis)
- Button Messages & Permissions
- Text System Settings (Default Language)

---

### **Cogs (Module)**

#### **Logger.js**
- Logging in Console & Datei
- Log-Level: VERBOSE, INFO, SUCCESS, ERROR, WARNING
- Automatische Datei-Rotation (täglich)
- Formatierung mit Timestamps

#### **ConfigManager.js**
- Global Config Management
- Guild-spezifische Configs laden/speichern
- Server Config CRUD Operationen
- Icons Ordner Verwaltung
- Multi-Language Settings
- Deep Merge für nested Objects

#### **StateManager.js**
- Message IDs & Channel IDs persistieren
- Last Status Tracking (online/offline)
- Auto-Recovery nach Bot Restart
- State File Management pro Guild

#### **IconManager.js**
- Server Icons Cache System
- Favicon von Minecraft Server abrufen
- Base64 Decoding & PNG Speicherung
- Online/Local Icon Verwaltung
- Dateinamen Sanitizing

#### **PermissionManager.js**
- Setup-Berechtigungen prüfen
- Channel-Berechtigungen validieren
- Administrator & Custom Roles Support
- Permission Bits Calculator
- View Channel, Send Messages, Embed Links Check

#### **StatusChecker.js**
- Minecraft Server Status Abfragen
- Player Count & Player Liste
- MOTD & Version auslesen
- Favicon Extraction
- Error Handling (timeout, offline, etc.)
- Verwendet: minecraft-server-util

#### **EmbedBuilder.js**
- Discord Embed Erstellung
- Online/Offline Styling
- Custom Colors & Emojis
- Field Customization (Players, IP, etc.)
- Footer & Thumbnail Support
- Multi-Language Integration
- Button Row Generierung

#### **MonitoringManager.js**
- Server Status Updates (Interval-based)
- Multi-Guild Monitoring
- State Recovery nach Restart
- Interval Management pro Server
- Spam-Proof Message Updates
- Auto Icon Save bei Online Status

#### **CommandHandler.js**
- Slash Commands Registration
- 5 Commands: /setup, /reload, /refresh, /botinfo, /checkperms
- Permission Checks vor Execution
- Multi-Language Command Responses
- Auto-Discovery von Commands

#### **InteractionHandler.js**
- Select Menu Handler
- Modal Handler
- Button Handler
- Server CRUD (Add/Edit/Delete)
- Setup Navigation (Back/Forward)
- Multi-Language Support
- Größte Datei (~1000+ Zeilen)

#### **MessageHandler.js** ⭐ NEU in v4.0
- Multi-Language Text Management
- getText() für Key-basierte Texte
- Variable Replacement ({serverName}, etc.)
- Fallback-Kette: Server → Guild → Global → Default
- Auto-Discovery von Sprachdateien
- Custom Language Support
- getLanguageName() & getAvailableLanguages()

#### **SetupMenus.js**
- Setup Menu Embed Definitionen
- Dropdown Options & Descriptions
- Navigation Struktur
- Verwendet MessageHandler für alle Texte
- Kategorien: Servers, Intervals, Embed, Buttons, Permissions, Global, Texts

---

## 🧪 Debug Tools (30 Tools)

### **Kategorien**

**🔵 Basic Checks (1-11)**
- Config, Dependencies, Modules Validierung
- Command & Language Discovery
- Guild Analyse & File Structure
- Permissions Calculator
- Bot Connection Test

**🟡 Advanced Tools (12-20)**
- Performance Monitoring (CPU, Memory, Events)
- Log Error Analysis
- Deep Config Validation
- Network Connectivity Testing
- Backup System
- Live Health Monitoring
- Guild Reports
- Token Validation

**🟢 Pro Tools (21-30)**
- Command Testing & Simulation
- State Analysis & Cleanup
- Visual Message Preview (ASCII Art)
- Emoji Compatibility Testing
- Auto-Fixer (Common Issues)
- Deep Language Validation
- Icon System Testing
- Monitoring Simulation
- Complete System Report Export

### **Features**
- ✅ **Auto-Discovery**: Keine hardcoded Listen
- ✅ **Path-Aware**: Funktioniert in ./Debug/ und von Root
- ✅ **One-Click Testing**: Batch Scripts für alle Plattformen
- ✅ **Auto-Fixing**: Automatische Problembehebung
- ✅ **Complete Reports**: Export aller Systemdaten
- ✅ **Visual Feedback**: Farbcodiert (Grün/Rot/Gelb)
- ✅ **Exit Codes**: Für Automation & CI/CD

Siehe `Debug/Debug-README.md` für vollständige Dokumentation aller 30 Tools.

---

## 🚀 Installation

```bash
# 1. Repository clonen
git clone https://github.com/yourname/minecraft-status-bot
cd minecraft-status-bot

# 2. Dependencies installieren
npm install

# 3. Config erstellen
cp global-config.example.json global-config.json

# 4. Bot Token eintragen
# Öffne global-config.json und füge deinen Token ein

# 5. Bot starten
node index.js
```

### Optional: Debug Tools testen
```bash
# Windows
Test_all_debug_tools.bat

# Linux/Mac
chmod +x Debug/test-all-debug-tools.sh
./Debug/test-all-debug-tools.sh

# Einzeln manuell
node Debug/master-debug.js
```

---

## 📝 Commands (5 Slash Commands)

```
/setup      - Interaktives Setup-Menü (7 Kategorien)
/reload     - Config & Monitoring neu laden
/refresh    - Status-Messages komplett neu erstellen
/botinfo    - Bot Statistiken & Version anzeigen
/checkperms - Bot Berechtigungen für aktuellen Channel prüfen
```

---

## 🎨 Features v4.0

### **Multi-Guild Support**
✅ Vollständig isolierte Configs pro Guild  
✅ Separate States pro Guild  
✅ Keine Cross-Guild Interference  

### **Multi-Language System** ⭐
✅ English & German built-in  
✅ Custom Languages via File Drop  
✅ Per-Server & Per-Guild Sprachen  
✅ Fallback-System (4 Stufen)  
✅ Variable Replacement  
✅ Auto-Discovery von Sprachen  
✅ Zero Hardcoded Strings  

### **Setup System**
✅ Interaktive Discord Menüs  
✅ Kein Config-File Editing nötig  
✅ Channel-Auswahl per Dropdown  
✅ Server hinzufügen via Modal  
✅ Real-time Validation  
✅ Permission Checks  

### **Monitoring**
✅ Multi-Server Monitoring  
✅ Configurable Intervals (5s-5m)  
✅ Auto Icon Save  
✅ State Recovery nach Restart  
✅ Spam-Proof Updates (nur bei Änderung)  

### **Customization**
✅ Per-Server Colors & Emojis  
✅ Custom Embed Fields  
✅ Button Customization  
✅ Local Server Icons  
✅ Custom Button Messages  

### **Debug & Testing**
✅ 30 Professional Debug Tools  
✅ Auto-Discovery System  
✅ One-Click Testing  
✅ Auto-Fixer für häufige Probleme  
✅ Complete System Reports  

---

## 🌐 Multi-Language System

### **Architektur**
```
texts/
├── de.json           # Deutsch (Official)
├── en.json           # English (Default)
└── custom_*.json     # Custom User Languages
```

### **Fallback-Kette**
1. **Server Language** (`server.textSettings.language`)
2. **Guild Global** (`guildConfig.globalTextSettings.defaultLanguage`)
3. **Bot Default** (`global-config.json → defaults.textSettings.defaultLanguage`)
4. **Hardcoded** (`en`)

### **Features**
- ✅ Alle UI Texte zentral in JSON
- ✅ Variable Replacement: `{serverName}`, `{players}`, `{emoji}`
- ✅ Nested Keys: `setup.mainMenu.title`
- ✅ Custom Languages via File Drop
- ✅ Auto-Discovery beim Bot Start
- ✅ Keine Code-Änderungen nötig

### **Neue Sprache hinzufügen**
1. Kopiere `texts/en.json` → `texts/es.json`
2. Ändere `_meta` Sektion (language, languageName, flag)
3. Übersetze Texte (Variablen `{...}` nicht ändern!)
4. Bot restart → Sprache erscheint automatisch in `/setup`

---

## 🔧 Erweiterungen

### **Neues Modul erstellen**
```javascript
// cogs/NewModule.js
class NewModule {
    constructor(dependency1, dependency2) {
        this.dep1 = dependency1;
        this.dep2 = dependency2;
    }
    
    async doSomething() {
        // Your logic
    }
}

module.exports = { NewModule };
```

```javascript
// index.js
const { NewModule } = require('./cogs/NewModule');
const newModule = new NewModule(dep1, dep2);
```

### **Neuer Command**
Commands werden automatisch entdeckt via `check-commands.js`!
Einfach in `CommandHandler.js` hinzufügen:

```javascript
{
    name: 'mycommand',
    description: 'My new command',
    execute: async (interaction) => {
        // Your logic
    }
}
```

### **Neue Setup Kategorie**
1. Embed in `SetupMenus.js` erstellen
2. Handler in `InteractionHandler.js` hinzufügen
3. Texte in `texts/*.json` ergänzen

---

## 📦 Dependencies

```json
{
  "discord.js": "^14.0.0",
  "minecraft-server-util": "^5.0.0"
}
```

- **discord.js v14+** - Discord API & Interactions
- **minecraft-server-util v5+** - Minecraft Server Status Queries

---

## 🧪 Testing & Debugging

### **Vor Bot-Start**
```bash
node Debug/master-debug.js          # Alle Basic Checks
node Debug/check-config.js          # Config Validierung
node Debug/check-dependencies.js    # Package Check
```

### **Nach Code-Änderungen**
```bash
node Debug/check-commands.js        # Command Discovery
node Debug/check-modules.js         # Modul Discovery
node Debug/check-languages.js       # Language Files
```

### **Troubleshooting**
```bash
node Debug/token-validator.js       # Token Probleme
node Debug/error-analyzer.js        # Log Analyse
node Debug/network-test.js          # Connectivity
node Debug/auto-fixer.js            # Auto-Fix häufiger Probleme
```

### **Maintenance**
```bash
node Debug/backup-manager.js        # Backup erstellen
node Debug/state-cleanup.js         # Orphaned States löschen
node Debug/export-report.js         # System Report
```

### **Development**
```bash
node Debug/command-tester.js        # Command Simulation
node Debug/message-preview.js       # Visual Preview
node Debug/monitoring-simulator.js  # Monitoring ohne Discord
```

---

## 🤝 Contributing

### **Code-Struktur**
- **Modular**: Single Responsibility Principle
- **Documented**: JSDoc comments
- **Testable**: 30 Debug Tools
- **Multi-Language**: Zero hardcoded strings

### **Pull Requests**
1. Fork das Repository
2. Branch erstellen (`git checkout -b feature/amazing`)
3. Changes committen (`git commit -m 'Add amazing feature'`)
4. Tests laufen lassen (`Test_all_debug_tools.bat`)
5. Push to branch (`git push origin feature/amazing`)
6. Pull Request öffnen

### **Code Style**
- camelCase für Variablen & Funktionen
- PascalCase für Klassen
- Descriptive Namen (nicht `x`, `temp`, `data`)
- Comments für komplexe Logik
- Error Handling mit try-catch

---

## 📄 Lizenz

MIT License - Frei verwendbar für private & kommerzielle Projekte

---

## 📊 Statistiken

- **Lines of Code**: ~5000+
- **Modules**: 12
- **Commands**: 5
- **Debug Tools**: 30
- **Languages**: 2 (+ Custom)
- **Test Coverage**: 100% (via Debug Tools)

---

## 🎯 Roadmap

**v4.1 (geplant)**
- [ ] Web Dashboard
- [ ] Grafana Integration
- [ ] More Languages (FR, ES, PT)
- [ ] Advanced Analytics
- [ ] Docker Support

**v4.2 (geplant)**
- [ ] Bedrock Server Support
- [ ] Custom Status Messages
- [ ] Webhook Support
- [ ] API Endpoint

---

**v4.0 - Current Release**
- ✅ Multi-Language System (EN/DE + Custom)
- ✅ 30 Debug Tools mit Auto-Discovery
- ✅ MessageHandler für zentrale Textverwaltung
- ✅ Auto-Fixer für häufige Probleme
- ✅ Komplette Test-Suite
- ✅ Custom Language Support
- ✅ Visual Message Preview
- ✅ Professional Debug System