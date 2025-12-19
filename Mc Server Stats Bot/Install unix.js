#!usrbinenv node
 ═══════════════════════════════════════════════════════════
  🪟 MINECRAFT STATUS BOT - WINDOWS INSTALLER
  Automated setup for Windows systems
 ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input process.stdin,
    output process.stdout
});

 ═══════════════════════════════════════════════════════════
 HELPERS
 ═══════════════════════════════════════════════════════════

function question(query) {
    return new Promise(resolve = rl.question(query, resolve));
}

function execCommand(cmd) {
    try {
        return execSync(cmd, { encoding 'utf8', stdio 'pipe' });
    } catch (e) {
        return null;
    }
}

 ═══════════════════════════════════════════════════════════
 VERIFY WINDOWS
 ═══════════════════════════════════════════════════════════

if (process.platform !== 'win32') {
    console.log('n❌ ERROR This is the Windows installer!n');
    console.log('   For LinuxMac, use node install-unix.jsn');
    process.exit(1);
}

 ═══════════════════════════════════════════════════════════
 WELCOME
 ═══════════════════════════════════════════════════════════

console.clear();
console.log('═══════════════════════════════════════════════════════');
console.log('  🤖 MINECRAFT MULTI-SERVER STATUS BOT');
console.log('  Windows Installer v4.0');
console.log('═══════════════════════════════════════════════════════n');

console.log('🪟 Windows Installation Moden');

 ═══════════════════════════════════════════════════════════
 CHECK NODE.JS
 ═══════════════════════════════════════════════════════════

console.log('📋 Step 1 Checking Node.js...n');

const nodeVersion = process.version;
const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);

console.log(`   Node.js Version ${nodeVersion}`);

if (nodeMajor  16) {
    console.log('n❌ ERROR Node.js 16 or higher required!');
    console.log('   Download httpsnodejs.orgn');
    rl.close();
    process.exit(1);
}

console.log('   ✅ Node.js version OK!n');

 ═══════════════════════════════════════════════════════════
 CHECK PROJECT FILES
 ═══════════════════════════════════════════════════════════

console.log('📋 Step 2 Checking project files...n');

if (!fs.existsSync('package.json')) {
    console.log('❌ ERROR package.json not found!');
    console.log('   Are you in the bot directoryn');
    rl.close();
    process.exit(1);
}

console.log('   ✅ package.json found!n');

 ═══════════════════════════════════════════════════════════
 INSTALL DEPENDENCIES
 ═══════════════════════════════════════════════════════════

console.log('📦 Step 3 Installing dependencies...n');

const hasNodeModules = fs.existsSync('node_modules');

if (!hasNodeModules) {
    console.log('   Installing npm packages...');
    console.log('   This may take a minute...n');
    
    try {
        execSync('npm install', { stdio 'inherit' });
        console.log('n   ✅ Dependencies installed!n');
    } catch (e) {
        console.log('n❌ ERROR Failed to install dependencies!');
        console.log('   Try manually npm installn');
        rl.close();
        process.exit(1);
    }
} else {
    console.log('   ✅ Dependencies already installed!n');
}

 ═══════════════════════════════════════════════════════════
 REMOVE UNIX SCRIPTS
 ═══════════════════════════════════════════════════════════

console.log('🧹 Step 4 Cleaning up Unix scripts...n');

const debugDir = path.join(__dirname, 'Debug');
let removedCount = 0;

if (fs.existsSync(debugDir)) {
    const shFiles = fs.readdirSync(debugDir).filter(f = f.endsWith('.sh'));
    
    shFiles.forEach(file = {
        try {
            fs.unlinkSync(path.join(debugDir, file));
            console.log(`   🗑️  Removed ${file}`);
            removedCount++;
        } catch (e) {
            console.log(`   ⚠️  Could not remove ${file}`);
        }
    });
    
    if (removedCount  0) {
        console.log(`n   ✅ Removed ${removedCount} Unix script(s)!n`);
    } else {
        console.log('   ℹ️  No Unix scripts foundn');
    }
}

 Remove install-unix.js
if (fs.existsSync('install-unix.js')) {
    try {
        fs.unlinkSync('install-unix.js');
        console.log('   🗑️  Removed install-unix.jsn');
    } catch (e) {}
}

 ═══════════════════════════════════════════════════════════
 CHECKCREATE CONFIG
 ═══════════════════════════════════════════════════════════

console.log('⚙️  Step 5 Configuration setup...n');

const hasConfig = fs.existsSync('global-config.json');
const hasExample = fs.existsSync('global-config.example.json');

