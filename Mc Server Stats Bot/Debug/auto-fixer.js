// ═══════════════════════════════════════════════════════════
//  🔧 AUTO FIXER
//  Automatically fixes common configuration issues
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🔧 Auto Fixer - Automatic Problem Resolution\n');

const fixes = [];
let autoFixable = 0;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔍 SCANNING FOR ISSUES');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// ═══════════════════════════════════════════════════════════
// 1. CHECK GLOBAL CONFIG
// ═══════════════════════════════════════════════════════════

if (!fs.existsSync('../global-config.json')) {
    fixes.push({
        severity: 'critical',
        issue: 'global-config.json missing',
        fix: 'Create default global-config.json',
        autoFix: () => {
            const defaultConfig = {
                "token": "YOUR_BOT_TOKEN",
                "verboseLogging": true,
                "defaults": {
                    "updateInterval": 10000,
                    "embedColors": {
                        "online": "#00FF00",
                        "offline": "#FF0000"
                    },
                    "defaultEmojis": {
                        "online": "🟢",
                        "offline": "🔴",
                        "ip": "🌐",
                        "version": "⚙️",
                        "players": "👥",
                        "ping": "📶",
                        "port": "🔑",
                        "playerList": "👤",
                        "motd": "📢"
                    },
                    "defaultButtonMessages": {
                        "ipMessage": "📋 **Server IP:**\n```\n{ip}\n```\n**To copy:** Select text and press CTRL+C",
                        "portMessage": "🔑 **Server Port:**\n```\n{port}\n```\n**To copy:** Select text and press CTRL+C",
                        "playersMessage": "👥 **Online Players ({count}/{max}):**\n```\n{players}\n```"
                    },
                    "setupPermissions": {
                        "allowAdministrator": true,
                        "allowedRoles": []
                    },
                    "textSettings": {
                        "defaultLanguage": "en",
                        "allowCustomTexts": true
                    }
                }
            };
            fs.writeFileSync('../global-config.json', JSON.stringify(defaultConfig, null, 2));
            return true;
        }
    });
    autoFixable++;
} else {
    const config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));
    
    // Check for missing textSettings
    if (!config.defaults?.textSettings) {
        fixes.push({
            severity: 'high',
            issue: 'textSettings missing in global-config.json',
            fix: 'Add textSettings to defaults',
            autoFix: () => {
                if (!config.defaults) config.defaults = {};
                config.defaults.textSettings = {
                    "defaultLanguage": "en",
                    "allowCustomTexts": true
                };
                fs.writeFileSync('../global-config.json', JSON.stringify(config, null, 2));
                return true;
            }
        });
        autoFixable++;
    }
    
    // Check for invalid colors
    const hexPattern = /^#[0-9A-F]{6}$/i;
    if (config.defaults?.embedColors) {
        if (!hexPattern.test(config.defaults.embedColors.online)) {
            fixes.push({
                severity: 'medium',
                issue: 'Invalid online color format',
                fix: 'Set to default #00FF00',
                autoFix: () => {
                    config.defaults.embedColors.online = '#00FF00';
                    fs.writeFileSync('../global-config.json', JSON.stringify(config, null, 2));
                    return true;
                }
            });
            autoFixable++;
        }
        
        if (!hexPattern.test(config.defaults.embedColors.offline)) {
            fixes.push({
                severity: 'medium',
                issue: 'Invalid offline color format',
                fix: 'Set to default #FF0000',
                autoFix: () => {
                    config.defaults.embedColors.offline = '#FF0000';
                    fs.writeFileSync('../global-config.json', JSON.stringify(config, null, 2));
                    return true;
                }
            });
            autoFixable++;
        }
    }
}

// ═══════════════════════════════════════════════════════════
// 2. CHECK REQUIRED DIRECTORIES
// ═══════════════════════════════════════════════════════════

const requiredDirs = ['../configs', '../states', '../Icons', '../logs', '../texts'];

requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fixes.push({
            severity: 'medium',
            issue: `Directory missing: ${dir}`,
            fix: `Create ${dir} directory`,
            autoFix: () => {
                fs.mkdirSync(dir, { recursive: true });
                return true;
            }
        });
        autoFixable++;
    }
});

// ═══════════════════════════════════════════════════════════
// 3. CHECK LANGUAGE FILES
// ═══════════════════════════════════════════════════════════

if (!fs.existsSync('../texts/en.json')) {
    fixes.push({
        severity: 'high',
        issue: 'English language file missing',
        fix: 'Cannot auto-create (complex structure)',
        autoFix: null
    });
}

if (!fs.existsSync('../texts/de.json')) {
    fixes.push({
        severity: 'low',
        issue: 'German language file missing',
        fix: 'Cannot auto-create (complex structure)',
        autoFix: null
    });
}

