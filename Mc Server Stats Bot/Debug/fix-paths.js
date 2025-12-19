// ═══════════════════════════════════════════════════════════
//  🔧 AUTOMATIC PATH FIXER
//  Fixes all relative paths in Debug tools from ./ to ../
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('🔧 Automatic Path Fixer for Debug Tools\n');

// Get current directory
const debugDir = __dirname;
console.log(`Working directory: ${debugDir}\n`);

// Get all .js files except this one
const files = fs.readdirSync(debugDir)
    .filter(f => f.endsWith('.js') && f !== 'fix-paths.js');

console.log(`Found ${files.length} JavaScript files to process\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let totalFixed = 0;
let errors = 0;

files.forEach(file => {
    try {
        const filePath = path.join(debugDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const original = content;
        
        // Count replacements
        let replacements = 0;
        
        // Replace './path' with '../path' (single quotes)
        const singleQuoteMatches = content.match(/'\.\//g);
        if (singleQuoteMatches) replacements += singleQuoteMatches.length;
        content = content.replace(/'\.\//g, "'../");
        
        // Replace "./path" with "../path" (double quotes)
        const doubleQuoteMatches = content.match(/"\.\//g);
        if (doubleQuoteMatches) replacements += doubleQuoteMatches.length;
        content = content.replace(/"\.\//g, '"../');
        
        // Replace `./path` with `../path` (template literals)
        const templateMatches = content.match(/`\.\//g);
        if (templateMatches) replacements += templateMatches.length;
        content = content.replace(/`\.\//g, '`../');
        
        // IMPORTANT: Revert Node.js built-in modules
        content = content.replace(/require\('\.\.\/fs'\)/g, "require('fs')");
        content = content.replace(/require\('\.\.\/path'\)/g, "require('path')");
        content = content.replace(/require\('\.\.\/readline'\)/g, "require('readline')");
        content = content.replace(/require\("\.\.\/fs"\)/g, 'require("fs")');
        content = content.replace(/require\("\.\.\/path"\)/g, 'require("path")');
        content = content.replace(/require\("\.\.\/readline"\)/g, 'require("readline")');
        
        // IMPORTANT: Revert npm packages
        content = content.replace(/require\('\.\.\/discord\.js'\)/g, "require('discord.js')");
        content = content.replace(/require\('\.\.\/minecraft-server-util'\)/g, "require('minecraft-server-util')");
        content = content.replace(/require\("\.\.\/discord\.js"\)/g, 'require("discord.js")');
        content = content.replace(/require\("\.\.\/minecraft-server-util"\)/g, 'require("minecraft-server-util")');
        
        // Only write if changed
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${file}`);
            console.log(`   Replaced ${replacements} path(s)\n`);
            totalFixed++;
        } else {
            console.log(`⏭️  ${file}`);
            console.log(`   No changes needed\n`);
        }
        
    } catch (e) {
        console.error(`❌ ${file}`);
        console.error(`   Error: ${e.message}\n`);
        errors++;
    }
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📊 SUMMARY:\n');
console.log(`Total files processed: ${files.length}`);
console.log(`✅ Fixed: ${totalFixed}`);
console.log(`⏭️  Skipped: ${files.length - totalFixed - errors}`);
console.log(`❌ Errors: ${errors}\n`);

if (errors === 0 && totalFixed > 0) {
    console.log('🎉 All paths fixed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Run: node master-debug.js');
    console.log('  2. Or: node ../Debug/master-debug.js (from root)\n');
} else if (totalFixed === 0 && errors === 0) {
    console.log('✅ All files already have correct paths!\n');
} else {
    console.log('⚠️  Some files had errors. Review output above.\n');
}