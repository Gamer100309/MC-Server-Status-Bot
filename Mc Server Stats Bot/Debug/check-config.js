// ═══════════════════════════════════════════════════════════
//  📋 CONFIG CHECK
//  Validates global-config.json
// ═══════════════════════════════════════════════════════════

const fs = require('fs');

console.log('🔍 Checking global-config.json...\n');

// Check if file exists
if (!fs.existsSync('../global-config.json')) {
    console.error('❌ global-config.json not found!');
    console.log('   Create it by starting the bot once.');
    process.exit(1);
}

// Load config
let config;
try {
    config = JSON.parse(fs.readFileSync('../global-config.json', 'utf8'));
    console.log('✅ Config file valid JSON');
} catch (e) {
    console.error('❌ Config file is not valid JSON!');
    console.error(`   Error: ${e.message}`);
    process.exit(1);
}

// Check token
if (!config.token) {
    console.error('❌ Token missing in config!');
    process.exit(1);
}

if (config.token === "DEIN_BOT_TOKEN" || config.token === "YOUR_BOT_TOKEN") {
    console.error('❌ Bot token not set!');
    console.log('   Please enter your token in global-config.json');
    process.exit(1);
}

console.log(`✅ Token present (${config.token.substring(0, 30)}...)`);

// Check defaults
const requiredDefaults = [
    'updateInterval',
    'embedColors',
    'defaultEmojis',
    'defaultButtonMessages',
    'setupPermissions',
    'textSettings'
];

if (!config.defaults) {
    console.error('❌ defaults section missing!');
    process.exit(1);
}

let allDefaultsPresent = true;
requiredDefaults.forEach(key => {
    if (!config.defaults[key]) {
        console.error(`❌ defaults.${key} missing!`);
        allDefaultsPresent = false;
    }
});

if (!allDefaultsPresent) {
    process.exit(1);
}

console.log('✅ All defaults present');

// Check text settings
if (config.defaults.textSettings.defaultLanguage !== 'en' && config.defaults.textSettings.defaultLanguage !== 'de') {
    console.warn(`⚠️  Unusual default language: ${config.defaults.textSettings.defaultLanguage}`);
}

console.log(`✅ Default language: ${config.defaults.textSettings.defaultLanguage}`);

console.log('\n✅ Config check passed!');