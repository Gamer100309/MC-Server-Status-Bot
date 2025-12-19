// ═══════════════════════════════════════════════════════════
//  🌐 NETWORK TEST
//  Tests network connectivity and API endpoints
// ═══════════════════════════════════════════════════════════

const https = require('https');
const { status } = require('minecraft-server-util');

console.log('🌐 Network Test\n');

const tests = [
    {
        name: 'Discord API',
        url: 'https://discord.com/api/v10',
        critical: true
    },
    {
        name: 'Discord CDN',
        url: 'https://cdn.discordapp.com',
        critical: false
    },
    {
        name: 'Discord Gateway',
        url: 'https://gateway.discord.gg',
        critical: true
    }
];

async function testUrl(url) {
    return new Promise((resolve) => {
        const start = Date.now();
        
        const request = https.get(url, (res) => {
            const time = Date.now() - start;
            resolve({
                success: true,
                status: res.statusCode,
                time
            });
        });
        
        request.on('error', (err) => {
            resolve({
                success: false,
                error: err.message
            });
        });
        
        request.setTimeout(5000, () => {
            request.destroy();
            resolve({
                success: false,
                error: 'Timeout'
            });
        });
    });
}

async function testMinecraftServer() {
    try {
        const result = await status('mc.hypixel.net', 25565, { timeout: 5000 });
        return {
            success: true,
            online: result.players.online,
            max: result.players.max,
            version: result.version.name
        };
    } catch (e) {
        return {
            success: false,
            error: e.message
        };
    }
}

(async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   🌐 API CONNECTIVITY TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        process.stdout.write(`Testing ${test.name}... `);
        
        const result = await testUrl(test.url);
        
        if (result.success) {
            console.log(`✅ OK (${result.time}ms)`);
            passed++;
        } else {
            console.log(`❌ FAILED: ${result.error}`);
            failed++;
            
            if (test.critical) {
                console.log('   ⚠️  This is a critical endpoint!');
            }
        }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   🎮 MINECRAFT SERVER TEST');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('Testing Hypixel (public test server)...\n');
    
    const mcResult = await testMinecraftServer();
    
    if (mcResult.success) {
        console.log('✅ Minecraft server query successful!');
        console.log(`   Players: ${mcResult.online}/${mcResult.max}`);
        console.log(`   Version: ${mcResult.version}\n`);
    } else {
        console.log('❌ Minecraft server query failed!');
        console.log(`   Error: ${mcResult.error}\n`);
        failed++;
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed > 0) {
        console.log('\n⚠️  Network issues detected!');
        console.log('\n💡 Possible causes:');
        console.log('   - Firewall blocking connections');
        console.log('   - No internet connection');
        console.log('   - Discord API temporarily down');
        console.log('   - Proxy/VPN interfering');
        console.log('');
        process.exit(1);
    } else {
        console.log('\n✅ All network tests passed!\n');
        process.exit(0);
    }
})();