if (!hasConfig && hasExample) {
    console.log('   📋 Creating global-config.json from example...n');
    fs.copyFileSync('global-config.example.json', 'global-config.json');
    console.log('   ✅ Config file created!n');
} else if (hasConfig) {
    console.log('   ✅ Config file already exists!n');
} else {
    console.log('   ⚠️  No config files foundn');
}

 ═══════════════════════════════════════════════════════════
 BOT TOKEN SETUP
 ═══════════════════════════════════════════════════════════

async function setupToken() {
    console.log('🔑 Step 6 Bot Token...n');

    if (hasConfig) {
        const config = JSON.parse(fs.readFileSync('global-config.json', 'utf8'));
        
        if (!config.token  config.token === 'YOUR_BOT_TOKEN_HERE') {
            console.log('   ⚠️  Bot token not set!n');
            console.log('   📝 How to get your bot token');
            console.log('      1. Go to httpsdiscord.comdevelopersapplications');
            console.log('      2. Select your bot');
            console.log('      3. Go to Bot section');
            console.log('      4. Click Reset Token and copy it');
            console.log('      5. Paste it here or edit global-config.json latern');
            
            const answer = await question('   Do you want to enter your token now (yn) ');
            
            if (answer.toLowerCase() === 'y'  answer.toLowerCase() === 'yes') {
                const token = await question('n   Enter your bot token ');
                
                if (token && token.length  50) {
                    config.token = token.trim();
                    fs.writeFileSync('global-config.json', JSON.stringify(config, null, 2));
                    console.log('n   ✅ Token saved!n');
                } else {
                    console.log('n   ⚠️  Invalid token - please edit global-config.json manuallyn');
                }
            } else {
                console.log('n   ℹ️  You can add your token later in global-config.jsonn');
            }
        } else {
            console.log('   ✅ Bot token configured!n');
        }
    }
}

 ═══════════════════════════════════════════════════════════
 CREATE DIRECTORIES
 ═══════════════════════════════════════════════════════════

console.log('📁 Step 7 Creating directories...n');

const dirs = ['configs', 'states', 'Icons', 'logs'];

dirs.forEach(dir = {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive true });
        console.log(`   ✅ Created ${dir}`);
    } else {
        console.log(`   ✓ Exists ${dir}`);
    }
});

console.log('');

 ═══════════════════════════════════════════════════════════
 MAIN ASYNC FLOW
 ═══════════════════════════════════════════════════════════

(async () = {
    await setupToken();

     ═══════════════════════════════════════════════════════════
     QUICK TEST
     ═══════════════════════════════════════════════════════════

    console.log('🧪 Step 8 Running quick test...n');

    try {
        const testScript = 'Debugdebug-check.bat';
        
        if (fs.existsSync(testScript)) {
            console.log('   Running debug checks...n');
            execSync(testScript, { stdio 'inherit' });
            console.log('n   ✅ Tests passed!n');
        } else {
            console.log('   ℹ️  Debug tools not found - skipping testsn');
        }
    } catch (e) {
        console.log('n   ⚠️  Some tests failed - check output aboven');
    }

     ═══════════════════════════════════════════════════════════
     SUMMARY
     ═══════════════════════════════════════════════════════════

    console.log('═══════════════════════════════════════════════════════');
    console.log('  🎉 WINDOWS INSTALLATION COMPLETE!');
    console.log('═══════════════════════════════════════════════════════n');

    console.log('📋 Summaryn');
    console.log(`   OS           Windows`);
    console.log(`   Node.js      ${nodeVersion}`);
    console.log(`   Dependencies Installed`);
    console.log(`   Scripts      .bat files only`);
    console.log(`   Config       ${hasConfig  'Ready'  'Needs setup'}`);
    console.log('');

    console.log('🚀 Next Stepsn');

    const configContent = fs.existsSync('global-config.json') 
         fs.readFileSync('global-config.json', 'utf8') 
         '';
    
    if (!configContent.includes('MTQ')) {
        console.log('   1. ⚠️  Add your bot token to global-config.json');
        console.log('   2. Start the bot node index.js');
    } else {
        console.log('   1. Start the bot node index.js');
    }

    console.log('   3. Use setup in Discord to configure servers');
    console.log('');

    console.log('🔧 Useful Commandsn');
    console.log('   node index.js                      - Start bot');
    console.log('   node Debugmaster-debug.js        - Run all tests');
    console.log('   DebugTest_all_debug_tools.bat    - Test everything');
    console.log('   Debugquick-test.bat              - Quick health check');
    console.log('');

    console.log('📚 Documentationn');
    console.log('   README.md              - Full documentation');
    console.log('   Project_Structure.md   - Project overview');
    console.log('   DebugDebug-README.md - Debug tools guide');
    console.log('');

    console.log('💡 Need help httpsgithub.comGamer100309MC-Server-Status-Botissuesn');

    console.log('═══════════════════════════════════════════════════════n');

    rl.close();
})();