// ═══════════════════════════════════════════════════════════
//  🔧 AUTOMATIC SYNTAX FIXER
//  Fixes console.log`...`) → console.log(`...`)
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🔧 Automatic Syntax Fixer for Debug Tools\n');
console.log('Fixing: console.error`...`) → console.error(`...`)\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const debugDir = __dirname;
const files = fs.readdirSync(debugDir)
    .filter(f => f.endsWith('.js') && f !== 'fix-syntax.js' && f !== 'fix-paths.js');

let fixed = 0;
let filesFixed = 0;
let errors = 0;

files.forEach(file => {
    try {
        const filePath = path.join(debugDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const original = content;
        
        let fileFixed = 0;
        
        // Fix: console.error`...`); → console.error(`...`);
        const errorMatches = content.match(/console\.error`[^`]+`\)/g);
        if (errorMatches) {
            fileFixed += errorMatches.length;
            content = content.replace(/console\.error`([^`]+)`\)/g, 'console.error(`$1`)');
        }
        
        // Fix: console.log`...`); → console.log(`...`);
        const logMatches = content.match(/console\.log`[^`]+`\)/g);
        if (logMatches) {
            fileFixed += logMatches.length;
            content = content.replace(/console\.log`([^`]+)`\)/g, 'console.log(`$1`)');
        }
        
        // Fix: console.warn`...`); → console.warn(`...`);
        const warnMatches = content.match(/console\.warn`[^`]+`\)/g);
        if (warnMatches) {
            fileFixed += warnMatches.length;
            content = content.replace(/console\.warn`([^`]+)`\)/g, 'console.warn(`$1`)');
        }
        
        // Fix: console.info`...`); → console.info(`...`);
        const infoMatches = content.match(/console\.info`[^`]+`\)/g);
        if (infoMatches) {
            fileFixed += infoMatches.length;
            content = content.replace(/console\.info`([^`]+)`\)/g, 'console.info(`$1`)');
        }
        
        if (content !== original) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ ${file}`);
            console.log(`   Fixed ${fileFixed} syntax error(s)\n`);
            fixed += fileFixed;
            filesFixed++;
        } else {
            console.log(`⏭️  ${file}`);
            console.log(`   No syntax errors found\n`);
        }
        
    } catch (e) {
        console.error(`❌ ${file}`);
        console.error(`   Error: ${e.message}\n`);
        errors++;
    }
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 SUMMARY:\n');
console.log(`Files processed: ${files.length}`);
console.log(`✅ Files fixed: ${filesFixed}`);
console.log(`✅ Total errors fixed: ${fixed}`);
console.log(`⏭️  Files already correct: ${files.length - filesFixed - errors}`);
console.log(`❌ Errors: ${errors}\n`);

if (errors === 0 && fixed > 0) {
    console.log('🎉 All syntax errors fixed!\n');
    console.log('Next steps:');
    console.log('  1. Test individual tool: node check-config.js');
    console.log('  2. Test all tools: node master-debug.js');
    console.log('  3. Or run: test-all-debug-tools.bat\n');
} else if (fixed === 0 && errors === 0) {
    console.log('✅ No syntax errors found - all files correct!\n');
} else {
    console.log('⚠️  Some files had errors. Review output above.\n');
}