// ═══════════════════════════════════════════════════════════
// 4. CHECK GUILD CONFIGS
// ═══════════════════════════════════════════════════════════

if (fs.existsSync('../configs')) {
    const configFiles = fs.readdirSync('../configs')
        .filter(f => f.startsWith('guild_') && f.endsWith('.json'));
    
    configFiles.forEach(file => {
        try {
            const config = JSON.parse(fs.readFileSync(path.join('../configs', file), 'utf8'));
            
            // Check for missing globalTextSettings
            if (!config.globalTextSettings) {
                fixes.push({
                    severity: 'medium',
                    issue: `${file}: Missing globalTextSettings`,
                    fix: 'Add default globalTextSettings',
                    autoFix: () => {
                        config.globalTextSettings = {
                            "defaultLanguage": "en",
                            "allowCustomTexts": true
                        };
                        fs.writeFileSync(path.join('../configs', file), JSON.stringify(config, null, 2));
                        return true;
                    }
                });
                autoFixable++;
            }
            
            // Check servers for missing textSettings
            if (config.servers) {
                config.servers.forEach((srv, i) => {
                    if (!srv.textSettings) {
                        fixes.push({
                            severity: 'low',
                            issue: `${file}: Server ${i + 1} (${srv.serverName}) missing textSettings`,
                            fix: 'Add default textSettings',
                            autoFix: () => {
                                srv.textSettings = {
                                    "language": "global",
                                    "customTexts": null
                                };
                                fs.writeFileSync(path.join('../configs', file), JSON.stringify(config, null, 2));
                                return true;
                            }
                        });
                        autoFixable++;
                    }
                });
            }
            
        } catch (e) {
            fixes.push({
                severity: 'critical',
                issue: `${file}: Invalid JSON`,
                fix: 'Cannot auto-fix - manual intervention required',
                autoFix: null
            });
        }
    });
}

// ═══════════════════════════════════════════════════════════
// 5. DISPLAY RESULTS
// ═══════════════════════════════════════════════════════════

if (fixes.length === 0) {
    console.log('✅ No issues found - everything looks good!\n');
    process.exit(0);
}

console.log(`Found ${fixes.length} issue(s):\n`);

fixes.forEach((fix, i) => {
    const icon = fix.severity === 'critical' ? '🔴' : 
                 fix.severity === 'high' ? '🟠' : 
                 fix.severity === 'medium' ? '🟡' : '🟢';
    
    console.log(`${i + 1}. ${icon} [${fix.severity.toUpperCase()}]`);
    console.log(`   Issue: ${fix.issue}`);
    console.log(`   Fix: ${fix.fix}`);
    if (fix.autoFix) {
        console.log(`   ✅ Auto-fixable`);
    } else {
        console.log(`   ⚠️  Manual fix required`);
    }
    console.log('');
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📊 SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`Total Issues: ${fixes.length}`);
console.log(`Auto-fixable: ${autoFixable}`);
console.log(`Manual fixes needed: ${fixes.length - autoFixable}\n`);

if (autoFixable === 0) {
    console.log('⚠️  All issues require manual intervention.\n');
    process.exit(1);
}

// ═══════════════════════════════════════════════════════════
// 6. ASK FOR CONFIRMATION
// ═══════════════════════════════════════════════════════════

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`\nApply ${autoFixable} automatic fix(es)? (yes/no): `, async (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('   🔧 APPLYING FIXES');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        let applied = 0;
        let failed = 0;
        
        for (const fix of fixes) {
            if (fix.autoFix) {
                try {
                    const success = fix.autoFix();
                    if (success) {
                        console.log(`✅ Fixed: ${fix.issue}`);
                        applied++;
                    } else {
                        console.log(`❌ Failed: ${fix.issue}`);
                        failed++;
                    }
                } catch (e) {
                    console.log(`❌ Error fixing ${fix.issue}: ${e.message}`);
                    failed++;
                }
            }
        }
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('   📊 RESULTS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        console.log(`✅ Applied: ${applied}`);
        console.log(`❌ Failed: ${failed}`);
        
        if (fixes.length - autoFixable > 0) {
            console.log(`⚠️  Manual fixes still needed: ${fixes.length - autoFixable}`);
        }
        
        if (failed === 0) {
            console.log('\n🎉 All automatic fixes applied successfully!\n');
            console.log('💡 Next step: Run debug-check.bat to verify\n');
        } else {
            console.log('\n⚠️  Some fixes failed. Check errors above.\n');
        }
        
    } else {
        console.log('\nFixes cancelled.\n');
    }
    
    rl.close();
    process.exit(0);
});