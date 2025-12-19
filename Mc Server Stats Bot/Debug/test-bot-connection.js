// ═══════════════════════════════════════════════════════════
//  🤖 BOT CONNECTION TEST
//  Tests actual Discord connection and command registration
//  Run this separately: node Debug/test-bot-connection.js
// ═══════════════════════════════════════════════════════════

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');

console.log('🔍 Testing bot connection...\n');

// Load config
if (!fs.existsSync('../global-config.json')) {
    console.error('❌ global-config.json not found!');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));

if (!config.token || config.token === "DEIN_BOT_TOKEN" || config.token === "YOUR_BOT_TOKEN") {
    console.error('❌ Bot token not set in global-config.json!');
    process.exit(1);
}

console.log('📋 Config loaded');
console.log(`   Token: ${config.token.substring(0, 30)}...`);

// Create client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

let testsPassed = 0;
let testsFailed = 0;

// Test 1: Login
client.once('ready', async () => {
    console.log('\n✅ Test 1: Login successful');
    console.log(`   Bot: ${client.user.tag}`);
    console.log(`   ID: ${client.user.id}`);
    console.log(`   Guilds: ${client.guilds.cache.size}`);
    testsPassed++;
    
    // Test 2: Guild access
    if (client.guilds.cache.size > 0) {
        console.log('\n✅ Test 2: Guild access');
        client.guilds.cache.forEach(guild => {
            console.log(`   - ${guild.name} (${guild.id})`);
        });
        testsPassed++;
    } else {
        console.log('\n⚠️  Test 2: No guilds (bot not added to any server)');
    }
    
    // Test 3: Command registration
    console.log('\n🔄 Test 3: Command registration...');
    
    try {
        // Auto-discover commands from CommandHandler
        const handlerPath = '../cogs/CommandHandler.js';
        if (!fs.existsSync(handlerPath)) {
            console.error('❌ CommandHandler.js not found!');
            testsFailed++;
        } else {
            const content = fs.readFileSync(handlerPath, 'utf8');
            
            // Extract commands
            const namePattern = /\.setName\(['"]([^'"]+)['"]\)/g;
            const descPattern = /\.setDescription\(['"]([^'"]+)['"]\)/g;
            
            const names = [];
            const descriptions = [];
            let match;
            
            while ((match = namePattern.exec(content)) !== null) {
                if (match[1].length > 2 && match[1] !== 'channel') {
                    names.push(match[1]);
                }
            }
            
            while ((match = descPattern.exec(content)) !== null) {
                descriptions.push(match[1]);
            }
            
            const commands = names.map((name, i) => ({
                name,
                description: descriptions[i] || 'No description'
            }));
            
            console.log(`   Found ${commands.length} commands in CommandHandler.js`);
            
            // Register commands
            const rest = new REST({ version: '10' }).setToken(config.token);
            
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );
            
            console.log('✅ Test 3: Commands registered');
            commands.forEach(cmd => console.log(`   - /${cmd.name}`));
            testsPassed++;
        }
    } catch (e) {
        console.error(`❌ Test 3 failed: ${e.message}`);
        testsFailed++;
    }
    
    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📊 TEST SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Passed: ${testsPassed}`);
    console.log(`❌ Failed: ${testsFailed}`);
    
    if (testsFailed === 0) {
        console.log('\n🎉 All tests passed! Bot is ready!');
        console.log('\n💡 Next steps:');
        console.log('   1. Start bot: node index.js');
        console.log('   2. In Discord: /setup');
        console.log(`\n🔗 Invite link:`);
        console.log(`   https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=412317273088&scope=bot%20applications.commands`);
    } else {
        console.log('\n⚠️  Some tests failed. Check errors above.');
    }
    
    process.exit(testsFailed > 0 ? 1 : 0);
});

client.on('error', error => {
    console.error('❌ Client error:', error.message);
    testsFailed++;
});

console.log('\n🔄 Connecting to Discord...');

client.login(config.token).catch(e => {
    console.error('\n❌ Login failed!');
    console.error(`   ${e.message}`);
    console.error('\n💡 Check:');
    console.error('   - Bot token correct?');
    console.error('   - Bot enabled in Developer Portal?');
    console.error('   - Intents enabled? (Guilds, GuildMessages)');
    process.exit(1);
});