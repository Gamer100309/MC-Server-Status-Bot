// ═══════════════════════════════════════════════════════════
//  ICON MANAGER MODULE
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

class IconManager {
    constructor(guildId, configManager) {
        const base = configManager.getIconsFolder(guildId);
        this.online = path.join(base, 'online');
        this.local = path.join(base, 'local');
    }

    save(name, base64) {
        try {
            const safe = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const p = path.join(this.online, `${safe}-servericon.png`);
            const buf = Buffer.from(base64.split(',')[1], 'base64');
            fs.writeFileSync(p, buf);
            return p;
        } catch (e) {
            return null;
        }
    }

    getOnline(name) {
        const safe = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const p = path.join(this.online, `${safe}-servericon.png`);
        return fs.existsSync(p) ? p : null;
    }

    getLocal(name) {
        const safe = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const p = path.join(this.local, `${safe}-servericon.png`);
        return fs.existsSync(p) ? p : null;
    }
}

module.exports = { IconManager };