// ═══════════════════════════════════════════════════════════
//  STATUS CHECKER MODULE
// ═══════════════════════════════════════════════════════════

const { status } = require('minecraft-server-util');

class StatusChecker {
    static async getStatus(cfg, iconMgr) {
        try {
            const res = await status(cfg.serverIP, cfg.serverPort, {
                timeout: 5000,
                enableSRV: true
            });

            let favicon = null;
            if (res.favicon) {
                favicon = res.favicon;
                if (cfg.autoSaveIcon !== false) {
                    iconMgr.save(cfg.serverName, favicon);
                }
            }

            return {
                online: true,
                version: res.version.name || 'Unknown',
                players: {
                    online: res.players.online || 0,
                    max: res.players.max || 0,
                    list: res.players.sample ? res.players.sample.map(p => p.name) : []
                },
                motd: res.motd.clean || 'No MOTD',
                ping: res.roundTripLatency || 0,
                favicon
            };
        } catch (e) {
            return { online: false, error: e.message };
        }
    }
}

module.exports = { StatusChecker };