// ═══════════════════════════════════════════════════════════
//  EMBED BUILDER MODULE - PHASE 1 MULTILANG
//  Enhanced with Multi-Language Support
// ═══════════════════════════════════════════════════════════

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

class StatusEmbedBuilder {
    /**
     * Erstellt ein Status-Embed (mehrsprachig)
     * @param {Object} data - Server Status Daten
     * @param {Object} srv - Server Config
     * @param {Object} gcfg - Guild Config
     * @param {Object} messageHandler - MessageHandler Instanz (optional)
     */
    static createEmbed(data, srv, gcfg, messageHandler = null) {
        const s = srv.embedSettings || {};
        
        // Emojis aus Config laden (mit Fallback)
        const e = s.emojis || gcfg.defaultEmojis;
        
        const embed = new EmbedBuilder()
            .setColor(data.online ? 
                (s.colorOnline || gcfg.embedColors.online) : 
                (s.colorOffline || gcfg.embedColors.offline))
            .setTimestamp();
        
        // Footer Text (mehrsprachig)
        const footerText = messageHandler 
            ? messageHandler.get('status.footer', { footerText: gcfg.footerText }, srv, gcfg)
            : `Last updated • ${gcfg.footerText}`;
        embed.setFooter({ text: footerText });

        if (data.online) {
            // ═══════════════════════════════════════════════════════════
            // SERVER IST ONLINE
            // ═══════════════════════════════════════════════════════════
            
            // Titel (mehrsprachig)
            const title = messageHandler
                ? messageHandler.get('status.online.title', { 
                    emoji: e.online, 
                    serverName: srv.serverName 
                  }, srv, gcfg)
                : `${e.online} ${srv.serverName} Online`;
            embed.setTitle(title);
            
            // IP-Feld (wenn aktiviert)
            if (s.showIP !== false) {
                const ipLabel = messageHandler
                    ? messageHandler.get('status.online.fields.ip', { emoji: e.ip }, srv, gcfg)
                    : `${e.ip} Server IP`;
                
                embed.addFields({
                    name: ipLabel,
                    value: `\`${srv.serverIP}${srv.serverPort !== 25565 ? ':' + srv.serverPort : ''}\``,
                    inline: false
                });
            }

            // Port-Feld (wenn aktiviert)
            if (s.showPort === true) {
                const portLabel = messageHandler
                    ? messageHandler.get('status.online.fields.port', { emoji: e.port }, srv, gcfg)
                    : `${e.port} Port`;
                
                embed.addFields({
                    name: portLabel,
                    value: `\`${srv.serverPort}\``,
                    inline: true
                });
            }

            // Version, Players, Ping
            const versionLabel = messageHandler
                ? messageHandler.get('status.online.fields.version', { emoji: e.version }, srv, gcfg)
                : `${e.version} Version`;
            
            const playersLabel = messageHandler
                ? messageHandler.get('status.online.fields.players', { emoji: e.players }, srv, gcfg)
                : `${e.players} Players`;
            
            const pingLabel = messageHandler
                ? messageHandler.get('status.online.fields.ping', { emoji: e.ping }, srv, gcfg)
                : `${e.ping} Ping`;
            
            embed.addFields(
                { name: versionLabel, value: data.version, inline: true },
                { name: playersLabel, value: `${data.players.online}/${data.players.max}`, inline: true },
                { name: pingLabel, value: `${data.ping}ms`, inline: true }
            );

            // Spielerliste (wenn aktiviert)
            if (s.showPlayerList !== false) {
                const playerListLabel = messageHandler
                    ? messageHandler.get('status.online.fields.playerList', { emoji: e.playerList }, srv, gcfg)
                    : `${e.playerList} Online Players`;
                
                if (data.players.list.length > 0) {
                    const list = data.players.list.join(', ').substring(0, 1024);
                    embed.addFields({
                        name: playerListLabel,
                        value: list,
                        inline: false
                    });
                } else if (data.players.max > 0) {
                    // Niemand online
                    const noPlayersText = messageHandler
                        ? messageHandler.get('status.online.noPlayers', {}, srv, gcfg)
                        : '➖ Niemand online';
                    
                    embed.addFields({
                        name: playerListLabel,
                        value: noPlayersText,
                        inline: false
                    });
                }
            }

            // MOTD (wenn aktiviert)
            if ((s.showMOTD !== false) && data.motd) {
                const motdLabel = messageHandler
                    ? messageHandler.get('status.online.fields.motd', { emoji: e.motd }, srv, gcfg)
                    : `${e.motd} MOTD`;
                
                embed.addFields({
                    name: motdLabel,
                    value: data.motd.substring(0, 1024),
                    inline: false
                });
            }

            // Server Icon (Thumbnail)
            if (srv.useServerIcon && data.favicon) {
                embed.setThumbnail('attachment://server-icon.png');
            }
        } else {
            // ═══════════════════════════════════════════════════════════
            // SERVER IST OFFLINE
            // ═══════════════════════════════════════════════════════════
            
            // Titel (mehrsprachig)
            const title = messageHandler
                ? messageHandler.get('status.offline.title', { 
                    emoji: e.offline, 
                    serverName: srv.serverName 
                  }, srv, gcfg)
                : `${e.offline} ${srv.serverName} Offline`;
            embed.setTitle(title);
            
            // Description (mehrsprachig)
            const description = messageHandler
                ? messageHandler.get('status.offline.description', {}, srv, gcfg)
                : 'Server is offline or unreachable';
            embed.setDescription(description);
            
            // IP-Feld (wenn aktiviert)
            if (s.showIP !== false) {
                const ipLabel = messageHandler
                    ? messageHandler.get('status.offline.fields.ip', { emoji: e.ip }, srv, gcfg)
                    : `${e.ip} Server IP`;
                
                embed.addFields({
                    name: ipLabel,
                    value: `\`${srv.serverIP}${srv.serverPort !== 25565 ? ':' + srv.serverPort : ''}\``,
                    inline: false
                });
            }

            // Icon für OFFLINE Server (Fallback zum gespeicherten Icon)
            if (srv.useServerIcon !== false) {
                embed.setThumbnail('attachment://server-icon.png');
            }
        }

        return embed;
    }

