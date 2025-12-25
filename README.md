# 🤖 Minecraft Multi-Server Status Bot v5.1.0

Ein hochprofessioneller Discord-Bot für das Minecraft-Server-Monitoring mit **Multi-Language-Support**, jetzt inklusive **Universal Cross-Platform Installer**.

[![GitHub Release](https://img.shields.io/github/v/release/Gamer100309/MC-Server-Status-Bot)](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey)]()
[![License](https://img.shields.io/badge/License-GPL%20v3-green)](https://github.com/Gamer100309/MC-Server-Status-Bot/blob/main/Mc%20Server%20Stats%20Bot/LICENSE)

---

## ✨ Features

- 🚀 **Universal Cross-Platform Installer** – Automatische Einrichtung für Windows, Linux & macOS
- 🌍 **Multi-Guild Support** – Ein Bot kann beliebig viele Discord-Server gleichzeitig bedienen
- 🌐 **Multi-Language System** – Deutsch & Englisch out-of-the-box (einfach erweiterbar)
- 🎨 **Vollständig anpassbar** – Farben, Emojis, Buttons und Texte frei konfigurierbar
- 📊 **Live Status Monitoring** – Automatische Updates für Java- und Bedrock-Server
- 🖼️ **Server Icons** – Automatisches Abrufen und Speichern von Server-Favicons
- 🔧 **30+ Debug Tools** – Professionelles Testing & Fehlersuche integriert
- ⚙️ **Setup via Discord** – Konfiguration über Slash-Commands, kein JSON-Editieren nötig
- 🔐 **Permissions System** – Granulare Steuerung der Verwaltungsrechte

---

## 📦 Quick Installation

### Windows

**One-Click Installer:**

[⬇️ Download for Windows x64](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_Windows_x64.exe)

1. Download the installer
2. Double-click the .exe file
3. Follow the installation wizard
4. Done! 🎉

---

### Linux

**One-Line Install (Recommended):**

```bash
curl -sSL https://raw.githubusercontent.com/Gamer100309/MC-Server-Status-Bot/main/install.sh | bash
```

Automatically detects your architecture (x64 or ARM64) and installs the correct version!

**Manual Download:**

- [Linux x64](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_Linux_x64) (Ubuntu, Debian, Fedora, etc.)
- [Linux ARM64](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_Linux_ARM64) (Raspberry Pi, ARM servers)

---

### macOS

**Community Support** - Not officially tested, but installers are provided:

- [macOS Intel (x64)](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_macOS_x64)
- [macOS Apple Silicon (M1/M2/M3)](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_macOS_ARM64)

**Note:** macOS blocks unsigned binaries. See [installation guide](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest) for instructions.

---

## 🛠️ Manual Installation

If you prefer to install manually or the installer doesn't work for your system:

```bash
# 1. Clone the repository
git clone https://github.com/Gamer100309/MC-Server-Status-Bot.git
cd MC-Server-Status-Bot/Mc\ Server\ Stats\ Bot

# 2. Install dependencies
npm install

# 3. Configure your bot token
# Copy global-config.example.json to global-config.json
# Edit global-config.json and add your Discord Bot Token

# 4. Start the bot
node index.js
```

💡 **Need help creating a Discord Bot?**  
See our [Discord Bot Token Guide]([https://github.com/Gamer100309/MC-Server-Status-Bot/blob/main/Mc%20Server%20Stats%20Bot/Discord%20Bot%20Token%20Guide.md](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/download/v5.1.0_Release/Discord.Bot.Token.Guide.md))

---

## 🎯 Commands

Once the bot is running, use these slash commands in Discord:

| Command | Description |
|---------|-------------|
| `/setup` | Interactive setup wizard (add/remove servers) |
| `/reload` | Reload configuration & restart monitoring |
| `/refresh` | Recreate all status messages |
| `/botinfo` | Show bot statistics and information |
| `/checkperms` | Verify bot permissions in current channel |

---

## 🖥️ Platform Support

| Platform | Architecture | Status | Download |
|----------|-------------|--------|----------|
| **Windows** | x64 | ✅ Full Support | [Download](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_Windows_x64.exe) |
| **Linux** | x64 | ✅ Full Support | [Download](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_Linux_x64) |
| **Linux** | ARM64 | ✅ Full Support | [Download](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_Linux_ARM64) |
| **macOS** | Intel (x64) | ⚠️ Community | [Download](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_macOS_x64) |
| **macOS** | Apple Silicon | ⚠️ Community | [Download](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_macOS_ARM64) |

---

## 🌍 Language Support

Currently supported languages:
- 🇬🇧 English
- 🇩🇪 German (Deutsch)

**Want to contribute a translation?**  
Check out our [Translation Guide](https://github.com/Gamer100309/MC-Server-Status-Bot/blob/51781dec0227bf0cb711514fd2276efdc01649e6/Mc%20Server%20Stats%20Bot/texts/Add%20language.md) and submit a Pull Request!

---

## 🧪 Testing & Debugging

The bot includes a comprehensive test suite with 30+ debug tools:

**Windows:**
```bash
Test_all_debug_tools.bat
```

**Linux / macOS:**
```bash
./Test_all_debug_tools.sh
```

**Individual Tests:**
```bash
node Debug/token-validator.js
node Debug/config-validator.js
node Debug/network-test.js
# ... and many more
```

See [Debug-README.md](https://github.com/Gamer100309/MC-Server-Status-Bot/blob/main/Mc%20Server%20Stats%20Bot/Debug/Debug-README.md) for complete documentation.

---

## 📸 Screenshots

![Server Status Embed](https://github.com/user-attachments/assets/bf53c89b-b306-419d-8020-81331167647d)
*Real-time Minecraft server status with player count and latency*

![Setup Menu](https://github.com/user-attachments/assets/b575b22a-8f9e-4cfc-a822-61fa0cd63e44)
*Interactive setup menu with multiple configuration options*

---

## 🤝 Contributing

We welcome contributions from the community!

### Translation Contributions

Adding a new language translation? Please use our [Pull Request template](.github/PULL_REQUEST_TEMPLATE.md) and include the `Language File` label.

### Bug Reports & Feature Requests

- 🐛 [Report a Bug](https://github.com/Gamer100309/MC-Server-Status-Bot/issues/new)
- 💡 [Request a Feature](https://github.com/Gamer100309/MC-Server-Status-Bot/issues/new)
- 💬 [Start a Discussion](https://github.com/Gamer100309/MC-Server-Status-Bot/discussions)

### Development

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

**GNU General Public License v3.0**

✅ **Permitted:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

⚠️ **Conditions:**
- Modified versions must also be licensed under GPL v3
- Original author (**Gamer100309 | RedCity Industries**) must be credited
- Source code must be disclosed

See [LICENSE](https://github.com/Gamer100309/MC-Server-Status-Bot/blob/main/Mc%20Server%20Stats%20Bot/LICENSE) file for full details.

---

## 📋 System Requirements

**For running the bot:**
- Node.js 18+ and npm
- Discord Bot Token ([How to create]([https://github.com/Gamer100309/MC-Server-Status-Bot/blob/main/Mc%20Server%20Stats%20Bot/Discord%20Bot%20Token%20Guide.md](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/download/v5.1.0_Release/Discord.Bot.Token.Guide.md)))
- Internet connection

**Supported Operating Systems:**
- Windows 10 or higher
- Linux (Ubuntu 20.04+, Debian 10+, Fedora 35+, etc.)
- macOS 10.15 (Catalina) or higher

---

## 🔗 Useful Links

- 📖 [Installation Guide](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest)
- 🤖 [Discord Bot Setup Guide](https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/Discord.Bot.Token.Guide.md)
- 🌐 [Add a Language](https://github.com/Gamer100309/MC-Server-Status-Bot/blob/4a51a6bec408fcc1114a1c966765ea5275a7169e/Mc%20Server%20Stats%20Bot/texts/Add%20language.md)
- 🐛 [Debug Tools](https://github.com/Gamer100309/MC-Server-Status-Bot/blob/main/Mc%20Server%20Stats%20Bot/Debug/Debug-README.md)
- 📂 [Project Structure](https://github.com/Gamer100309/MC-Server-Status-Bot/blob/main/Mc%20Server%20Stats%20Bot/Project_Structure.md)

---

## 📚 Wiki Documentation

For complete documentation, guides, and troubleshooting:

🔗 **[Visit the Full Wiki →](https://github.com/Gamer100309/MC-Server-Status-Bot/wiki)**

- Installation & Setup
- Commands & Configuration
- Troubleshooting & FAQ
- Contributing & Development

---

## 🙏 Credits & Info

**Created by RedCity Industries | Gamer100309**

- 🤖 **Version:** v5.1.0
- 📅 **Release Date:** December 24, 2025
- 🔧 **Engine:** discord.js v14 & minecraft-server-util v5
- 📜 **License:** GNU GPL v3.0

**Special Thanks:**
- Discord.js team for the excellent library
- minecraft-server-util developers
- All contributors and testers
- The Discord & Minecraft communities

---

## ⭐ Support This Project

If this bot helps you:

- ⭐ **Star this repository** on GitHub
- 📣 **Share** with other Minecraft server owners
- 🐛 **Report bugs** to help improve the bot
- 💡 **Suggest features** you'd like to see
- 🌍 **Contribute translations** in your language
- 🤝 **Submit pull requests** with improvements

---

## 📞 Support & Community

- 💬 [GitHub Discussions](https://github.com/Gamer100309/MC-Server-Status-Bot/discussions) - Ask questions & share ideas
- 🐛 [Issue Tracker](https://github.com/Gamer100309/MC-Server-Status-Bot/issues) - Report bugs

---

<div align="center">

**Made with ❤️ by RedCity Industries**

*Free & Open Source Minecraft Tooling*

🎄 **Happy Holidays & Happy Hosting!** 🎮

</div>
