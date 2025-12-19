// ═══════════════════════════════════════════════════════════
//  ⚙️ COMMANDS CHECK
//  Auto-discovers commands from CommandHandler.js
// ═══════════════════════════════════════════════════════════

const fs = require('fs');

console.log('🔍 Checking commands...\n');

const handlerPath = '../cogs/CommandHandler.js';

if (!fs.existsSync(handlerPath)) {
    console.error('❌ CommandHandler.js not found!');
    process.exit(1);
}

// Read CommandHandler.js
const content = fs.readFileSync(handlerPath, 'utf8');

// Extract command definitions using regex
const commandPattern = /\.setName\(['"]([^'"]+)['"]\)/g;
const descPattern = /\.setDescription\(['"]([^'"]+)['"]\)/g;

let match;
const commands = [];

// Find all command names
const names = [];
while ((match = commandPattern.exec(content)) !== null) {
    names.push(match[1]);
}

// Find all descriptions
const descriptions = [];
while ((match = descPattern.exec(content)) !== null) {
    descriptions.push(match[1]);
}

// Combine names and descriptions
for (let i = 0; i < names.length; i++) {
    // Skip if it's a sub-option (like 'channel')
    if (names[i] === 'channel' || names[i].length < 3) continue;
    
    commands.push({
        name: names[i],
        description: descriptions[i] || 'No description'
    });
}

if (commands.length === 0) {
    console.error('❌ No commands found in CommandHandler.js!');
    process.exit(1);
}

console.log(`📋 Found ${commands.length} command(s):\n`);

commands.forEach(cmd => {
    console.log(`✅ /${cmd.name}`);
    console.log(`   ${cmd.description}`);
});

// Check for common issues
const duplicates = commands.map(c => c.name).filter((name, i, arr) => arr.indexOf(name) !== i);
if (duplicates.length > 0) {
    console.error(`\n❌ Duplicate commands: ${duplicates.join(', ')}`);
    process.exit(1);
}

// Check description lengths (Discord limit: 100 chars)
const tooLong = commands.filter(c => c.description.length > 100);
if (tooLong.length > 0) {
    console.warn(`\n⚠️  Descriptions too long (>100 chars):`);
    tooLong.forEach(c => console.warn(`   /${c.name}: ${c.description.length} chars`));
}

console.log('\n✅ Commands check passed!');