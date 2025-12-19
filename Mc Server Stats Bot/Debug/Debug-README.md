# 🔧 Debug Tools Suite - Complete Documentation

## 📋 Overview

Complete collection of **30 debug tools** for the Minecraft Multi-Server Status Bot.

### ✨ Features
- 🔍 **Auto-Discovery**: No manual updates needed
- 🚀 **One-Click Testing**: Quick validation scripts
- 🔧 **Auto-Fixing**: Automatic problem resolution
- 📊 **Deep Analysis**: Performance, logs, configs
- 💾 **Backup Management**: Safe configuration backups
- 📄 **Complete Reports**: Export everything

---

## 🚀 Quick Start

### Windows
```bash
debug-check.bat
```

### Linux/Mac
```bash
chmod +x debug-check.sh
./debug-check.sh
```

### Manual
```bash
node Debug/master-debug.js
```

---

## 📦 All 30 Tools

### 🔵 Basic Checks (1-11)

| # | Tool | Purpose | Usage |
|---|------|---------|-------|
| 1 | master-debug.js | Complete system check | `node Debug/master-debug.js` |
| 2 | check-config.js | Config validation | `node Debug/check-config.js` |
| 3 | check-dependencies.js | Package check | `node Debug/check-dependencies.js` |
| 4 | check-modules.js | Module discovery | `node Debug/check-modules.js` |
| 5 | check-commands.js | Command discovery | `node Debug/check-commands.js` |
| 6 | check-languages.js | Language validation | `node Debug/check-languages.js` |
| 7 | check-guilds.js | Guild analysis | `node Debug/check-guilds.js` |
| 8 | check-permissions.js | Permission calculator | `node Debug/check-permissions.js` |
| 9 | check-files.js | Structure validation | `node Debug/check-files.js` |
| 10 | test-bot-connection.js | Live Discord test | `node Debug/test-bot-connection.js` |
| 11 | README.md | Documentation | This file |

### 🟡 Advanced Tools (12-20)

| # | Tool | Purpose | Usage |
|---|------|---------|-------|
| 12 | performance-monitor.js | Performance metrics | `node Debug/performance-monitor.js` |
| 13 | error-analyzer.js | Log analysis | `node Debug/error-analyzer.js` |
| 14 | config-validator.js | Deep config check | `node Debug/config-validator.js` |
| 15 | network-test.js | Connectivity testing | `node Debug/network-test.js` |
| 16 | status-simulator.js | Message preview | `node Debug/status-simulator.js` |
| 17 | backup-manager.js | Automated backups | `node Debug/backup-manager.js` |
| 18 | health-monitor.js | Continuous monitoring | `node Debug/health-monitor.js [seconds]` |
| 19 | guild-reporter.js | Detailed reports | `node Debug/guild-reporter.js` |
| 20 | token-validator.js | Token validation | `node Debug/token-validator.js` |

### 🟢 Pro Tools (21-30)

| # | Tool | Purpose | Usage |
|---|------|---------|-------|
| 21 | command-tester.js | Command simulation | `node Debug/command-tester.js` |
| 22 | state-analyzer.js | State file analysis | `node Debug/state-analyzer.js` |
| 23 | state-cleanup.js | State cleanup | `node Debug/state-cleanup.js` |
| 24 | message-preview.js | Visual preview | `node Debug/message-preview.js` |
| 25 | emoji-tester.js | Emoji compatibility | `node Debug/emoji-tester.js` |
| 26 | auto-fixer.js | Auto problem resolution | `node Debug/auto-fixer.js` |
| 27 | language-validator.js | Deep language check | `node Debug/language-validator.js` |
| 28 | icon-tester.js | Icon testing | `node Debug/icon-tester.js` |
| 29 | monitoring-simulator.js | Monitoring simulation | `node Debug/monitoring-simulator.js` |
| 30 | export-report.js | Complete report | `node Debug/export-report.js` |

---

## 🎯 Usage Scenarios

### Before Starting Bot
```bash
node Debug/master-debug.js
# OR
debug-check.bat
```

### After Making Changes
```bash
# New commands
node Debug/check-commands.js

# New modules  
node Debug/check-modules.js

# New translations
node Debug/check-languages.js
```