    /**
     * Erstellt Button Row (mehrsprachig)
     * @param {Object} srv - Server Config
     * @param {Object} gcfg - Guild Config (optional)
     * @param {Object} messageHandler - MessageHandler Instanz (optional)
     */
    static createButtons(srv, gcfg = null, messageHandler = null) {
        const bs = srv.buttonSettings || {};
        if (bs.enabled === false) return null;

        const row = new ActionRowBuilder();
        
        // IP Button
        if (bs.showIPButton !== false) {
            const label = messageHandler
                ? messageHandler.get('buttons.ip.label', {}, srv, gcfg)
                : (bs.ipButtonLabel || '📋 IP anzeigen');
            
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`ip_${srv.channelID}`)
                    .setLabel(label)
                    .setStyle(ButtonStyle.Primary)
            );
        }

        // Port Button
        if (bs.showPortButton === true) {
            const label = messageHandler
                ? messageHandler.get('buttons.port.label', {}, srv, gcfg)
                : (bs.portButtonLabel || '🔑 Port anzeigen');
            
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`port_${srv.channelID}`)
                    .setLabel(label)
                    .setStyle(ButtonStyle.Secondary)
            );
        }

        // Players Button
        if (bs.showPlayersButton === true) {
            const label = messageHandler
                ? messageHandler.get('buttons.players.label', {}, srv, gcfg)
                : (bs.playersButtonLabel || '👥 Spieler anzeigen');
            
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`players_${srv.channelID}`)
                    .setLabel(label)
                    .setStyle(ButtonStyle.Success)
            );
        }

        return row.components.length > 0 ? row : null;
    }
}

module.exports = { StatusEmbedBuilder };