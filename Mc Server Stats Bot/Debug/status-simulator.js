// ═══════════════════════════════════════════════════════════
//  🎨 STATUS SIMULATOR
//  Simulates how status messages will look
// ═══════════════════════════════════════════════════════════

const fs = require('fs');

console.log('🎨 Status Message Simulator\n');

if (!fs.existsSync('../global-config.json')) {
    console.error('❌ global-config.json not found!');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));
const emojis = config.defaults.defaultEmojis;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🟢 ONLINE STATUS PREVIEW');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`${emojis.online} My Minecraft Server Online`);
console.log('─'.repeat(40));
console.log(`${emojis.ip} Server IP: mc.example.com`);
console.log(`${emojis.version} Version: 1.20.1`);
console.log(`${emojis.players} Players: 5/20`);
console.log(`${emojis.ping} Ping: 45ms`);
console.log(`${emojis.playerList} Online Players:`);
console.log('   Steve, Alex, Notch, Herobrine, Enderman');
console.log(`${emojis.motd} MOTD:`);
console.log('   Welcome to our awesome server!');
console.log('\n   Buttons: [📋 Show IP] [🔑 Show Port] [👥 Show Players]');
console.log('\n   Last updated • mcapi.us');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔴 OFFLINE STATUS PREVIEW');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`${emojis.offline} My Minecraft Server Offline`);
console.log('─'.repeat(40));
console.log('Server is offline or unreachable');
console.log('');
console.log(`${emojis.ip} Server IP: mc.example.com`);
console.log('\n   Buttons: [📋 Show IP]');
console.log('\n   Last updated • mcapi.us');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🎨 COLORS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`🟢 Online Color:  ${config.defaults.embedColors.online}`);
console.log(`🔴 Offline Color: ${config.defaults.embedColors.offline}`);

console.log('\n✅ Preview complete!\n');