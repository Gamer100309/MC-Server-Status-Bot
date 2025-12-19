// ═══════════════════════════════════════════════════════════
//  🔍 ERROR ANALYZER
//  Analyzes log files for errors and patterns
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🔍 Error Analyzer\n');

const logsDir = '../logs';

if (!fs.existsSync(logsDir)) {
    console.log('ℹ️  No logs directory found (normal for first run)');
    process.exit(0);
}

const logFiles = fs.readdirSync(logsDir)
    .filter(f => f.startsWith('bot-') && f.endsWith('.log'))
    .sort()
    .reverse(); // Newest first

if (logFiles.length === 0) {
    console.log('ℹ️  No log files found');
    process.exit(0);
}

console.log(`📋 Found ${logFiles.length} log file(s)\n`);

// Analyze most recent log
const latestLog = logFiles[0];
console.log(`📄 Analyzing: ${latestLog}\n`);

const content = fs.readFileSync(path.join(logsDir, latestLog), 'utf8');
const lines = content.split('\n');

// Error patterns
const errorPatterns = {
    errors: /\[ERROR\]/i,
    warnings: /\[WARNING\]/i,
    crashes: /(crashed|fatal|exception)/i,
    timeouts: /(timeout|timed out)/i,
    permissions: /(permission|forbidden)/i,
    network: /(network|connection|econnrefused)/i,
    discord: /(discord|api error)/i
};

const stats = {
    totalLines: lines.length,
    errors: [],
    warnings: [],
    crashes: [],
    timeouts: [],
    permissions: [],
    network: [],
    discord: []
};

// Analyze each line
lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    for (const [type, pattern] of Object.entries(errorPatterns)) {
        if (pattern.test(line)) {
            stats[type].push({
                line: index + 1,
                text: line.trim()
            });
        }
    }
});

// Display results
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📊 ANALYSIS RESULTS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`📋 Total Lines: ${stats.totalLines}\n`);

const issues = [
    { name: 'Errors', data: stats.errors, icon: '❌' },
    { name: 'Warnings', data: stats.warnings, icon: '⚠️' },
    { name: 'Crashes', data: stats.crashes, icon: '💥' },
    { name: 'Timeouts', data: stats.timeouts, icon: '⏱️' },
    { name: 'Permission Issues', data: stats.permissions, icon: '🔒' },
    { name: 'Network Issues', data: stats.network, icon: '🌐' },
    { name: 'Discord API Issues', data: stats.discord, icon: '🤖' }
];

let totalIssues = 0;

issues.forEach(issue => {
    const count = issue.data.length;
    totalIssues += count;
    
    if (count > 0) {
        console.log(`${issue.icon} ${issue.name}: ${count}`);
        
        // Show first 3 occurrences
        issue.data.slice(0, 3).forEach(item => {
            console.log(`   Line ${item.line}: ${item.text.substring(0, 80)}...`);
        });
        
        if (count > 3) {
            console.log(`   ... and ${count - 3} more\n`);
        } else {
            console.log('');
        }
    }
});

if (totalIssues === 0) {
    console.log('✅ No issues found in log file!\n');
} else {
    console.log(`📊 Total Issues: ${totalIssues}\n`);
    
    // Recommendations
    console.log('💡 Recommendations:');
    
    if (stats.errors.length > 5) {
        console.log('   ⚠️  High error count - review error messages above');
    }
    
    if (stats.crashes.length > 0) {
        console.log('   🔴 Critical: Bot crashes detected - investigate immediately');
    }
    
    if (stats.permissions.length > 0) {
        console.log('   🔒 Check bot permissions in Discord server settings');
    }
    
    if (stats.network.length > 0) {
        console.log('   🌐 Network issues detected - check internet connection');
    }
    
    if (stats.discord.length > 0) {
        console.log('   🤖 Discord API issues - may be temporary, check Discord status');
    }
    
    console.log('');
}

// Summary of all log files
if (logFiles.length > 1) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📚 ALL LOG FILES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    logFiles.forEach((file, i) => {
        const stats = fs.statSync(path.join(logsDir, file));
        const size = (stats.size / 1024).toFixed(2);
        const date = stats.mtime.toLocaleDateString();
        
        console.log(`${i === 0 ? '📄' : '📃'} ${file}`);
        console.log(`   Size: ${size} KB | Date: ${date}`);
    });
    
    console.log('');
}

console.log('✅ Analysis complete!\n');