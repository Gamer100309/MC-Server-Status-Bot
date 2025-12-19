// ═══════════════════════════════════════════════════════════
//  📋 GUILD REPORTER
//  Generates detailed reports for each guild
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('📋 Guild Reporter\n');

const configsDir = '../configs';
const statesDir = '../states';

if (!fs.existsSync(configsDir)) {
    console.log('ℹ️  No configs directory found');
    process.exit(0);
}

const guildFiles = fs.readdirSync(configsDir)
    .filter(f => f.startsWith('guild_') && f.endsWith('.json'));

if (guildFiles.length === 0) {
    console.log('ℹ️  No guild configs found');
    process.exit(0);
}

console.log(`📊 Generating reports for ${guildFiles.length} guild(s)\n`);

guildFiles.forEach((file, index) => {
    const config = JSON.parse(fs.readFileSync(path.join(configsDir, file), 'utf8'));
    const guildId = config._guild_info?.guildId;
    const guildName = config._guild_info?.guildName || 'Unknown';
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   🏰 GUILD ${index + 1}: ${guildName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Basic Info
    console.log('📋 Basic Information:');
    console.log(`   Guild ID: ${guildId}`);
    console.log(`   Setup Date: ${config._guild_info?.setupDate || 'Unknown'}`);
    console.log(`   Config File: ${file}`);
    console.log('');
    
    // Language Settings
    console.log('🌐 Language Settings:');
    const globalLang = config.globalTextSettings?.defaultLanguage || 'en';
    console.log(`   Global Language: ${globalLang}`);
    console.log(`   Custom Texts: ${config.globalTextSettings?.allowCustomTexts ? 'Enabled' : 'Disabled'}`);
    console.log('');
    
    // Server Statistics
    console.log('🎮 Servers:');
    const serverCount = config.servers?.length || 0;
    console.log(`   Total: ${serverCount}`);
    
    if (serverCount > 0) {
        console.log('');
        config.servers.forEach((srv, i) => {
            console.log(`   ${i + 1}. ${srv.serverName}`);
            console.log(`      IP: ${srv.serverIP}:${srv.serverPort}`);
            console.log(`      Channel: ${srv.channelID}`);
            console.log(`      Update Interval: ${(srv.updateInterval || 10000) / 1000}s`);
            
            // Language
            const srvLang = srv.textSettings?.language || 'global';
            console.log(`      Language: ${srvLang === 'global' ? `${srvLang} (${globalLang})` : srvLang}`);
            
            // Embed Settings
            if (srv.embedSettings) {
                const settings = [];
                if (srv.embedSettings.showIP !== false) settings.push('IP');
                if (srv.embedSettings.showPort === true) settings.push('Port');
                if (srv.embedSettings.showPlayerList !== false) settings.push('Players');
                if (srv.embedSettings.showMOTD !== false) settings.push('MOTD');
                console.log(`      Visible Fields: ${settings.join(', ') || 'Default'}`);
            }
            
            // Button Settings
            if (srv.buttonSettings) {
                const buttons = [];
                if (srv.buttonSettings.enabled !== false) {
                    if (srv.buttonSettings.showIPButton !== false) buttons.push('IP');
                    if (srv.buttonSettings.showPortButton === true) buttons.push('Port');
                    if (srv.buttonSettings.showPlayersButton === true) buttons.push('Players');
                }
                console.log(`      Buttons: ${buttons.length > 0 ? buttons.join(', ') : 'Disabled'}`);
            }
            
            // Icon Settings
            console.log(`      Server Icon: ${srv.useServerIcon !== false ? 'Enabled' : 'Disabled'}`);
            
            console.log('');
        });
    }
    
    // State Information
    const stateFile = path.join(statesDir, file);
    if (fs.existsSync(stateFile)) {
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
        
        console.log('📌 State Information:');
        const activeMessages = Object.keys(state.servers || {}).filter(k => state.servers[k]).length;
        console.log(`   Active Messages: ${activeMessages}/${serverCount}`);
        
        if (activeMessages > 0) {
            console.log('   Message IDs:');
            Object.entries(state.servers || {}).forEach(([channelId, data]) => {
                if (data && data.messageID) {
                    const server = config.servers.find(s => s.channelID === channelId);
                    console.log(`      ${server?.serverName || 'Unknown'}: ${data.messageID}`);
                    console.log(`         Status: ${data.lastStatus || 'unknown'}`);
                    console.log(`         Updated: ${data.lastUpdate || 'unknown'}`);
                }
            });
        }
        console.log('');
    }
    
    // Permissions
    console.log('🔐 Permissions:');
    const allowedRoles = config.setupPermissions?.allowedRoles || [];
    console.log(`   Administrator: ${config.setupPermissions?.allowAdministrator !== false ? 'Allowed' : 'Not Allowed'}`);
    console.log(`   Additional Roles: ${allowedRoles.length}`);
    if (allowedRoles.length > 0) {
        allowedRoles.forEach(roleId => {
            console.log(`      - ${roleId}`);
        });
    }
    console.log('');
    
    // Colors
    console.log('🎨 Embed Colors:');
    console.log(`   Online: ${config.embedColors?.online || '#00FF00'}`);
    console.log(`   Offline: ${config.embedColors?.offline || '#FF0000'}`);
    console.log('');
    
    // Footer
    console.log('📝 Other Settings:');
    console.log(`   Footer Text: ${config.footerText || 'mcapi.us'}`);
    console.log('');
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📊 SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let totalServers = 0;
guildFiles.forEach(file => {
    const config = JSON.parse(fs.readFileSync(path.join(configsDir, file), 'utf8'));
    totalServers += config.servers?.length || 0;
});

console.log(`🏰 Total Guilds: ${guildFiles.length}`);
console.log(`🎮 Total Servers: ${totalServers}`);
console.log(`📊 Average Servers per Guild: ${(totalServers / guildFiles.length).toFixed(1)}`);

console.log('\n✅ Report complete!\n');