// ═══════════════════════════════════════════════════════════
//  🌐 GUILDS CHECK
//  Analyzes all guild configurations
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking guild configs...\n');

const configsDir = '../configs';

if (!fs.existsSync(configsDir)) {
    console.log('ℹ️  No ./configs directory yet (will be created on first run)');
    process.exit(0);
}

// Auto-discover all guild configs
const guildFiles = fs.readdirSync(configsDir)
    .filter(f => f.startsWith('guild_') && f.endsWith('.json'));

if (guildFiles.length === 0) {
    console.log('ℹ️  No guild configs yet (normal for first run)');
    process.exit(0);
}

console.log(`📋 Found ${guildFiles.length} guild(s):\n`);

let totalServers = 0;

for (const file of guildFiles) {
    try {
        const config = JSON.parse(fs.readFileSync(path.join(configsDir, file), 'utf8'));
        
        const guildName = config._guild_info?.guildName || 'Unknown';
        const serverCount = config.servers?.length || 0;
        
        console.log(`✅ ${guildName}`);
        console.log(`   File: ${file}`);
        console.log(`   Servers: ${serverCount}`);
        
        if (config.globalTextSettings) {
            console.log(`   Language: ${config.globalTextSettings.defaultLanguage}`);
        }
        
        // Validate servers
        if (config.servers && config.servers.length > 0) {
            config.servers.forEach((srv, i) => {
                console.log(`   └─ Server ${i + 1}: ${srv.serverName}`);
                console.log(`      IP: ${srv.serverIP}:${srv.serverPort}`);
                console.log(`      Channel: ${srv.channelID}`);
                
                // Check for common issues
                if (!srv.updateInterval) {
                    console.warn(`      ⚠️  No update interval set`);
                }
                
                if (!srv.embedSettings) {
                    console.warn(`      ⚠️  No embed settings`);
                }
            });
        }
        
        totalServers += serverCount;
        console.log('');
        
    } catch (e) {
        console.error(`❌ ${file} - ERROR: ${e.message}`);
    }
}

console.log(`📊 Total: ${guildFiles.length} guild(s), ${totalServers} server(s)`);
console.log('\n✅ Guild configs check passed!');