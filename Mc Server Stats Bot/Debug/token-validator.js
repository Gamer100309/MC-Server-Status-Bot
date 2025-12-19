// ═══════════════════════════════════════════════════════════
//  🔑 TOKEN VALIDATOR
//  Validates Discord bot token format and permissions
// ═══════════════════════════════════════════════════════════

const https = require('https');
const fs = require('fs');

console.log('🔑 Token Validator\n');

if (!fs.existsSync('../global-config.json')) {
    console.error('❌ global-config.json not found!');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔍 TOKEN VALIDATION');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const token = config.token;

// Basic format checks
console.log('📋 Format Checks:\n');

if (!token) {
    console.error('❌ Token is missing!');
    process.exit(1);
}

if (token === "DEIN_BOT_TOKEN" || token === "YOUR_BOT_TOKEN") {
    console.error('❌ Token not set (still default value)');
    console.log('\n💡 To fix:');
    console.log('   1. Go to https://discord.com/developers/applications');
    console.log('   2. Select your bot application');
    console.log('   3. Go to "Bot" section');
    console.log('   4. Click "Reset Token" and copy it');
    console.log('   5. Paste it in global-config.json\n');
    process.exit(1);
}

console.log(`✅ Token present: ${token.substring(0, 30)}...`);

// Length check
if (token.length < 50) {
    console.error('❌ Token seems too short (should be ~70+ characters)');
    process.exit(1);
}
console.log(`✅ Token length: ${token.length} characters`);

// Structure check (Discord tokens have 3 parts separated by dots)
const parts = token.split('.');
if (parts.length !== 3) {
    console.error('❌ Token format invalid (should have 3 parts separated by dots)');
    process.exit(1);
}
console.log('✅ Token structure: Valid (3 parts)');

// Decode bot ID from token
try {
    const botId = Buffer.from(parts[0], 'base64').toString('utf-8');
    if (botId && /^\d+$/.test(botId)) {
        console.log(`✅ Bot ID: ${botId}`);
    } else {
        console.warn('⚠️  Could not decode bot ID from token');
    }
} catch (e) {
    console.warn('⚠️  Could not decode bot ID from token');
}

// API validation
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🌐 API VALIDATION');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Testing token with Discord API...\n');

const options = {
    hostname: 'discord.com',
    path: '/api/v10/users/@me',
    method: 'GET',
    headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`Response Status: ${res.statusCode}\n`);
        
        if (res.statusCode === 200) {
            try {
                const botInfo = JSON.parse(data);
                
                console.log('✅ Token is VALID!\n');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('   🤖 BOT INFORMATION');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                
                console.log(`Username: ${botInfo.username}#${botInfo.discriminator}`);
                console.log(`ID: ${botInfo.id}`);
                console.log(`Bot: ${botInfo.bot ? 'Yes' : 'No'}`);
                console.log(`Verified: ${botInfo.verified ? 'Yes' : 'No'}`);
                
                if (botInfo.avatar) {
                    console.log(`Avatar: https://cdn.discordapp.com/avatars/${botInfo.id}/${botInfo.avatar}.png`);
                }
                
                console.log('\n💡 Next steps:');
                console.log('   1. Make sure bot is added to your server');
                console.log('   2. Bot needs "applications.commands" scope');
                console.log('   3. Run: node Debug/test-bot-connection.js');
                
                console.log('\n🔗 Invite Link:');
                console.log(`   https://discord.com/api/oauth2/authorize?client_id=${botInfo.id}&permissions=117760&scope=bot%20applications.commands`);
                
                console.log('\n✅ Token validation complete!\n');
                process.exit(0);
                
            } catch (e) {
                console.error('❌ Could not parse bot information');
                process.exit(1);
            }
        } else if (res.statusCode === 401) {
            console.error('❌ Token is INVALID!');
            console.log('\n💡 Common causes:');
            console.log('   - Token was reset in Discord Developer Portal');
            console.log('   - Wrong token copied');
            console.log('   - Extra spaces in token');
            console.log('\n🔧 To fix:');
            console.log('   1. Go to https://discord.com/developers/applications');
            console.log('   2. Select your bot');
            console.log('   3. Go to "Bot" section');
            console.log('   4. Click "Reset Token"');
            console.log('   5. Copy the NEW token (you only see it once!)');
            console.log('   6. Paste it in global-config.json\n');
            process.exit(1);
        } else if (res.statusCode === 429) {
            console.error('❌ Rate limited by Discord API');
            console.log('   Wait a moment and try again\n');
            process.exit(1);
        } else {
            console.error(`❌ Unexpected response: ${res.statusCode}`);
            console.log(`   ${data}\n`);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Network error: ${e.message}`);
    console.log('\n💡 Check:');
    console.log('   - Internet connection');
    console.log('   - Firewall settings');
    console.log('   - Proxy/VPN configuration\n');
    process.exit(1);
});

req.setTimeout(10000, () => {
    console.error('❌ Request timeout');
    console.log('   Check your internet connection\n');
    req.destroy();
    process.exit(1);
});

req.end();