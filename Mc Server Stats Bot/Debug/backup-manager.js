// ═══════════════════════════════════════════════════════════
//  💾 BACKUP MANAGER
//  Creates and manages configuration backups
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

console.log('💾 Backup Manager\n');

const backupDir = '../backups';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

// Create backup directory
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('✅ Created backup directory\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   💾 CREATING BACKUP');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const itemsToBackup = [
    { path: '../global-config.json', name: 'Global Config' },
    { path: '../configs', name: 'Guild Configs', isDir: true },
    { path: '../states', name: 'State Files', isDir: true },
    { path: '../texts', name: 'Language Files', isDir: true }
];

let backedUp = 0;
let skipped = 0;

const backupFolder = path.join(backupDir, `backup_${timestamp}`);
fs.mkdirSync(backupFolder, { recursive: true });

function copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        files.forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

itemsToBackup.forEach(item => {
    if (fs.existsSync(item.path)) {
        try {
            const destPath = path.join(backupFolder, path.basename(item.path));
            
            if (item.isDir) {
                copyRecursive(item.path, destPath);
                const fileCount = fs.readdirSync(item.path).length;
                console.log(`✅ ${item.name}: ${fileCount} files backed up`);
            } else {
                fs.copyFileSync(item.path, destPath);
                const size = (fs.statSync(item.path).size / 1024).toFixed(2);
                console.log(`✅ ${item.name}: ${size} KB backed up`);
            }
            
            backedUp++;
        } catch (e) {
            console.error(`❌ ${item.name}: Failed - ${e.message}`);
        }
    } else {
        console.log(`⚠️  ${item.name}: Not found (skipped)`);
        skipped++;
    }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   📊 BACKUP SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`✅ Backed up: ${backedUp} items`);
console.log(`⚠️  Skipped: ${skipped} items`);
console.log(`📁 Location: ${backupFolder}\n`);

// List all backups
const backups = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('backup_'))
    .sort()
    .reverse();

if (backups.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📚 ALL BACKUPS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    backups.forEach((backup, i) => {
        const backupPath = path.join(backupDir, backup);
        const stats = fs.statSync(backupPath);
        const date = stats.mtime.toLocaleString();
        
        // Calculate size
        let totalSize = 0;
        function calcSize(dir) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    calcSize(filePath);
                } else {
                    totalSize += stat.size;
                }
            });
        }
        calcSize(backupPath);
        
        const sizeStr = (totalSize / 1024).toFixed(2);
        console.log(`${i === 0 ? '📦' : '📁'} ${backup}`);
        console.log(`   Date: ${date}`);
        console.log(`   Size: ${sizeStr} KB`);
    });
    
    console.log('');
    
    // Clean old backups (keep last 10)
    if (backups.length > 10) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('   🧹 CLEANUP');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        const toDelete = backups.slice(10);
        console.log(`Removing ${toDelete.length} old backup(s)...`);
        
        toDelete.forEach(backup => {
            const backupPath = path.join(backupDir, backup);
            fs.rmSync(backupPath, { recursive: true, force: true });
            console.log(`   Deleted: ${backup}`);
        });
        
        console.log('');
    }
}

console.log('✅ Backup complete!\n');

// Instructions
console.log('💡 To restore a backup:');
console.log(`   1. Navigate to: ${backupFolder}`);
console.log('   2. Copy files back to project root');
console.log('   3. Restart the bot\n');