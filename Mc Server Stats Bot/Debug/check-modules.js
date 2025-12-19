// ═══════════════════════════════════════════════════════════
//  📁 MODULES CHECK
//  Auto-discovers and validates all cogs modules
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking modules...\n');

const cogsDir = '../cogs';

if (!fs.existsSync(cogsDir)) {
    console.error('❌ ./cogs directory not found!');
    process.exit(1);
}

// Auto-discover all .js files in cogs
const modules = fs.readdirSync(cogsDir)
    .filter(f => f.endsWith('.js'))
    .map(f => path.join(cogsDir, f));

if (modules.length === 0) {
    console.error('❌ No modules found in ./cogs!');
    process.exit(1);
}

console.log(`📦 Found ${modules.length} module(s):\n`);

let allValid = true;

for (const mod of modules) {
    const moduleName = path.basename(mod);
    
    try {
        // Try to require the module
        const loaded = require(path.resolve(mod));
        
        // Check if module exports something
        if (Object.keys(loaded).length === 0) {
            console.warn(`⚠️  ${moduleName} - exports nothing`);
        } else {
            const exports = Object.keys(loaded).join(', ');
            console.log(`✅ ${moduleName}`);
            console.log(`   Exports: ${exports}`);
        }
    } catch (e) {
        console.error(`❌ ${moduleName} - ERROR`);
        console.error(`   ${e.message}`);
        allValid = false;
    }
}

if (!allValid) {
    console.error('\n❌ Some modules have errors!');
    process.exit(1);
}

console.log('\n✅ All modules valid!');