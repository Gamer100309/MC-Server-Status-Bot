// ═══════════════════════════════════════════════════════════
//  📄 EXPORT REPORT
//  Generates complete system report
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('📄 System Report Generator\n');

const reportFile = `../Debug/System-Reports/system-report-${new Date().toISOString().slice(0, 10)}.txt`;
let report = '';

function addLine(text = '') {
    report += text + '\n';
    console.log(text);
}

function addSection(title) {
    const line = '═'.repeat(60);
    addLine(line);
    addLine(`  ${title}`);
    addLine(line);
    addLine();
}

// ═══════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════

addSection('🤖 MINECRAFT STATUS BOT - SYSTEM REPORT');
addLine(`Generated: ${new Date().toLocaleString()}`);
addLine(`Node Version: ${process.version}`);
addLine(`Platform: ${process.platform} ${process.arch}`);
addLine();

// ═══════════════════════════════════════════════════════════
// 1. CONFIGURATION
// ═══════════════════════════════════════════════════════════

addSection('⚙️ CONFIGURATION');

if (fs.existsSync('../global-config.json')) {
    const config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));
    
    addLine('Global Config:');
    addLine(`  Token: ${config.token ? (config.token.substring(0, 30) + '...') : 'NOT SET'}`);
    addLine(`  Verbose Logging: ${config.verboseLogging}`);
    addLine(`  Default Update Interval: ${config.defaults?.updateInterval / 1000}s`);
    addLine(`  Default Language: ${config.defaults?.textSettings?.defaultLanguage || 'en'}`);
    addLine(`  Online Color: ${config.defaults?.embedColors?.online}`);
    addLine(`  Offline Color: ${config.defaults?.embedColors?.offline}`);
} else {
    addLine('❌ Global config not found!');
}

addLine();

// ═══════════════════════════════════════════════════════════
// 2. GUILDS
// ═══════════════════════════════════════════════════════════

addSection('🏰 GUILDS');

if (fs.existsSync('../configs')) {
    const configFiles = fs.readdirSync('../configs')
        .filter(f => f.startsWith('guild_') && f.endsWith('.json'));
    
    addLine(`Total Guilds: ${configFiles.length}`);
    addLine();
    
    let totalServers = 0;
    
    configFiles.forEach((file, i) => {
        const config = JSON.parse(fs.readFileSync(`../configs/${file}`, 'utf8'));
        const guildName = config._guild_info?.guildName || 'Unknown';
        const servers = config.servers || [];
        
        totalServers += servers.length;
        
        addLine(`${i + 1}. ${guildName}`);
        addLine(`   File: ${file}`);
        addLine(`   Servers: ${servers.length}`);
        addLine(`   Language: ${config.globalTextSettings?.defaultLanguage || 'en'}`);
        
        servers.forEach((srv, j) => {
            addLine(`   ${j + 1}. ${srv.serverName} (${srv.serverIP}:${srv.serverPort})`);
        });
        
        addLine();
    });
    
    addLine(`Total Servers: ${totalServers}`);
} else {
    addLine('No guilds configured yet');
}

addLine();

// ═══════════════════════════════════════════════════════════
// 3. LANGUAGES
// ═══════════════════════════════════════════════════════════

addSection('🌐 LANGUAGES');

if (fs.existsSync('../texts')) {
    const langFiles = fs.readdirSync('../texts')
        .filter(f => f.endsWith('.json'));
    
    addLine(`Available Languages: ${langFiles.length}`);
    addLine();
    
    langFiles.forEach(file => {
        const data = JSON.parse(fs.readFileSync(`../texts/${file}`, 'utf8'));
        
        addLine(`• ${file}`);
        addLine(`  Name: ${data._meta?.languageName || 'Unknown'}`);
        addLine(`  Code: ${data._meta?.language || 'Unknown'}`);
        
        // Count keys
        let keyCount = 0;
        function countKeys(obj) {
            for (const key in obj) {
                if (key === '_meta') continue;
                if (typeof obj[key] === 'object') {
                    countKeys(obj[key]);
                } else if (typeof obj[key] === 'string') {
                    keyCount++;
                }
            }
        }
        countKeys(data);
        
        addLine(`  Keys: ${keyCount}`);
        addLine();
    });
} else {
    addLine('No language files found');
}

