// ═══════════════════════════════════════════════════════════
//  📡 MONITORING SIMULATOR
//  Simulates monitoring without actual Discord connection
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const { status } = require('minecraft-server-util');

console.log('📡 Monitoring Simulator\n');

const configsDir = '../configs';

if (!fs.existsSync(configsDir)) {
    console.error('❌ No configs directory found!');
    process.exit(1);
}

const configFiles = fs.readdirSync(configsDir)
    .filter(f => f.startsWith('guild_') && f.endsWith('.json'));

if (configFiles.length === 0) {
    console.error('❌ No guild configs found!');
    console.log('   Add servers via /setup first\n');
    process.exit(1);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📊 MONITORING CONFIGURATION');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let totalServers = 0;

configFiles.forEach(file => {
    const config = JSON.parse(fs.readFileSync(`../configs/${file}`, 'utf8'));
    const guildName = config._guild_info?.guildName || 'Unknown';
    const servers = config.servers || [];
    
    totalServers += servers.length;
    
    console.log(`🏰 ${guildName}`);
    console.log(`   Servers: ${servers.length}`);
    
    servers.forEach((srv, i) => {
        const interval = (srv.updateInterval || 10000) / 1000;
        console.log(`   ${i + 1}. ${srv.serverName}`);
        console.log(`      IP: ${srv.serverIP}:${srv.serverPort}`);
        console.log(`      Interval: ${interval}s`);
    });
    
    console.log('');
});

if (totalServers === 0) {
    console.log('ℹ️  No servers configured for monitoring\n');
    process.exit(0);
}

console.log(`📊 Total servers to monitor: ${totalServers}\n`);

// ═══════════════════════════════════════════════════════════
// SIMULATION
// ═══════════════════════════════════════════════════════════

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔄 RUNNING SIMULATION');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Simulating one monitoring cycle for all servers...\n');

(async () => {
    const results = {
        online: 0,
        offline: 0,
        errors: []
    };
    
    for (const file of configFiles) {
        const config = JSON.parse(fs.readFileSync(`../configs/${file}`, 'utf8'));
        const guildName = config._guild_info?.guildName || 'Unknown';
        const servers = config.servers || [];
        
        for (const srv of servers) {
            process.stdout.write(`Testing ${srv.serverName}... `);
            
            try {
                const result = await status(srv.serverIP, srv.serverPort, { timeout: 5000 });
                
                console.log(`✅ ONLINE`);
                console.log(`   Players: ${result.players.online}/${result.players.max}`);
                console.log(`   Version: ${result.version.name}`);
                console.log(`   Ping: ${result.roundTripLatency}ms`);
                
                results.online++;
                
            } catch (e) {
                console.log(`❌ OFFLINE`);
                console.log(`   Reason: ${e.message}`);
                
                results.offline++;
                results.errors.push({
                    server: srv.serverName,
                    error: e.message
                });
            }
            
            console.log('');
        }
    }
    
    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📊 SIMULATION RESULTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log(`Total Servers: ${totalServers}`);
    console.log(`🟢 Online: ${results.online}`);
    console.log(`🔴 Offline: ${results.offline}`);
    
    if (results.errors.length > 0) {
        console.log('\n⚠️  Issues detected:');
        results.errors.forEach(err => {
            console.log(`   • ${err.server}: ${err.error}`);
        });
    }
    
    console.log('\n💡 What happens in real monitoring:');
    console.log('   1. Bot connects to Discord');
    console.log('   2. For each server:');
    console.log('      - Query Minecraft server');
    console.log('      - Build embed with status');
    console.log('      - Update Discord message');
    console.log('   3. Wait [updateInterval] seconds');
    console.log('   4. Repeat from step 2');
    
    console.log('\n✅ Simulation complete!\n');
})();