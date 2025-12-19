// ═══════════════════════════════════════════════════════════
//  🏥 HEALTH MONITOR
//  Continuous monitoring of bot health
//  Run with: node Debug/health-monitor.js [duration_seconds]
// ═══════════════════════════════════════════════════════════

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const duration = parseInt(process.argv[2]) || 60; // Default 60 seconds

console.log('🏥 Health Monitor\n');
console.log(`Monitoring for ${duration} seconds...\n`);

if (!fs.existsSync('../global-config.json')) {
    console.error('❌ global-config.json not found!');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));

if (!config.token || config.token === "DEIN_BOT_TOKEN") {
    console.error('❌ Bot token not set!');
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const metrics = {
    startTime: null,
    checks: 0,
    pingHistory: [],
    memoryHistory: [],
    errors: [],
    warnings: []
};

function formatBytes(bytes) {
    return (bytes / 1024 / 1024).toFixed(2);
}

function getMemoryUsage() {
    const mem = process.memoryUsage();
    return {
        rss: formatBytes(mem.rss),
        heapUsed: formatBytes(mem.heapUsed),
        heapTotal: formatBytes(mem.heapTotal),
        external: formatBytes(mem.external)
    };
}

function displayStatus() {
    console.clear();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   🏥 HEALTH MONITOR - LIVE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const elapsed = Math.floor((Date.now() - metrics.startTime) / 1000);
    const remaining = duration - elapsed;
    
    console.log(`⏱️  Time: ${elapsed}s / ${duration}s (${remaining}s remaining)`);
    console.log(`🔄 Checks: ${metrics.checks}`);
    console.log('');
    
    // Current stats
    const mem = getMemoryUsage();
    console.log('📊 Current Metrics:');
    console.log(`   Ping: ${client.ws.ping}ms`);
    console.log(`   Memory (RSS): ${mem.rss} MB`);
    console.log(`   Heap Used: ${mem.heapUsed} MB`);
    console.log(`   Guilds: ${client.guilds.cache.size}`);
    console.log('');
    
    // Averages
    if (metrics.pingHistory.length > 0) {
        const avgPing = (metrics.pingHistory.reduce((a, b) => a + b, 0) / metrics.pingHistory.length).toFixed(2);
        const minPing = Math.min(...metrics.pingHistory);
        const maxPing = Math.max(...metrics.pingHistory);
        
        console.log('📈 Ping Statistics:');
        console.log(`   Average: ${avgPing}ms`);
        console.log(`   Min: ${minPing}ms`);
        console.log(`   Max: ${maxPing}ms`);
        console.log('');
    }
    
    // Issues
    if (metrics.errors.length > 0) {
        console.log('❌ Errors:');
        metrics.errors.slice(-5).forEach(err => {
            console.log(`   ${err}`);
        });
        console.log('');
    }
    
    if (metrics.warnings.length > 0) {
        console.log('⚠️  Warnings:');
        metrics.warnings.slice(-5).forEach(warn => {
            console.log(`   ${warn}`);
        });
        console.log('');
    }
    
    // Status bar
    const progress = Math.floor((elapsed / duration) * 40);
    const bar = '█'.repeat(progress) + '░'.repeat(40 - progress);
    console.log(`Progress: [${bar}] ${Math.floor((elapsed / duration) * 100)}%`);
}

client.once('ready', () => {
    console.log('✅ Bot connected, starting monitoring...\n');
    
    metrics.startTime = Date.now();
    
    // Monitor every 2 seconds
    const interval = setInterval(() => {
        metrics.checks++;
        
        // Collect metrics
        const ping = client.ws.ping;
        metrics.pingHistory.push(ping);
        
        const mem = getMemoryUsage();
        metrics.memoryHistory.push(parseFloat(mem.rss));
        
        // Check for issues
        if (ping > 300) {
            metrics.warnings.push(`High ping: ${ping}ms`);
        }
        
        if (parseFloat(mem.heapUsed) > 500) {
            metrics.warnings.push(`High memory: ${mem.heapUsed} MB`);
        }
        
        displayStatus();
        
        // Check if monitoring duration reached
        const elapsed = Math.floor((Date.now() - metrics.startTime) / 1000);
        if (elapsed >= duration) {
            clearInterval(interval);
            generateReport();
        }
    }, 2000);
});

client.on('error', error => {
    metrics.errors.push(`Client error: ${error.message}`);
});

function generateReport() {
    console.clear();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📊 HEALTH REPORT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log(`Duration: ${duration} seconds`);
    console.log(`Checks: ${metrics.checks}`);
    console.log('');
    
    // Ping stats
    if (metrics.pingHistory.length > 0) {
        const avgPing = (metrics.pingHistory.reduce((a, b) => a + b, 0) / metrics.pingHistory.length).toFixed(2);
        const minPing = Math.min(...metrics.pingHistory);
        const maxPing = Math.max(...metrics.pingHistory);
        
        console.log('📡 Ping Statistics:');
        console.log(`   Average: ${avgPing}ms`);
        console.log(`   Min: ${minPing}ms`);
        console.log(`   Max: ${maxPing}ms`);
        
        if (avgPing > 200) {
            console.log('   ⚠️  High average latency');
        } else if (avgPing < 100) {
            console.log('   ✅ Excellent latency');
        }
        console.log('');
    }
    
    // Memory stats
    if (metrics.memoryHistory.length > 0) {
        const avgMem = (metrics.memoryHistory.reduce((a, b) => a + b, 0) / metrics.memoryHistory.length).toFixed(2);
        const minMem = Math.min(...metrics.memoryHistory).toFixed(2);
        const maxMem = Math.max(...metrics.memoryHistory).toFixed(2);
        
        console.log('💾 Memory Statistics:');
        console.log(`   Average: ${avgMem} MB`);
        console.log(`   Min: ${minMem} MB`);
        console.log(`   Max: ${maxMem} MB`);
        
        if (avgMem > 500) {
            console.log('   ⚠️  High memory usage');
        } else if (avgMem < 200) {
            console.log('   ✅ Good memory usage');
        }
        console.log('');
    }
    
    // Issues summary
    console.log('📋 Issues Summary:');
    console.log(`   Errors: ${metrics.errors.length}`);
    console.log(`   Warnings: ${metrics.warnings.length}`);
    console.log('');
    
    // Health score
    let score = 100;
    if (metrics.errors.length > 0) score -= 30;
    if (metrics.warnings.length > 5) score -= 20;
    if (metrics.pingHistory.some(p => p > 300)) score -= 10;
    
    console.log(`🏆 Health Score: ${score}/100`);
    
    if (score >= 90) {
        console.log('   ✅ Excellent health!');
    } else if (score >= 70) {
        console.log('   🟡 Good health, minor issues');
    } else if (score >= 50) {
        console.log('   🟠 Moderate health, needs attention');
    } else {
        console.log('   🔴 Poor health, immediate action required');
    }
    
    console.log('\n✅ Monitoring complete!\n');
    
    process.exit(0);
}

console.log('🔄 Connecting to Discord...\n');

client.login(config.token).catch(e => {
    console.error(`❌ Login failed: ${e.message}`);
    process.exit(1);
});