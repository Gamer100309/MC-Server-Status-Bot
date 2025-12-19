# 🤖 Minecraft Multi-Server Status Bot v5.1

Ein hochprofessioneller Discord-Bot für das Minecraft-Server-Monitoring mit **Multi-Language-Support**, jetzt inklusive **automatischem Installer**.

---

## ✨ Features

- 🚀 **New: One-Click Installer** – Kinderleichte Einrichtung für Windows, Linux & macOS  
- 🌍 **Multi-Guild Support** – Ein Bot kann beliebig viele Discord-Server gleichzeitig bedienen  
- 🌐 **Multi-Language System** – Deutsch & Englisch out-of-the-box (einfach erweiterbar)  
- 🎨 **Vollständig anpassbar** – Farben, Emojis, Buttons und Texte frei konfigurierbar  
- 📊 **Live Status Monitoring** – Automatische Updates für Java- und Bedrock-Server  
- 🖼️ **Server Icons** – Automatisches Abrufen und Speichern von Server-Favicons  
- 🔧 **30+ Debug Tools** – Professionelles Testing & Fehlersuche integriert  
- ⚙️ **Setup via Discord** – Konfiguration über Slash-Commands, kein JSON-Editieren nötig  
- 🔐 **Permissions System** – Granulare Steuerung der Verwaltungsrechte  

---

## 📦 Installation

Der Bot bietet zwei Installationswege:

### 🅰️ Methode A: Der neue Installer (Empfohlen)

1. Lade die `RedCity_Mc_Stats_Bot_installer.exe` (Windows) oder `RedCity_Mc_Stats_Bot_installer` (Linux/Mac) aus dem neuesten Release herunter  
2. Starte die Datei  
3. Folge den Anweisungen:  
   - Node.js wird geprüft  
   - Der Bot wird automatisch geladen  
   - Alle Module werden installiert  
   - Dein **Bot-Token** wird direkt abgefragt  

---

### 🅱️ Methode B: Manuelle Installation

```bash
# 1. Repository clonen
git clone https://github.com/Gamer100309/MC-Server-Status-Bot
cd MC-Server-Status-Bot

# 2. Dependencies installieren
npm install

# 3. Config erstellen
# Erstelle eine global-config.json mit deinem Bot-Token

# 4. Bot starten
node index.js
```

💡 **Tipp:**  
Sieh dir die Datei **Discord Bot Token Guide.md** an, falls du Hilfe beim Erstellen des Bots benötigst.

---

## 🎯 Commands

```text
/setup        - Öffnet das interaktive Setup-Menü (Server hinzufügen / löschen)
/reload       - Lädt Konfiguration & Monitoring sofort neu
/refresh      - Löscht alte Status-Nachrichten und erstellt sie neu
/botinfo      - Zeigt Statistiken, Entwickler-Infos & GitHub-Link
/checkperms   - Prüft, ob der Bot alle nötigen Rechte im aktuellen Kanal hat
```

---

## 🧪 Testing & Debugging

Der Bot verfügt über eine umfangreiche Test-Suite im **Debug/**-Ordner:

- **Windows**
```bash
Test_all_debug_tools.bat
```

- **Linux / macOS**
```bash
./Test_all_debug_tools.sh
```

- **Einzeltests**
```bash
node Debug/token-validator.js
```

---

## 🤝 Contributing & Lizenz

📜 **GNU General Public License v3.0**

✅ **Erlaubt**
- Nutzung  
- Modifikation  
- Weitergabe  

⚠️ **Bedingung**
- Modifizierte Versionen müssen ebenfalls unter **GPL v3** stehen  
- Der Original-Autor **(Gamer100309 | RedCity Industries)** muss genannt werden  

---

## 🙏 Credits & Info

- **Original Author:** Gamer100309 / RedCity Industries  
- **Version:** v5.1.0 Stable  
- **Engine:** discord.js & minecraft-server-util  

---

### ❤️ v5.1

**Made with ❤️ by RedCity Industries**  
*Free & Open Source Minecraft Tooling*
