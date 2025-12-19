// ═══════════════════════════════════════════════════════════
//  📦 DEPENDENCIES CHECK (Improved)
//  Validates dependencies via package.json
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking dependencies...\n');

// Lade package.json
if (!fs.existsSync('../package.json')) {
    console.error('❌ package.json not found!');
    process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
const dependencies = packageJson.dependencies || {};

console.log('📋 Required dependencies from package.json:\n');

let allInstalled = true;

for (const [pkgName, version] of Object.entries(dependencies)) {
    const pkgPath = path.join('../node_modules', pkgName);
    
    if (fs.existsSync(pkgPath)) {
        // Versuche installierte Version zu lesen
        let installedVersion = 'unknown';
        try {
            const pkgJsonPath = path.join(pkgPath, 'package.json');
            if (fs.existsSync(pkgJsonPath)) {
                installedVersion = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')).version;
            }
        } catch (e) {
            installedVersion = 'installed';
        }
        
        console.log(`✅ ${pkgName}`);
        console.log(`   Required: ${version}`);
        console.log(`   Installed: ${installedVersion}`);
    } else {
        console.error(`❌ ${pkgName} not installed!`);
        console.log(`   Required: ${version}`);
        console.log(`   Install: npm install`);
        allInstalled = false;
    }
}

if (!allInstalled) {
    console.error('\n❌ Some dependencies missing!');
    console.log('   Run: npm install');
    process.exit(1);
}

console.log('\n✅ All dependencies installed!');