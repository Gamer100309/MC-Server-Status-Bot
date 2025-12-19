// ═══════════════════════════════════════════════════════════
//  🌐 LANGUAGE VALIDATOR
//  Deep validation of language files
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🌐 Language Validator\n');

const textsDir = '../texts';

if (!fs.existsSync(textsDir)) {
    console.error('❌ ./texts directory not found!');
    process.exit(1);
}

const langFiles = fs.readdirSync(textsDir)
    .filter(f => f.endsWith('.json') && !f.startsWith('.'));

if (langFiles.length === 0) {
    console.error('❌ No language files found!');
    process.exit(1);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔍 LOADING LANGUAGE FILES');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const languages = {};
const allKeys = new Set();

// Load all languages
langFiles.forEach(file => {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(textsDir, file), 'utf8'));
        const code = file.replace('.json', '');
        
        console.log(`✅ Loaded: ${file}`);
        console.log(`   Name: ${data._meta?.languageName || 'Unknown'}`);
        console.log(`   Code: ${data._meta?.language || code}`);
        
        languages[code] = data;
        
        // Collect all keys
        function collectKeys(obj, prefix = '') {
            for (const key in obj) {
                if (key === '_meta') continue;
                
                const fullKey = prefix ? `${prefix}.${key}` : key;
                
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    collectKeys(obj[key], fullKey);
                } else if (typeof obj[key] === 'string') {
                    allKeys.add(fullKey);
                }
            }
        }
        
        collectKeys(data);
        
    } catch (e) {
        console.error(`❌ Error loading ${file}: ${e.message}`);
    }
});

console.log(`\nTotal unique keys: ${allKeys.size}\n`);

// ═══════════════════════════════════════════════════════════
// VALIDATION CHECKS
// ═══════════════════════════════════════════════════════════

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   ✅ VALIDATION CHECKS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let totalIssues = 0;

// Check 1: Missing keys
console.log('1. Checking for missing keys...\n');

const langCodes = Object.keys(languages);

langCodes.forEach(code => {
    const missing = [];
    
    allKeys.forEach(key => {
        const parts = key.split('.');
        let current = languages[code];
        let found = true;
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                found = false;
                break;
            }
        }
        
        if (!found) {
            missing.push(key);
        }
    });
    
    if (missing.length > 0) {
        console.log(`   ❌ ${code}: ${missing.length} missing key(s)`);
        missing.slice(0, 5).forEach(key => {
            console.log(`      - ${key}`);
        });
        if (missing.length > 5) {
            console.log(`      ... and ${missing.length - 5} more`);
        }
        totalIssues += missing.length;
    } else {
        console.log(`   ✅ ${code}: All keys present`);
    }
});

// Check 2: Variable consistency
console.log('\n2. Checking variable placeholders...\n');

const variablePattern = /\{([^}]+)\}/g;

allKeys.forEach(key => {
    const variables = {};
    
    langCodes.forEach(code => {
        const parts = key.split('.');
        let current = languages[code];
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                current = null;
                break;
            }
        }
        
        if (typeof current === 'string') {
            const matches = [...current.matchAll(variablePattern)];
            variables[code] = matches.map(m => m[1]);
        }
    });
    
    // Compare variables across languages
    const varSets = Object.values(variables);
    if (varSets.length > 1) {
        const first = varSets[0]?.sort().join(',');
        const allSame = varSets.every(v => v.sort().join(',') === first);
        
        if (!allSame) {
            console.log(`   ⚠️  ${key}: Inconsistent variables`);
            Object.entries(variables).forEach(([code, vars]) => {
                console.log(`      ${code}: {${vars.join('}, {')}}`);
            });
            totalIssues++;
        }
    }
});

// Check 3: Empty values
console.log('\n3. Checking for empty values...\n');

langCodes.forEach(code => {
    const empty = [];
    
    allKeys.forEach(key => {
        const parts = key.split('.');
        let current = languages[code];
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                current = null;
                break;
            }
        }
        
        if (typeof current === 'string' && current.trim() === '') {
            empty.push(key);
        }
    });
    
    if (empty.length > 0) {
        console.log(`   ⚠️  ${code}: ${empty.length} empty value(s)`);
        empty.slice(0, 3).forEach(key => {
            console.log(`      - ${key}`);
        });
        if (empty.length > 3) {
            console.log(`      ... and ${empty.length - 3} more`);
        }
        totalIssues += empty.length;
    } else {
        console.log(`   ✅ ${code}: No empty values`);
    }
});

// Check 4: Key count comparison
console.log('\n4. Comparing key counts...\n');

const keyCounts = {};

langCodes.forEach(code => {
    let count = 0;
    
    function countKeys(obj) {
        for (const key in obj) {
            if (key === '_meta') continue;
            
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                countKeys(obj[key]);
            } else if (typeof obj[key] === 'string') {
                count++;
            }
        }
    }
    
    countKeys(languages[code]);
    keyCounts[code] = count;
    
    console.log(`   ${code}: ${count} keys`);
});

const counts = Object.values(keyCounts);
const minCount = Math.min(...counts);
const maxCount = Math.max(...counts);

if (minCount !== maxCount) {
    console.log(`\n   ⚠️  Key counts differ by ${maxCount - minCount}`);
    totalIssues++;
}

// Check 5: Required sections
console.log('\n5. Checking required sections...\n');

const requiredSections = [
    'setup',
    'setup.mainMenu',
    'setup.serverManagement',
    'setup.intervals',
    'setup.embedDesign',
    'setup.buttons',
    'setup.permissions',
    'setup.global',
    'setup.texts',
    'status',
    'status.online',
    'status.offline',
    'buttons',
    'commands',
    'errors',
    'permissions',
    'logs'
];

langCodes.forEach(code => {
    const missing = [];
    
    requiredSections.forEach(section => {
        const parts = section.split('.');
        let current = languages[code];
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                missing.push(section);
                break;
            }
        }
    });
    
    if (missing.length > 0) {
        console.log(`   ❌ ${code}: ${missing.length} missing section(s)`);
        missing.forEach(sec => {
            console.log(`      - ${sec}`);
        });
        totalIssues += missing.length;
    } else {
        console.log(`   ✅ ${code}: All required sections present`);
    }
});

// ═══════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📊 VALIDATION SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`Languages validated: ${langCodes.length}`);
console.log(`Total keys checked: ${allKeys.size}`);
console.log(`Issues found: ${totalIssues}`);

if (totalIssues === 0) {
    console.log('\n✅ All language files are valid!\n');
    process.exit(0);
} else {
    console.log('\n⚠️  Issues found. Review output above.\n');
    process.exit(1);
}