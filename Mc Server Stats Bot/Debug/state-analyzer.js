// ═══════════════════════════════════════════════════════════
// 📊 STATE ANALYZER
// Analyzes state files for issues and statistics
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('📊 State Analyzer\n');

// Pfade angepasst, um aus dem Debug-Ordner nach oben zu schauen
const statesDir = path.join(__dirname, '../states');
const configsDir = path.join(__dirname, '../configs');

if (!fs.existsSync(statesDir)) {
    console.log('ℹ️  No states directory found (normal for first run)');
    process.exit(0);
}

const stateFiles = fs.readdirSync(statesDir)
    .filter(f => f.startsWith('guild_') && f.endsWith('.json'));

if (stateFiles.length === 0) {
    console.log('ℹ️  No state files found (normal before first monitoring)');
    process.exit(0);
}

console.log(`📋 Analyzing ${stateFiles.length} state file(s)\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('    📊 STATE ANALYSIS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let totalMessages = 0;
let activeMessages = 0;
let orphanedMessages = 0;
let oldestUpdate = null;
let newestUpdate = null;

const guildStats = [];

stateFiles.forEach((file, index) => {
    const state = JSON.parse(fs.readFileSync(path.join(statesDir, file), 'utf8'));
    const guildId = file.replace('guild_', '').replace('.json', '');
    
    // Load corresponding config
    const configFile = path.join(configsDir, file);
    let config = null;
    let guildName = 'Unknown';
    
    if (fs.existsSync(configFile)) {
        config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        guildName = (config._guild_info && config._guild_info.guildName) || 'Unknown';
    }
    
    console.log(`${index + 1}. ${guildName}`);
    console.log(`   Guild ID: ${guildId}`);
    console.log(`   State File: ${file}`);
    
    const servers = state.servers || {};
    const messageCount = Object.keys(servers).length;
    totalMessages += messageCount;
    
    console.log(`   Total Entries: ${messageCount}`);
    
    let active = 0;
    let orphaned = 0;
    
    Object.entries(servers).forEach(([channelId, data]) => {
        if (data && data.messageID) {
            active++;
            activeMessages++;
            
            if (config && config.servers) {
                const serverExists = config.servers.some(s => s.channelID === channelId);
                if (!serverExists) {
                    orphaned++;
                    orphanedMessages++;
                }
            }
            
            if (data.lastUpdate) {
                const updateTime = new Date(data.lastUpdate);
                if (!oldestUpdate || updateTime < oldestUpdate) oldestUpdate = updateTime;
                if (!newestUpdate || updateTime > newestUpdate) newestUpdate = updateTime;
            }
        }
    });
    
    console.log(`   Active Messages: ${active}`);
    if (orphaned > 0) console.log(`   ⚠️  Orphaned Messages: ${orphaned}`);
    
    guildStats.push({ name: guildName, total: messageCount, active, orphaned });
    console.log('');
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('    📈 STATISTICS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`Total State Files: ${stateFiles.length}`);
console.log(`Total Message Entries: ${totalMessages}`);
console.log(`Active Messages: ${activeMessages}`);
if (orphanedMessages > 0) console.log(`⚠️  Orphaned Messages: ${orphanedMessages}`);

if (oldestUpdate && newestUpdate) {
    console.log(`\nOldest Update: ${oldestUpdate.toLocaleString()}`);
    console.log(`Newest Update: ${newestUpdate.toLocaleString()}`);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('    💡 RECOMMENDATIONS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const recommendations = [];
if (orphanedMessages > 0) recommendations.push(`Clean up ${orphanedMessages} orphaned messages.`);
if (activeMessages === 0) recommendations.push('No active monitoring messages found.');

if (recommendations.length === 0) {
    console.log('✅ No issues found - states look healthy!');
} else {
    recommendations.forEach((rec, i) => console.log(`${i + 1}. ${rec}`));
}

console.log('\n✅ State analysis complete!\n');