### Troubleshooting
```bash
# Bot won't start
node Debug/token-validator.js
node Debug/check-config.js

# Connection issues
node Debug/network-test.js

# Performance problems
node Debug/performance-monitor.js
node Debug/health-monitor.js 120

# Error investigation
node Debug/error-analyzer.js
```

### Maintenance
```bash
# Backup before changes
node Debug/backup-manager.js

# Clean old states
node Debug/state-cleanup.js

# Get overview
node Debug/guild-reporter.js
node Debug/export-report.js
```

---

## 🔧 Integration with npm

Add to `package.json`:

```json
{
  "scripts": {
    "debug": "node Debug/master-debug.js",
    "test": "node Debug/test-bot-connection.js",
    "health": "node Debug/health-monitor.js",
    "backup": "node Debug/backup-manager.js",
    "fix": "node Debug/auto-fixer.js",
    "report": "node Debug/export-report.js"
  }
}
```

Then use: `npm run debug`, `npm run test`, etc.

---

## 📊 Tool Details

### 1. master-debug.js
**Complete system check - runs all basic checks**

✅ Checks:
- Config file validity
- Dependencies installed
- Modules loadable
- Commands valid
- Languages complete
- Guild configs
- Permissions defined
- File structure

Exit codes: 0 (success), 1 (failure)

---

### 12. performance-monitor.js
**Measures bot performance metrics**

Tracks:
- Login time with rating
- Memory usage (RSS, heap, external)
- WebSocket ping (live)
- Cache statistics
- Process information

Example output:
```
Login Time: 1.2s (⚡ Fast)
Memory Usage: 45.2 MB
WebSocket Ping: 42ms (Excellent)
```

---

### 18. health-monitor.js
**Continuous live monitoring**

Usage: `node Debug/health-monitor.js [seconds]`  
Default: 60 seconds  
Example: `node Debug/health-monitor.js 120` (2 minutes)

Monitors:
- Real-time ping history
- Memory usage over time
- Error/warning collection
- Progress bar
- Final health score (0-100)

---

### 26. auto-fixer.js
**Automatically fixes common issues**

Fixes:
- Missing global-config.json
- Missing textSettings
- Invalid hex colors
- Missing directories
- Missing guild settings

Interactive: Shows issues and asks for confirmation

---

### 30. export-report.js
**Generates complete system report**

Creates: `system-report-YYYY-MM-DD.txt`

Includes:
- Configuration summary
- All guilds and servers
- Language files
- Modules and commands
- File system status
- Dependencies
- Recent logs

Perfect for sharing with support or documentation.

---

## 🚨 Critical Tools

**Must-run before bot start:**
1. check-config.js
2. check-dependencies.js
3. token-validator.js

**Or simply use:** `master-debug.js`

---

## 💡 Pro Tips

1. Run `master-debug.js` daily
2. Create backups before changes
3. Use `health-monitor.js` for stability checks
4. Check `error-analyzer.js` after crashes
5. Export reports when seeking help

---

## 🔄 Auto-Discovery

**No manual updates needed!**

Automatically discovers:
- ✅ Commands (from CommandHandler.js)
- ✅ Modules (from ./cogs/)
- ✅ Languages (from ./texts/)
- ✅ Guilds (from ./configs/)
- ✅ States (from ./states/)

Add new features → Automatically detected!

---

## ❓ Common Issues

### "Cannot find module"
```bash
npm install
```

### "Token not set"
1. Edit `global-config.json`
2. Replace `YOUR_BOT_TOKEN`
3. Run `node Debug/token-validator.js`

### Tool hangs
- Check internet connection
- Press CTRL+C to cancel
- Check firewall settings

---

## 📝 Exit Codes

- **0**: Success
- **1**: Failure

Use in automation:
```bash
node Debug/master-debug.js && node index.js
```

---

## ✨ Quick Commands

**Check everything:**
```bash
node Debug/master-debug.js
```

**Fix common issues:**
```bash
node Debug/auto-fixer.js
```

**Complete report:**
```bash
node Debug/export-report.js
```

**Live monitoring:**
```bash
node Debug/health-monitor.js 120
```

---

## 🎉 You're Ready!

Start with:
```bash
debug-check.bat
```

Or:
```bash
node Debug/master-debug.js
```

Happy debugging! 🚀

---

**Total: 30 Debug Tools | Auto-Discovery | No Manual Updates**