addLine();

// ═══════════════════════════════════════════════════════════
// 4. MODULES
// ═══════════════════════════════════════════════════════════

addSection('📦 MODULES');

if (fs.existsSync('../cogs')) {
    const modules = fs.readdirSync('../cogs')
        .filter(f => f.endsWith('.js'));
    
    addLine(`Total Modules: ${modules.length}`);
    addLine();
    
    modules.forEach(mod => {
        addLine(`✓ ${mod}`);
    });
} else {
    addLine('No modules found');
}

addLine();

// ═══════════════════════════════════════════════════════════
// 5. COMMANDS
// ═══════════════════════════════════════════════════════════

addSection('⚙️ COMMANDS');

if (fs.existsSync('../cogs/CommandHandler.js')) {
    const content = fs.readFileSync('../cogs/CommandHandler.js', 'utf8');
    
    const namePattern = /\.setName\(['"]([^'"]+)['"]\)/g;
    const names = [];
    let match;
    
    while ((match = namePattern.exec(content)) !== null) {
        if (match[1].length > 2 && match[1] !== 'channel') {
            names.push(match[1]);
        }
    }
    
    addLine(`Total Commands: ${names.length}`);
    addLine();
    
    names.forEach(name => {
        addLine(`/${name}`);
    });
} else {
    addLine('CommandHandler not found');
}

addLine();

// ═══════════════════════════════════════════════════════════
// 6. FILES
// ═══════════════════════════════════════════════════════════

addSection('📁 FILE SYSTEM');

const dirs = ['configs', 'states', 'Icons', 'logs', 'texts', 'Debug', 'cogs'];

dirs.forEach(dir => {
    if (fs.existsSync(`../${dir}`)) {
        const files = fs.readdirSync(`../${dir}`);
        addLine(`✓ ${dir}/ (${files.length} files)`);
    } else {
        addLine(`✗ ${dir}/ (not found)`);
    }
});

addLine();

// ═══════════════════════════════════════════════════════════
// 7. DEPENDENCIES
// ═══════════════════════════════════════════════════════════

addSection('📦 DEPENDENCIES');

if (fs.existsSync('../package.json')) {
    const pkg = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
    
    if (pkg.dependencies) {
        Object.entries(pkg.dependencies).forEach(([name, version]) => {
            addLine(`${name}: ${version}`);
        });
    }
} else {
    addLine('package.json not found');
}

addLine();

// ═══════════════════════════════════════════════════════════
// 8. LOGS
// ═══════════════════════════════════════════════════════════

addSection('📜 LOGS');

if (fs.existsSync('../logs')) {
    const logFiles = fs.readdirSync('../logs')
        .filter(f => f.endsWith('.log'))
        .sort()
        .reverse();
    
    if (logFiles.length > 0) {
        addLine(`Total Log Files: ${logFiles.length}`);
        addLine(`Latest: ${logFiles[0]}`);
        addLine();
        
        // Show last 10 lines of latest log
        const latestLog = fs.readFileSync(`../logs/${logFiles[0]}`, 'utf8');
        const lines = latestLog.split('\n').filter(l => l.trim());
        
        addLine('Last 10 log entries:');
        lines.slice(-10).forEach(line => {
            addLine(`  ${line}`);
        });
    } else {
        addLine('No log files yet');
    }
} else {
    addLine('Logs directory not found');
}

addLine();

// ═══════════════════════════════════════════════════════════
// SAVE REPORT
// ═══════════════════════════════════════════════════════════

addLine('═'.repeat(60));
addLine('END OF REPORT');
addLine('═'.repeat(60));

fs.writeFileSync(reportFile, report);

console.log(`\n✅ Report saved to: ${reportFile}\n`);