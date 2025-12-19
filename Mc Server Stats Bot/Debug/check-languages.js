// ═══════════════════════════════════════════════════════════
//  🌐 LANGUAGES CHECK
//  Validates and compares language files
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking language files...\n');

const textsDir = '../texts';

if (!fs.existsSync(textsDir)) {
    console.error('❌ ./texts directory not found!');
    process.exit(1);
}

// Auto-discover all language files
const langFiles = fs.readdirSync(textsDir)
    .filter(f => f.endsWith('.json') && !f.startsWith('.'))
    .map(f => ({
        file: f,
        code: f.replace('.json', ''),
        path: path.join(textsDir, f)
    }));

if (langFiles.length === 0) {
    console.error('❌ No language files found in ./texts!');
    process.exit(1);
}

console.log(`📋 Found ${langFiles.length} language(s):\n`);

const languages = {};

// Load all language files
for (const lang of langFiles) {
    try {
        const data = JSON.parse(fs.readFileSync(lang.path, 'utf8'));
        
        if (!data._meta) {
            console.error(`❌ ${lang.file} - missing _meta section!`);
            process.exit(1);
        }
        
        console.log(`✅ ${lang.file}`);
        console.log(`   Name: ${data._meta.languageName}`);
        console.log(`   Code: ${data._meta.language}`);
        
        // Count keys recursively
        const countKeys = (obj) => {
            let count = 0;
            for (const key in obj) {
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    count += countKeys(obj[key]);
                } else if (typeof obj[key] === 'string') {
                    count++;
                }
            }
            return count;
        };
        
        const keyCount = countKeys(data);
        console.log(`   Keys: ${keyCount}`);
        
        languages[lang.code] = {
            data,
            keyCount,
            file: lang.file
        };
        
    } catch (e) {
        console.error(`❌ ${lang.file} - ERROR: ${e.message}`);
        process.exit(1);
    }
}

// Compare key counts
console.log('\n📊 Comparison:');
const codes = Object.keys(languages);
const keyCounts = codes.map(c => languages[c].keyCount);
const minKeys = Math.min(...keyCounts);
const maxKeys = Math.max(...keyCounts);

if (minKeys !== maxKeys) {
    console.warn('⚠️  Language files have different key counts!');
    codes.forEach(c => {
        const diff = languages[c].keyCount - minKeys;
        if (diff > 0) {
            console.warn(`   ${c}: ${diff} more keys than smallest`);
        }
    });
}

// Check for required sections
const requiredSections = ['setup', 'status', 'buttons', 'commands', 'errors'];
let allSectionsPresent = true;

for (const code of codes) {
    const data = languages[code].data;
    const missing = requiredSections.filter(s => !data[s]);
    
    if (missing.length > 0) {
        console.error(`❌ ${code} missing sections: ${missing.join(', ')}`);
        allSectionsPresent = false;
    }
}

if (!allSectionsPresent) {
    process.exit(1);
}

console.log('\n✅ Language files valid!');