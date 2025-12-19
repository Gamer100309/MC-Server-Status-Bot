// ═══════════════════════════════════════════════════════════
//  MONITORING MANAGER MODULE
//  Enhanced with Text-System Support (Phase 1)
// ═══════════════════════════════════════════════════════════

const { StateManager } = require('./StateManager');
const { IconManager } = require('./IconManager');
const { StatusChecker } = require('./StatusChecker');
const { StatusEmbedBuilder } = require('./EmbedBuilder');

class MonitoringManager {
    constructor(client, configManager, logger, messageHandler) {
        this.client = client;
        this.configManager = configManager;
        this.logger = logger;
        this.messageHandler = messageHandler;
        this.guildIntervals = new Map();
    }

    async updateStatus(guildId, srv) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) return;

            const channel = guild.channels.cache.get(srv.channelID);
            if (!channel) return;

            const gcfg = this.configManager.loadGuild(guildId);
            const iconMgr = new IconManager(guildId, this.configManager);
            const stateMgr = new StateManager(guildId);

            const data = await StatusChecker.getStatus(srv, iconMgr);
            
            // PHASE 1: messageHandler übergeben für mehrsprachige Embeds
            const embed = StatusEmbedBuilder.createEmbed(data, srv, gcfg, this.messageHandler);
            const buttons = StatusEmbedBuilder.createButtons(srv, gcfg, this.messageHandler);

            const msgOpts = { embeds: [embed], components: buttons ? [buttons] : [] };

            // Icon Handling: Online = Live Icon, Offline = Gespeichertes Icon als Fallback
            if (srv.useServerIcon !== false) {
                let iconBuffer = null;
                
                if (data.online && data.favicon) {
                    // Server online: Nutze aktuelles Favicon
                    iconBuffer = Buffer.from(data.favicon.split(',')[1], 'base64');
                } else {
                    // Server offline: Nutze gespeichertes Icon als Fallback
                    const savedIconPath = iconMgr.getOnline(srv.serverName);
                    if (savedIconPath) {
                        try {
                            const fs = require('fs');
                            iconBuffer = fs.readFileSync(savedIconPath);
                            this.logger.verbose(`Nutze gespeichertes Icon für offline Server: ${srv.serverName}`);
                        } catch (e) {
                            this.logger.verbose(`Gespeichertes Icon nicht lesbar: ${e.message}`);
                        }
                    }
                }

                if (iconBuffer) {
                    msgOpts.files = [{
                        attachment: iconBuffer,
                        name: 'server-icon.png'
                    }];
                }
            }

            const state = stateMgr.get(srv.channelID);
            
            if (state?.messageID) {
                try {
                    const msg = await channel.messages.fetch(state.messageID);
                    if (msg) {
                        // Einfach nur editieren - KEIN automatisches Löschen!
                        await msg.edit(msgOpts);
                        return;
                    }
                } catch (e) {
                    this.logger.verbose(`Message ${state.messageID} nicht gefunden, erstelle neu`);
                }
            }

            // Neue Message erstellen
            const msg = await channel.send(msgOpts);
            stateMgr.set(srv.channelID, msg.id, data.online ? 'online' : 'offline');
            this.logger.success(`Neue Status-Message erstellt für ${srv.serverName}`);
            
        } catch (e) {
            this.logger.error(`Update Error [${srv.serverName}]: ${e.message}`);
        }
    }

    startMonitoring(guildId) {
        const gcfg = this.configManager.loadGuild(guildId);
        
        if (this.guildIntervals.has(guildId)) {
            this.guildIntervals.get(guildId).forEach(iv => clearInterval(iv));
            this.guildIntervals.delete(guildId);
        }

        const intervals = [];
        
        for (const srv of gcfg.servers) {
            const interval = srv.updateInterval || this.configManager.globalConfig.defaults.updateInterval;
            
            this.updateStatus(guildId, srv);
            
            const iv = setInterval(() => this.updateStatus(guildId, srv), interval);
            intervals.push(iv);
            
            this.logger.success(`Monitoring: ${srv.serverName} (${interval}ms)`);
        }

        this.guildIntervals.set(guildId, intervals);
    }

    stopMonitoring(guildId) {
        if (this.guildIntervals.has(guildId)) {
            this.guildIntervals.get(guildId).forEach(iv => clearInterval(iv));
            this.guildIntervals.delete(guildId);
        }
    }
}

module.exports = { MonitoringManager };