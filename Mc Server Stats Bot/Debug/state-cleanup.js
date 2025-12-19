// ═══════════════════════════════════════════════════════════
//  🧹 STATE CLEANUP
//  Cleans up orphaned state entries
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🧹 State Cleanup Tool\n');

const statesDir = '../states';
const configsDir = '../configs';

if (!fs.existsSync(statesDir)) {
    console.log('ℹ️  No states directory found');
    process.exit(0);
}

const stateFiles = fs.readdirSync(statesDir)
    .filter(f => f.startsWith('guild_') && f.endsWith('.json'));

if (stateFiles.length === 0) {
    console.log('ℹ️  No state files found');
    process.exit(0);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🔍 SCANNING FOR ISSUES');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const cleanupTasks = [];

stateFiles.forEach(file => {
    const state = JSON.parse(fs.readFileSync(path.join(statesDir, file), 'utf8'));
    const configFile = path.join(configsDir, file);
    
    if (!fs.existsSync(configFile)) {
        cleanupTasks.push({
            type: 'orphaned_file',
            file,
            action: 'Delete entire state file (no matching config)'
        });
        return;
    }
    
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const guildName = config._guild_info?.guildName || 'Unknown';
    
    const servers = state.servers || {};
    
    Object.entries(servers).forEach(([channelId, data]) => {
        if (data && data.messageID) {
            const serverExists = config.servers?.some(s => s.channelID === channelId);
            
            if (!serverExists) {
                cleanupTasks.push({
                    type: 'orphaned_entry',
                    file,
                    guildName,
                    channelId,
                    messageId: data.messageID,
                    action: 'Remove orphaned entry'
                });
            }
        }
    });
    
    // Check for empty entries
    Object.entries(servers).forEach(([channelId, data]) => {
        if (!data || !data.messageID) {
            cleanupTasks.push({
                type: 'empty_entry',
                file,
                guildName,
                channelId,
                action: 'Remove empty entry'
            });
        }
    });
});

if (cleanupTasks.length === 0) {
    console.log('✅ No cleanup needed - all states are clean!\n');
    process.exit(0);
}

console.log(`Found ${cleanupTasks.length} issue(s):\n`);

cleanupTasks.forEach((task, i) => {
    console.log(`${i + 1}. ${task.action}`);
    console.log(`   File: ${task.file}`);
    if (task.guildName) console.log(`   Guild: ${task.guildName}`);
    if (task.channelId) console.log(`   Channel: ${task.channelId}`);
    if (task.messageId) console.log(`   Message: ${task.messageId}`);
    console.log('');
});

// Ask for confirmation
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Do you want to perform cleanup? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('   🧹 PERFORMING CLEANUP');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        let cleaned = 0;
        
        cleanupTasks.forEach(task => {
            try {
                if (task.type === 'orphaned_file') {
                    fs.unlinkSync(path.join(statesDir, task.file));
                    console.log(`✅ Deleted: ${task.file}`);
                    cleaned++;
                } else {
                    const statePath = path.join(statesDir, task.file);
                    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
                    
                    if (state.servers && state.servers[task.channelId]) {
                        delete state.servers[task.channelId];
                        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
                        console.log(`✅ Removed entry from: ${task.file}`);
                        cleaned++;
                    }
                }
            } catch (e) {
                console.error(`❌ Failed: ${task.file} - ${e.message}`);
            }
        });
        
        console.log(`\n✅ Cleanup complete! ${cleaned}/${cleanupTasks.length} items cleaned.\n`);
    } else {
        console.log('\nCleanup cancelled.\n');
    }
    
    rl.close();
    process.exit(0);
});