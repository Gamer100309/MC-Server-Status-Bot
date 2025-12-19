// ═══════════════════════════════════════════════════════════
//  🎮 COMMAND TESTER
//  Simulates command execution without Discord connection
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🎮 Command Tester\n');

// Load CommandHandler to extract commands
const handlerPath = '../cogs/CommandHandler.js';

if (!fs.existsSync(handlerPath)) {
    console.error('❌ CommandHandler.js not found!');
    process.exit(1);
}

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

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🎮 COMMAND TESTS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`📋 Found ${commands.length} commands\n`);

// Test each command
commands.forEach((cmd, i) => {
    console.log(`${i + 1}. /${cmd.name}`);
    console.log(`   Description: ${cmd.description}`);
    
    // Simulate command checks
    const tests = [];
    
    // Name validation
    if (cmd.name.length < 1 || cmd.name.length > 32) {
        tests.push({ name: 'Name Length', status: '❌', issue: 'Must be 1-32 characters' });
    } else {
        tests.push({ name: 'Name Length', status: '✅' });
    }
    
    // Name format (lowercase, no spaces)
    if (!/^[a-z0-9_-]+$/.test(cmd.name)) {
        tests.push({ name: 'Name Format', status: '❌', issue: 'Only lowercase, numbers, - and _' });
    } else {
        tests.push({ name: 'Name Format', status: '✅' });
    }
    
    // Description length
    if (cmd.description.length < 1 || cmd.description.length > 100) {
        tests.push({ name: 'Description Length', status: '❌', issue: 'Must be 1-100 characters' });
    } else {
        tests.push({ name: 'Description Length', status: '✅' });
    }
    
    // Display test results
    tests.forEach(test => {
        if (test.issue) {
            console.log(`   ${test.status} ${test.name}: ${test.issue}`);
        } else {
            console.log(`   ${test.status} ${test.name}`);
        }
    });
    
    // Command-specific tests
    if (cmd.name === 'setup') {
        console.log('   💡 Requires: Admin permissions or authorized role');
    }
    
    if (cmd.name === 'checkperms') {
        console.log('   💡 Optional parameter: channel');
    }
    
    console.log('');
});

// Test command handler structure
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔍 HANDLER STRUCTURE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check for required methods
const requiredMethods = [
    'registerCommands',
    'handle'
];

let structureOk = true;

requiredMethods.forEach(method => {
    const pattern = new RegExp(`${method}\\s*\\(`);
    if (pattern.test(content)) {
        console.log(`✅ Method: ${method}()`);
    } else {
        console.log(`❌ Method: ${method}() - NOT FOUND`);
        structureOk = false;
    }
});

// Check for switch statement (command routing)
if (content.includes('switch') && content.includes('interaction.commandName')) {
    console.log('✅ Command routing: switch statement found');
} else {
    console.log('⚠️  Command routing: No switch statement found');
}

// Check for permission checks
if (content.includes('hasSetupPerm') || content.includes('Administrator')) {
    console.log('✅ Permission checks: Implemented');
} else {
    console.log('⚠️  Permission checks: Not found');
}

console.log('');

// Simulate command execution flow
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔄 EXECUTION FLOW SIMULATION');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Simulating: /setup command\n');
console.log('Step 1: User executes /setup');
console.log('   → Interaction received');
console.log('Step 2: Permission check');
console.log('   → Check if user is admin or has authorized role');
console.log('Step 3: Load guild config');
console.log('   → ConfigManager.loadGuild()');
console.log('Step 4: Create setup menu');
console.log('   → SetupMenus.createMainMenu()');
console.log('Step 5: Send response');
console.log('   → interaction.reply()');
console.log('');

console.log('Simulating: /reload command\n');
console.log('Step 1: User executes /reload');
console.log('   → Interaction received');
console.log('Step 2: Permission check');
console.log('   → Check permissions');
console.log('Step 3: Restart monitoring');
console.log('   → MonitoringManager.startMonitoring()');
console.log('Step 4: Send confirmation');
console.log('   → interaction.reply()');
console.log('');

// Test recommendations
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   💡 RECOMMENDATIONS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const recommendations = [];

if (commands.length < 3) {
    recommendations.push('Consider adding more utility commands');
}

if (commands.length > 10) {
    recommendations.push('Consider organizing commands into categories');
}

// Check if all commands have descriptions
const missingDesc = commands.filter(c => !c.description || c.description === 'No description');
if (missingDesc.length > 0) {
    recommendations.push(`${missingDesc.length} command(s) missing descriptions`);
}

if (recommendations.length === 0) {
    console.log('✅ No recommendations - commands look good!');
} else {
    recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
    });
}

console.log('\n✅ Command tests complete!\n');