// ═══════════════════════════════════════════════════════════
//  🖼️ ICON TESTER
//  Tests server icon functionality
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const { status } = require('minecraft-server-util');

console.log('🖼️ Server Icon Tester\n');

const iconsDir = '../Icons';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📁 ICONS DIRECTORY CHECK');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (!fs.existsSync(iconsDir)) {
    console.log('⚠️  Icons directory does not exist');
    console.log('   This is normal if bot hasn\'t run yet\n');
} else {
    console.log('✅ Icons directory exists\n');
    
    const guilds = fs.readdirSync(iconsDir)
        .filter(f => f.startsWith('guild_'));
    
    if (guilds.length === 0) {
        console.log('ℹ️  No guild icon folders yet\n');
    } else {
        console.log(`📋 Found ${guilds.length} guild icon folder(s):\n`);
        
        guilds.forEach(guild => {
            const guildPath = path.join(iconsDir, guild);
            const onlineDir = path.join(guildPath, 'online');
            const localDir = path.join(guildPath, 'local');
            
            console.log(`📁 ${guild}`);
            
            // Check online icons
            if (fs.existsSync(onlineDir)) {
                const onlineIcons = fs.readdirSync(onlineDir)
                    .filter(f => f.endsWith('.png'));
                console.log(`   Online icons: ${onlineIcons.length}`);
                
                onlineIcons.forEach(icon => {
                    const iconPath = path.join(onlineDir, icon);
                    const stats = fs.statSync(iconPath);
                    const size = (stats.size / 1024).toFixed(2);
                    console.log(`      • ${icon} (${size} KB)`);
                });
            }
            
            // Check local icons
            if (fs.existsSync(localDir)) {
                const localIcons = fs.readdirSync(localDir)
                    .filter(f => f.endsWith('.png'));
                console.log(`   Local icons: ${localIcons.length}`);
                
                localIcons.forEach(icon => {
                    const iconPath = path.join(localDir, icon);
                    const stats = fs.statSync(iconPath);
                    const size = (stats.size / 1024).toFixed(2);
                    console.log(`      • ${icon} (${size} KB)`);
                });
            }
            
            console.log('');
        });
    }
}

// ═══════════════════════════════════════════════════════════
// TEST ICON RETRIEVAL
// ═══════════════════════════════════════════════════════════

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🎮 LIVE SERVER ICON TEST');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Testing icon retrieval from Hypixel...\n');

(async () => {
    try {
        const result = await status('mc.hypixel.net', 25565, { timeout: 5000 });
        
        if (result.favicon) {
            console.log('✅ Server has favicon!');
            console.log(`   Format: ${result.favicon.substring(0, 30)}...`);
            console.log(`   Length: ${result.favicon.length} characters`);
            
            // Test base64 decoding
            try {
                const base64Data = result.favicon.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                console.log(`   Decoded size: ${(buffer.length / 1024).toFixed(2)} KB`);
                
                // Check if it's a valid PNG
                const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && 
                             buffer[2] === 0x4E && buffer[3] === 0x47;
                
                if (isPng) {
                    console.log('   ✅ Valid PNG format');
                } else {
                    console.log('   ⚠️  Not a PNG file');
                }
                
            } catch (e) {
                console.log(`   ❌ Decoding failed: ${e.message}`);
            }
            
        } else {
            console.log('⚠️  Server has no favicon');
        }
        
        console.log('\n💡 How icons work in this bot:');
        console.log('   1. Bot queries Minecraft server');
        console.log('   2. If server is online and has favicon:');
        console.log('      - Extract base64 favicon data');
        console.log('      - Save to Icons/guild_XXX/online/');
        console.log('   3. When server goes offline:');
        console.log('      - Use saved icon from online/');
        console.log('   4. Custom icons can be placed in:');
        console.log('      - Icons/guild_XXX/local/');
        
        console.log('\n✅ Icon test complete!\n');
        
    } catch (e) {
        console.error(`❌ Failed to query server: ${e.message}\n`);
    }
})();