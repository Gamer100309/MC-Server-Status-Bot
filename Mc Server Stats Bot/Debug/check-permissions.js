// ═══════════════════════════════════════════════════════════
//  🔐 PERMISSIONS CHECK
//  Validates permission requirements
// ═══════════════════════════════════════════════════════════

const { PermissionsBitField } = require('discord.js');

console.log('🔍 Checking permissions setup...\n');

// Required bot permissions
const requiredPermissions = [
    'ViewChannel',
    'SendMessages',
    'EmbedLinks',
    'AttachFiles',
    'ReadMessageHistory'
];

console.log('📋 Required bot permissions:');

requiredPermissions.forEach(perm => {
    try {
        const flag = PermissionsBitField.Flags[perm];
        if (flag) {
            console.log(`✅ ${perm}`);
        } else {
            console.error(`❌ ${perm} - not found in PermissionsBitField.Flags`);
        }
    } catch (e) {
        console.error(`❌ ${perm} - ERROR: ${e.message}`);
    }
});

// Calculate permission integer
try {
    const permissions = new PermissionsBitField();
    requiredPermissions.forEach(perm => {
        const flag = PermissionsBitField.Flags[perm];
        if (flag) permissions.add(flag);
    });
    
    console.log(`\n📊 Permission integer: ${permissions.bitfield}`);
    console.log('\n💡 Use this invite link:');
    console.log(`   https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=${permissions.bitfield}&scope=bot%20applications.commands`);
} catch (e) {
    console.error(`\n❌ Error calculating permissions: ${e.message}`);
    process.exit(1);
}

console.log('\n✅ Permissions check passed!');