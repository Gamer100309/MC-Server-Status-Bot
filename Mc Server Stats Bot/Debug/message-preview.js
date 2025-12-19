// ═══════════════════════════════════════════════════════════
//  👁️ MESSAGE PREVIEW
//  Generates visual preview of bot messages
// ═══════════════════════════════════════════════════════════

const fs = require('fs');

console.log('👁️ Message Preview Generator\n');

if (!fs.existsSync('../global-config.json')) {
    console.error('❌ global-config.json not found!');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));
const e = config.defaults.defaultEmojis;
const colors = config.defaults.embedColors;

// Load language files
let enTexts = null;
let deTexts = null;

if (fs.existsSync('../texts/en.json')) {
    enTexts = JSON.parse(fs.readFileSync('../texts/en.json', 'utf8'));
}

if (fs.existsSync('../texts/de.json')) {
    deTexts = JSON.parse(fs.readFileSync('../texts/de.json', 'utf8'));
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🟢 ONLINE STATUS - ENGLISH');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`┌─────────────────────────────────────────┐`);
console.log(`│ ${e.online} My Minecraft Server Online          │`);
console.log(`├─────────────────────────────────────────┤`);
console.log(`│                                         │`);
console.log(`│ ${e.ip} Server IP                            │`);
console.log(`│ mc.example.com:25565                    │`);
console.log(`│                                         │`);
console.log(`│ ${e.version} Version    ${e.players} Players    ${e.ping} Ping        │`);
console.log(`│ 1.20.1      5/20          45ms         │`);
console.log(`│                                         │`);
console.log(`│ ${e.playerList} Online Players                       │`);
console.log(`│ Steve, Alex, Notch, Herobrine          │`);
console.log(`│                                         │`);
console.log(`│ ${e.motd} MOTD                                  │`);
console.log(`│ Welcome to our awesome server!          │`);
console.log(`│                                         │`);
console.log(`├─────────────────────────────────────────┤`);
console.log(`│ [📋 Show IP] [🔑 Port] [👥 Players]    │`);
console.log(`├─────────────────────────────────────────┤`);
console.log(`│ Last updated • mcapi.us                 │`);
console.log(`└─────────────────────────────────────────┘`);

console.log(`\nColor: ${colors.online} (Green)`);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔴 OFFLINE STATUS - ENGLISH');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`┌─────────────────────────────────────────┐`);
console.log(`│ ${e.offline} My Minecraft Server Offline         │`);
console.log(`├─────────────────────────────────────────┤`);
console.log(`│                                         │`);
console.log(`│ Server is offline or unreachable        │`);
console.log(`│                                         │`);
console.log(`│ ${e.ip} Server IP                            │`);
console.log(`│ mc.example.com:25565                    │`);
console.log(`│                                         │`);
console.log(`├─────────────────────────────────────────┤`);
console.log(`│ [📋 Show IP]                            │`);
console.log(`├─────────────────────────────────────────┤`);
console.log(`│ Last updated • mcapi.us                 │`);
console.log(`└─────────────────────────────────────────┘`);

console.log(`\nColor: ${colors.offline} (Red)`);

// German preview if available
if (deTexts) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   🟢 ONLINE STATUS - DEUTSCH');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log(`┌─────────────────────────────────────────┐`);
    console.log(`│ ${e.online} Mein Minecraft Server Online        │`);
    console.log(`├─────────────────────────────────────────┤`);
    console.log(`│                                         │`);
    console.log(`│ ${e.ip} Server IP                            │`);
    console.log(`│ mc.example.com:25565                    │`);
    console.log(`│                                         │`);
    console.log(`│ ${e.version} Version    ${e.players} Spieler    ${e.ping} Ping      │`);
    console.log(`│ 1.20.1      5/20          45ms         │`);
    console.log(`│                                         │`);
    console.log(`│ ${e.playerList} Online Spieler                       │`);
    console.log(`│ Steve, Alex, Notch, Herobrine          │`);
    console.log(`│                                         │`);
    console.log(`│ ${e.motd} MOTD                                  │`);
    console.log(`│ Willkommen auf unserem Server!          │`);
    console.log(`│                                         │`);
    console.log(`├─────────────────────────────────────────┤`);
    console.log(`│ [📋 IP anzeigen] [🔑 Port] [👥 Spieler]│`);
    console.log(`├─────────────────────────────────────────┤`);
    console.log(`│ Zuletzt aktualisiert • mcapi.us         │`);
    console.log(`└─────────────────────────────────────────┘`);
}

// Button response previews
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   💬 BUTTON RESPONSES');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('1. IP Button Response:');
console.log('┌─────────────────────────────────────┐');
console.log('│ 📋 Server IP:                       │');
console.log('│ ```                                 │');
console.log('│ mc.example.com:25565                │');
console.log('│ ```                                 │');
console.log('│ To copy: Select text and press CTRL+C│');
console.log('└─────────────────────────────────────┘');

console.log('\n2. Port Button Response:');
console.log('┌─────────────────────────────────────┐');
console.log('│ 🔑 Server Port:                     │');
console.log('│ ```                                 │');
console.log('│ 25565                               │');
console.log('│ ```                                 │');
console.log('│ To copy: Select text and press CTRL+C│');
console.log('└─────────────────────────────────────┘');

console.log('\n3. Players Button Response:');
console.log('┌─────────────────────────────────────┐');
console.log('│ 👥 Online Players (5/20):           │');
console.log('│ ```                                 │');
console.log('│ Steve                               │');
console.log('│ Alex                                │');
console.log('│ Notch                               │');
console.log('│ Herobrine                           │');
console.log('│ Enderman                            │');
console.log('│ ```                                 │');
console.log('└─────────────────────────────────────┘');

console.log('\n✅ Preview generation complete!\n');