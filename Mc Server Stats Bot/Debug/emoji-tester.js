// ═══════════════════════════════════════════════════════════
//  😀 EMOJI TESTER
//  Tests emoji compatibility and display
// ═══════════════════════════════════════════════════════════

const fs = require('fs');

console.log('😀 Emoji Compatibility Tester\n');

if (!fs.existsSync('../global-config.json')) {
    console.error('❌ global-config.json not found!');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));
const emojis = config.defaults.defaultEmojis;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   😀 EMOJI DISPLAY TEST');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Testing all configured emojis:\n');

const emojiTests = [
    { name: 'Online', key: 'online', expected: '🟢' },
    { name: 'Offline', key: 'offline', expected: '🔴' },
    { name: 'IP', key: 'ip', expected: '🌐' },
    { name: 'Version', key: 'version', expected: '⚙️' },
    { name: 'Players', key: 'players', expected: '👥' },
    { name: 'Ping', key: 'ping', expected: '📶' },
    { name: 'Port', key: 'port', expected: '🔑' },
    { name: 'Player List', key: 'playerList', expected: '👤' },
    { name: 'MOTD', key: 'motd', expected: '📢' }
];

let allCorrect = true;

emojiTests.forEach(test => {
    const actual = emojis[test.key];
    const matches = actual === test.expected;
    
    console.log(`${test.name.padEnd(15)} ${actual}  ${matches ? '✅' : '⚠️'}`);
    
    if (!matches) {
        console.log(`  Expected: ${test.expected}`);
        console.log(`  Got: ${actual}`);
        allCorrect = false;
    }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📱 DISCORD COMPATIBILITY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Testing Discord-specific features:\n');

// Test if emojis are Unicode (not custom Discord emojis)
let allUnicode = true;

Object.entries(emojis).forEach(([key, emoji]) => {
    const isCustom = emoji.startsWith('<:') || emoji.startsWith('<a:');
    
    if (isCustom) {
        console.log(`⚠️  ${key}: Custom Discord emoji detected`);
        console.log(`   Value: ${emoji}`);
        console.log(`   Note: Custom emojis only work in specific servers`);
        allUnicode = false;
    }
});

if (allUnicode) {
    console.log('✅ All emojis are Unicode (universal compatibility)');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🎨 VISUAL COMPARISON');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Sample output with your emojis:\n');

console.log(`${emojis.online} Server Online`);
console.log(`${emojis.offline} Server Offline`);
console.log(`${emojis.ip} Server IP: mc.example.com`);
console.log(`${emojis.version} Version: 1.20.1`);
console.log(`${emojis.players} Players: 10/20`);
console.log(`${emojis.ping} Ping: 45ms`);
console.log(`${emojis.port} Port: 25565`);
console.log(`${emojis.playerList} Online: Steve, Alex`);
console.log(`${emojis.motd} Welcome to the server!`);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   💡 RECOMMENDATIONS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const recommendations = [];

if (!allCorrect) {
    recommendations.push('Some emojis don\'t match expected values');
    recommendations.push('Review global-config.json defaultEmojis section');
}

if (!allUnicode) {
    recommendations.push('Custom Discord emojis detected');
    recommendations.push('Consider using Unicode emojis for better compatibility');
}

// Check for potential display issues
Object.entries(emojis).forEach(([key, emoji]) => {
    if (emoji.length > 10) {
        recommendations.push(`Emoji for "${key}" is unusually long (${emoji.length} characters)`);
    }
});

if (recommendations.length === 0) {
    console.log('✅ All emojis configured correctly!');
} else {
    recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
    });
}

console.log('\n✅ Emoji test complete!\n');