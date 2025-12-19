#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔍 MASTER DEBUG - Bot Health Check');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const debugScripts = [
    { name: '1. Config Check', file: 'check-config.js' },
    { name: '2. Dependencies Check', file: 'check-dependencies.js' },
    { name: '3. Modules Check', file: 'check-modules.js' },
    { name: '4. Commands Check', file: 'check-commands.js' },
    { name: '5. Languages Check', file: 'check-languages.js' },
    { name: '6. Guilds Check', file: 'check-guilds.js' },
    { name: '7. Permissions Check', file: 'check-permissions.js' },
    { name: '8. Files Check', file: 'check-files.js' }
];

let passed = 0;
let failed = 0;
const errors = [];

// SMART PATH DETECTION:
// __dirname ist immer der Ordner, in dem dieses Skript liegt (der Debug-Ordner)
const debugDir = __dirname;

for (const script of debugScripts) {
    console.log(`\n📋 Running: ${script.name}`);
    console.log('─'.repeat(50));
    
    const scriptPath = path.join(debugDir, script.file);
    
    if (!fs.existsSync(scriptPath)) {
        console.log(`⚠️  Script not found: ${script.file}`);
        // Optional: Hier könntest du failed++ setzen, falls das als Fehler gelten soll
        continue;
    }
    
    try {
        // Wir führen das Skript immer im Kontext des Debug-Ordners aus
        execSync(`node "${script.file}"`, { 
            stdio: 'inherit',
            cwd: debugDir 
        });
        passed++;
    } catch (e) {
        failed++;
        errors.push({ script: script.name, error: 'Check failed' });
    }
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📊 SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (errors.length > 0) {
    process.exit(1);
} else {
    if (passed === 0) {
        console.log('⚠️  No scripts were executed.');
        process.exit(1);
    }
    console.log('\n🎉 All checks passed! Bot is healthy!');
    process.exit(0);
}