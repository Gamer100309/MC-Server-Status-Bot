// ═══════════════════════════════════════════════════════════
//  🔧 CONFIG VALIDATOR
//  Deep validation of all configuration files
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🔧 Config Validator\n');

let issues = 0;
let warnings = 0;

// ═══════════════════════════════════════════════════════════
// 1. GLOBAL CONFIG
// ═══════════════════════════════════════════════════════════

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📋 GLOBAL CONFIG');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (!fs.existsSync('../global-config.json')) {
    console.error('❌ global-config.json not found!');
    issues++;
} else {
    try {
        const config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));
        
        // Token validation
        if (!config.token) {
            console.error('❌ Token missing');
            issues++;
        } else if (config.token === "DEIN_BOT_TOKEN" || config.token === "YOUR_BOT_TOKEN") {
            console.error('❌ Token not set (still default value)');
            issues++;
        } else if (config.token.length < 50) {
            console.warn('⚠️  Token seems too short');
            warnings++;
        } else {
            console.log('✅ Token: Valid format');
        }
        
        // Defaults validation
        if (!config.defaults) {
            console.error('❌ defaults section missing');
            issues++;
        } else {
            const d = config.defaults;
            
            // Update interval
            if (!d.updateInterval) {
                console.error('❌ updateInterval missing');
                issues++;
            } else if (d.updateInterval < 5000) {
                console.warn('⚠️  updateInterval very short (may cause rate limits)');
                warnings++;
            } else if (d.updateInterval > 300000) {
                console.warn('⚠️  updateInterval very long (>5 minutes)');
                warnings++;
            } else {
                console.log(`✅ Update Interval: ${d.updateInterval / 1000}s`);
            }
            
            // Colors validation
            if (!d.embedColors) {
                console.error('❌ embedColors missing');
                issues++;
            } else {
                const hexPattern = /^#[0-9A-F]{6}$/i;
                
                if (!hexPattern.test(d.embedColors.online)) {
                    console.error('❌ Invalid online color (must be hex like #00FF00)');
                    issues++;
                } else {
                    console.log(`✅ Online Color: ${d.embedColors.online}`);
                }
                
                if (!hexPattern.test(d.embedColors.offline)) {
                    console.error('❌ Invalid offline color (must be hex like #FF0000)');
                    issues++;
                } else {
                    console.log(`✅ Offline Color: ${d.embedColors.offline}`);
                }
            }
            
            // Emojis
            if (!d.defaultEmojis) {
                console.error('❌ defaultEmojis missing');
                issues++;
            } else {
                const requiredEmojis = ['online', 'offline', 'ip', 'version', 'players', 'ping', 'port', 'playerList', 'motd'];
                const missing = requiredEmojis.filter(e => !d.defaultEmojis[e]);
                
                if (missing.length > 0) {
                    console.error(`❌ Missing emojis: ${missing.join(', ')}`);
                    issues++;
                } else {
                    console.log(`✅ Emojis: All ${requiredEmojis.length} defined`);
                }
            }
            
            // Text settings
            if (!d.textSettings) {
                console.error('❌ textSettings missing');
                issues++;
            } else {
                if (!d.textSettings.defaultLanguage) {
                    console.error('❌ defaultLanguage missing');
                    issues++;
                } else if (!['de', 'en'].includes(d.textSettings.defaultLanguage)) {
                    console.warn(`⚠️  Unusual default language: ${d.textSettings.defaultLanguage}`);
                    warnings++;
                } else {
                    console.log(`✅ Default Language: ${d.textSettings.defaultLanguage}`);
                }
            }
        }
        
    } catch (e) {
        console.error(`❌ Error parsing global-config.json: ${e.message}`);
        issues++;
    }
}

// ═══════════════════════════════════════════════════════════
// 2. GUILD CONFIGS
// ═══════════════════════════════════════════════════════════

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🌐 GUILD CONFIGS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const configsDir = '../configs';

if (!fs.existsSync(configsDir)) {
    console.log('ℹ️  No configs directory yet (normal for first run)');
} else {
    const guildFiles = fs.readdirSync(configsDir)
        .filter(f => f.startsWith('guild_') && f.endsWith('.json'));
    
    if (guildFiles.length === 0) {
        console.log('ℹ️  No guild configs yet');
    } else {
        console.log(`📋 Validating ${guildFiles.length} guild config(s):\n`);
        
        guildFiles.forEach(file => {
            try {
                const config = JSON.parse(fs.readFileSync(path.join(configsDir, file), 'utf8'));
                const guildName = config._guild_info?.guildName || 'Unknown';
                
                console.log(`🏰 ${guildName} (${file})`);
                
                // Validate servers
                if (!config.servers) {
                    console.warn('   ⚠️  No servers array');
                    warnings++;
                } else {
                    console.log(`   Servers: ${config.servers.length}`);
                    
                    config.servers.forEach((srv, i) => {
                        if (!srv.serverName) {
                            console.error(`   ❌ Server ${i + 1}: Missing serverName`);
                            issues++;
                        }
                        
                        if (!srv.serverIP) {
                            console.error(`   ❌ Server ${i + 1}: Missing serverIP`);
                            issues++;
                        }
                        
                        if (!srv.serverPort) {
                            console.error(`   ❌ Server ${i + 1}: Missing serverPort`);
                            issues++;
                        } else if (srv.serverPort < 1 || srv.serverPort > 65535) {
                            console.error(`   ❌ Server ${i + 1}: Invalid port ${srv.serverPort}`);
                            issues++;
                        }
                        
                        if (!srv.channelID) {
                            console.error(`   ❌ Server ${i + 1}: Missing channelID`);
                            issues++;
                        }
                    });
                }
                
                // Validate text settings
                if (config.globalTextSettings) {
                    console.log(`   Language: ${config.globalTextSettings.defaultLanguage || 'not set'}`);
                }
                
                console.log('');
                
            } catch (e) {
                console.error(`❌ Error parsing ${file}: ${e.message}`);
                issues++;
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════
// 3. SUMMARY
// ═══════════════════════════════════════════════════════════

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📊 VALIDATION SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`❌ Issues: ${issues}`);
console.log(`⚠️  Warnings: ${warnings}`);

if (issues === 0 && warnings === 0) {
    console.log('\n✅ All configurations valid!\n');
    process.exit(0);
} else if (issues === 0) {
    console.log('\n✅ No critical issues, but check warnings above\n');
    process.exit(0);
} else {
    console.log('\n❌ Configuration has issues! Please fix them before starting the bot.\n');
    process.exit(1);
}