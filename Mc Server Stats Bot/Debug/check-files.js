// ═══════════════════════════════════════════════════════════
//  📁 FILES CHECK
//  Validates project structure
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking project structure...\n');

// Required files
const requiredFiles = [
    '../index.js',
    '../package.json',
    '../global-config.json'
];

// Required directories
const requiredDirs = [
    '../cogs',
    '../texts'
];

// Optional directories (created at runtime)
const optionalDirs = [
    '../configs',
    '../states',
    '../Icons',
    '../logs',
    '../Debug'
];

console.log('📄 Required files:');
let allFilesPresent = true;

for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const size = (stats.size / 1024).toFixed(2);
        console.log(`✅ ${file} (${size} KB)`);
    } else {
        console.error(`❌ ${file} - NOT FOUND`);
        allFilesPresent = false;
    }
}

console.log('\n📁 Required directories:');
let allDirsPresent = true;

for (const dir of requiredDirs) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        console.log(`✅ ${dir}/ (${files.length} files)`);
    } else {
        console.error(`❌ ${dir}/ - NOT FOUND`);
        allDirsPresent = false;
    }
}

console.log('\n📂 Optional directories:');

for (const dir of optionalDirs) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        console.log(`✅ ${dir}/ (${files.length} files)`);
    } else {
        console.log(`ℹ️  ${dir}/ - will be created at runtime`);
    }
}

// Check package.json
if (fs.existsSync('package.json')) {
    try {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        console.log('\n📦 package.json:');
        console.log(`   Name: ${pkg.name || 'N/A'}`);
        console.log(`   Version: ${pkg.version || 'N/A'}`);
        
        if (pkg.dependencies) {
            const deps = Object.keys(pkg.dependencies);
            console.log(`   Dependencies: ${deps.length}`);
            deps.forEach(dep => {
                console.log(`      - ${dep}: ${pkg.dependencies[dep]}`);
            });
        }
    } catch (e) {
        console.warn('⚠️  Could not parse package.json');
    }
}

if (!allFilesPresent || !allDirsPresent) {
    console.error('\n❌ Project structure incomplete!');
    process.exit(1);
}

console.log('\n✅ Project structure valid!');