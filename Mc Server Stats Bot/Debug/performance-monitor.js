// ═══════════════════════════════════════════════════════════
//  ⚡ PERFORMANCE MONITOR
//  Monitors bot performance metrics
// ═══════════════════════════════════════════════════════════

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

console.log('⚡ Performance Monitor\n');

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

let startTime;
let readyTime;

console.log('🔄 Starting performance test...\n');
startTime = Date.now();

client.once('ready', async () => {
    readyTime = Date.now();
    const loginTime = readyTime - startTime;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   ⚡ PERFORMANCE METRICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Login Performance
    console.log('🚀 Startup Performance:');
    console.log(`   Login Time: ${loginTime}ms`);
    
    let rating = '🔴 Slow';
    if (loginTime < 1000) rating = '🟢 Excellent';
    else if (loginTime < 2000) rating = '🟡 Good';
    else if (loginTime < 3000) rating = '🟠 Moderate';
    
    console.log(`   Rating: ${rating}\n`);
    
    // Memory Usage
    const memUsage = process.memoryUsage();
    console.log('💾 Memory Usage:');
    console.log(`   RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Heap Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Heap Total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   External: ${(memUsage.external / 1024 / 1024).toFixed(2)} MB\n`);
    
    // API Latency
    console.log('📡 API Latency:');
    console.log(`   WebSocket Ping: ${client.ws.ping}ms`);
    
    let pingRating = '🔴 High';
    if (client.ws.ping < 100) pingRating = '🟢 Excellent';
    else if (client.ws.ping < 200) pingRating = '🟡 Good';
    else if (client.ws.ping < 300) pingRating = '🟠 Moderate';
    
    console.log(`   Rating: ${pingRating}\n`);
    
    // Guild Stats
    console.log('🌐 Guild Statistics:');
    console.log(`   Total Guilds: ${client.guilds.cache.size}`);
    
    let totalMembers = 0;
    let totalChannels = 0;
    
    client.guilds.cache.forEach(guild => {
        totalMembers += guild.memberCount;
        totalChannels += guild.channels.cache.size;
    });
    
    console.log(`   Total Members: ${totalMembers}`);
    console.log(`   Total Channels: ${totalChannels}\n`);
    
    // Cache Stats
    console.log('📦 Cache Statistics:');
    console.log(`   Guilds Cached: ${client.guilds.cache.size}`);
    console.log(`   Channels Cached: ${client.channels.cache.size}`);
    console.log(`   Users Cached: ${client.users.cache.size}\n`);
    
    // Process Info
    console.log('⚙️ Process Information:');
    console.log(`   Node Version: ${process.version}`);
    console.log(`   Platform: ${process.platform}`);
    console.log(`   Uptime: ${(process.uptime()).toFixed(2)}s`);
    console.log(`   PID: ${process.pid}\n`);
    
    // Recommendations
    console.log('💡 Recommendations:');
    
    const recommendations = [];
    
    if (loginTime > 3000) {
        recommendations.push('⚠️  Login time is slow - check internet connection');
    }
    
    if (client.ws.ping > 300) {
        recommendations.push('⚠️  High API latency - consider switching hosting region');
    }
    
    if (memUsage.heapUsed / memUsage.heapTotal > 0.9) {
        recommendations.push('⚠️  High memory usage - consider optimization');
    }
    
    if (recommendations.length === 0) {
        console.log('   ✅ Performance is optimal!\n');
    } else {
        recommendations.forEach(rec => console.log(`   ${rec}`));
        console.log('');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Performance test complete!\n');
    
    process.exit(0);
});

client.on('error', error => {
    console.error('❌ Client error:', error.message);
    process.exit(1);
});

client.login(config.token).catch(e => {
    console.error(`❌ Login failed: ${e.message}`);
    process.exit(1);
});