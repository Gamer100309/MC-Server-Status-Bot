// ═══════════════════════════════════════════════════════════
//  INTERACTION HANDLER MODULE - FULLY MULTILINGUAL
//  Enhanced with Complete Text-System Support
//  All SetupMenus calls updated, all hardcoded texts replaced
// ═══════════════════════════════════════════════════════════

const { 
    EmbedBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ChannelType 
} = require('discord.js');
const { SetupMenus } = require('./SetupMenus');
const { StatusChecker } = require('./StatusChecker');
const { IconManager } = require('./IconManager');

class InteractionHandler {
    constructor(client, configManager, logger, monitoringManager, messageHandler) {
        this.client = client;
        this.configManager = configManager;
        this.logger = logger;
        this.monitoringManager = monitoringManager;
        this.messageHandler = messageHandler;
        
        // SetupMenus mit MessageHandler initialisieren
        this.setupMenus = new SetupMenus(messageHandler);
        
        if (!client.tempServerData) {
            client.tempServerData = new Map();
        }
    }

    async handle(interaction) {
        try {
            if (interaction.isStringSelectMenu()) {
                await this.handleSelectMenu(interaction);
            } else if (interaction.isModalSubmit()) {
                await this.handleModal(interaction);
            } else if (interaction.isButton()) {
                await this.handleButton(interaction);
            }
        } catch (e) {
            this.logger.error(`Interaction Error: ${e.message}`);
            if (!interaction.replied && !interaction.deferred) {
                const gcfg = this.configManager.loadGuild(interaction.guildId);
                await interaction.reply({ 
                    content: this.messageHandler
                        ? this.messageHandler.get('errors.interactionError', {}, null, gcfg)
                        : '❌ Ein Fehler ist aufgetreten', 
                    ephemeral: true 
                }).catch(() => {});
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // HELPER METHODS FOR EMBED DESIGN
    // ═══════════════════════════════════════════════════════════

    async handleEmbedFields(interaction, idx, gcfg) {
        const srv = gcfg.servers[idx];
        if (!srv.embedSettings) srv.embedSettings = {};
        const s = srv.embedSettings;

        const ipStatus = s.showIP !== false 
            ? (this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.ip.visible', {}, srv, gcfg) : '✅ Sichtbar')
            : (this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.ip.hidden', {}, srv, gcfg) : '❌ Versteckt');
        
        const portStatus = s.showPort === true
            ? (this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.port.visible', {}, srv, gcfg) : '✅ Sichtbar')
            : (this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.port.hidden', {}, srv, gcfg) : '❌ Versteckt');
        
        const playersStatus = s.showPlayerList !== false
            ? (this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.players.visible', {}, srv, gcfg) : '✅ Sichtbar')
            : (this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.players.hidden', {}, srv, gcfg) : '❌ Versteckt');
        
        const motdStatus = s.showMOTD !== false
            ? (this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.motd.visible', {}, srv, gcfg) : '✅ Sichtbar')
            : (this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.motd.hidden', {}, srv, gcfg) : '❌ Versteckt');

        const fieldOptions = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`setup_embed_fields_${idx}`)
                    .setPlaceholder(this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.placeholder', {}, srv, gcfg) : '👁️ Feld ein-/ausblenden...')
                    .addOptions([
                        { 
                            label: this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.ip.label', {}, srv, gcfg) : 'IP-Anzeige', 
                            description: ipStatus, 
                            value: 'ip', 
                            emoji: this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.ip.emoji', {}, srv, gcfg) : '🌐'
                        },
                        { 
                            label: this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.port.label', {}, srv, gcfg) : 'Port-Anzeige', 
                            description: portStatus, 
                            value: 'port', 
                            emoji: this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.port.emoji', {}, srv, gcfg) : '🔑'
                        },
                        { 
                            label: this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.players.label', {}, srv, gcfg) : 'Spielerliste', 
                            description: playersStatus, 
                            value: 'players', 
                            emoji: this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.players.emoji', {}, srv, gcfg) : '👥'
                        },
                        { 
                            label: this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.motd.label', {}, srv, gcfg) : 'MOTD', 
                            description: motdStatus, 
                            value: 'motd', 
                            emoji: this.messageHandler ? this.messageHandler.get('setup.embedDesign.fields.motd.emoji', {}, srv, gcfg) : '📢'
                        },
                        { 
                            label: this.messageHandler ? this.messageHandler.get('setup.common.back', {}, srv, gcfg) : '← Zurück', 
                            value: 'back', 
                            emoji: '↩️' 
                        }
                    ])
            );

        const title = this.messageHandler 
            ? this.messageHandler.get('setup.embedDesign.fields.title', { serverName: srv.serverName }, srv, gcfg)
            : `🎨 ${srv.serverName} - Felder`;
        
        const description = this.messageHandler
            ? this.messageHandler.get('setup.embedDesign.fields.description', {}, srv, gcfg)
            : 'Welches Feld möchtest du ein-/ausblenden?';

        await interaction.update({
            embeds: [new EmbedBuilder()
                .setColor('#FF69B4')
                .setTitle(title)
                .setDescription(description)],
            components: [fieldOptions]
        });
    }

    async handleEmbedIcon(interaction, idx, gcfg) {
        const srv = gcfg.servers[idx];
        
        // useServerIcon steuert ob das Server-Favicon verwendet wird
        const current = srv.useServerIcon !== false;
        srv.useServerIcon = !current;
        
        this.configManager.saveGuild(interaction.guildId, gcfg);

        const statusText = srv.useServerIcon 
            ? (this.messageHandler ? this.messageHandler.get('setup.embedDesign.icon.success.statusEnabled', {}, srv, gcfg) : 'Aktiviert ✅')
            : (this.messageHandler ? this.messageHandler.get('setup.embedDesign.icon.success.statusDisabled', {}, srv, gcfg) : 'Deaktiviert ❌');

        this.logger.info(`Server-Icon für "${srv.serverName}": ${srv.useServerIcon ? 'Aktiviert' : 'Deaktiviert'}`);

        // AUTOMATISCHER REFRESH: Lösche alte Message und erstelle neu
        await this.refreshSingleServer(interaction.guildId, srv);

        const title = this.messageHandler
            ? this.messageHandler.get('setup.embedDesign.icon.success.title', {}, srv, gcfg)
            : '✅ Server-Icon geändert';
        
        const description = this.messageHandler
            ? this.messageHandler.get('setup.embedDesign.icon.success.description', { 
                serverName: srv.serverName,
                status: statusText
              }, srv, gcfg)
            : `**${srv.serverName}**\nServer-Icon: **${statusText}**\n\n✅ Alte Message wurde gelöscht und neu erstellt!`;
        
        const footer = this.messageHandler
            ? this.messageHandler.get('setup.embedDesign.icon.success.footer', {}, srv, gcfg)
            : 'Änderung ist sofort sichtbar';

        await interaction.update({
            embeds: [new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: footer })],
            components: []
        });
    }

    async refreshSingleServer(guildId, srv) {
        const { StateManager } = require('./StateManager');
        
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) return;

            const channel = guild.channels.cache.get(srv.channelID);
            if (!channel) return;

            const stateMgr = new StateManager(guildId);
            const state = stateMgr.get(srv.channelID);

            // Alte Message löschen
            if (state?.messageID) {
                try {
                    const msg = await channel.messages.fetch(state.messageID);
                    await msg.delete();
                    this.logger.info(`Alte Message gelöscht für ${srv.serverName}`);
                } catch (e) {
                    this.logger.verbose(`Message ${state.messageID} bereits gelöscht`);
                }

                // State löschen damit neue Message erstellt wird
                stateMgr.state.servers[srv.channelID] = null;
                stateMgr.save();
            }

            // Monitoring neu starten = erstellt sofort neue Message
            this.monitoringManager.startMonitoring(guildId);

        } catch (e) {
            this.logger.error(`Refresh Error für ${srv.serverName}: ${e.message}`);
        }
    }

    async handleEmbedColors(interaction, idx, gcfg) {
        const srv = gcfg.servers[idx];
        const s = srv.embedSettings || {};

        const modalTitle = this.messageHandler
            ? this.messageHandler.get('setup.embedDesign.colors.modalTitle', { serverName: srv.serverName }, srv, gcfg)
            : `🎨 ${srv.serverName} - Farben`;

        const modal = new ModalBuilder()
            .setCustomId(`modal_colors_${idx}`)
            .setTitle(modalTitle);

        const onlineLabel = this.messageHandler
            ? this.messageHandler.get('setup.embedDesign.colors.fields.online.label', {}, srv, gcfg)
            : 'Online Farbe (Hex)';
        
        const offlineLabel = this.messageHandler
            ? this.messageHandler.get('setup.embedDesign.colors.fields.offline.label', {}, srv, gcfg)
            : 'Offline Farbe (Hex)';

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('color_online')
                    .setLabel(onlineLabel)
                    .setPlaceholder('#00FF00')
                    .setValue(s.colorOnline || '#00FF00')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('color_offline')
                    .setLabel(offlineLabel)
                    .setPlaceholder('#FF0000')
                    .setValue(s.colorOffline || '#FF0000')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            )
        );

        await interaction.showModal(modal);
    }

    async handlePermissionRoles(interaction, gcfg) {
        const roles = interaction.guild.roles.cache
            .filter(r => !r.managed && r.id !== interaction.guildId)
            .sort((a, b) => b.position - a.position)
            .first(25);

        if (roles.length === 0) {
            const title = this.messageHandler
                ? this.messageHandler.get('setup.permissions.roleManagement.noRolesFound.title', {}, null, gcfg)
                : '❌ Keine Rollen gefunden';
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.permissions.roleManagement.noRolesFound.description', {}, null, gcfg)
                : 'Erstelle erst Rollen auf deinem Server!';

            return interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(title)
                    .setDescription(description)],
                components: []
            });
        }

        const currentRoles = gcfg.setupPermissions.allowedRoles || [];

        const permittedText = this.messageHandler
            ? this.messageHandler.get('setup.permissions.roleManagement.permitted', {}, null, gcfg)
            : '✅ Berechtigt';
        
        const notPermittedText = this.messageHandler
            ? this.messageHandler.get('setup.permissions.roleManagement.notPermitted', {}, null, gcfg)
            : '❌ Nicht berechtigt';

        const roleOptions = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('setup_permissions_role_toggle')
                    .setPlaceholder(this.messageHandler 
                        ? this.messageHandler.get('setup.permissions.roleManagement.placeholder', {}, null, gcfg)
                        : '🎭 Rolle hinzufügen/entfernen...')
                    .setMaxValues(1)
                    .addOptions(roles.map(r => ({
                        label: r.name,
                        description: currentRoles.includes(r.id) ? permittedText : notPermittedText,
                        value: r.id,
                        emoji: currentRoles.includes(r.id) ? '✅' : '❌'
                    })))
            );

        const title = this.messageHandler
            ? this.messageHandler.get('setup.permissions.roleManagement.title', {}, null, gcfg)
            : '🎭 Berechtigte Rollen';
        
        const description = this.messageHandler
            ? this.messageHandler.get('setup.permissions.roleManagement.description', {}, null, gcfg)
            : 'Klicke auf eine Rolle um sie hinzuzufügen/zu entfernen:';
        
        const currentRolesLabel = this.messageHandler
            ? this.messageHandler.get('setup.permissions.roleManagement.currentRoles', {}, null, gcfg)
            : '📋 Aktuell berechtigt';
        
        const noRolesText = this.messageHandler
            ? this.messageHandler.get('setup.permissions.roleManagement.noRoles', {}, null, gcfg)
            : 'Keine Rollen';

        await interaction.update({
            embeds: [new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle(title)
                .setDescription(description)
                .addFields({
                    name: currentRolesLabel,
                    value: currentRoles.length > 0 ? currentRoles.map(r => `<@&${r}>`).join(', ') : noRolesText,
                    inline: false
                })],
            components: [roleOptions]
        });
    }

    async handleGlobalFooter(interaction, gcfg) {
        const modalTitle = this.messageHandler
            ? this.messageHandler.get('setup.global.footerModal.title', {}, null, gcfg)
            : '📝 Footer-Text ändern';

        const modal = new ModalBuilder()
            .setCustomId('modal_global_footer')
            .setTitle(modalTitle);

        const fieldLabel = this.messageHandler
            ? this.messageHandler.get('setup.global.footerModal.field.label', {}, null, gcfg)
            : 'Footer-Text';
        
        const fieldPlaceholder = this.messageHandler
            ? this.messageHandler.get('setup.global.footerModal.field.placeholder', {}, null, gcfg)
            : 'mcapi.us';

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('footer_text')
                    .setLabel(fieldLabel)
                    .setPlaceholder(fieldPlaceholder)
                    .setValue(gcfg.footerText || 'mcapi.us')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(100)
            )
        );

        await interaction.showModal(modal);
    }

    async handleGlobalColors(interaction, gcfg) {
        const modalTitle = this.messageHandler
            ? this.messageHandler.get('setup.global.colorsModal.title', {}, null, gcfg)
            : '🎨 Standard-Farben ändern';

        const modal = new ModalBuilder()
            .setCustomId('modal_global_colors')
            .setTitle(modalTitle);

        const onlineLabel = this.messageHandler
            ? this.messageHandler.get('setup.global.colorsModal.fields.online.label', {}, null, gcfg)
            : 'Online Farbe (Hex)';
        
        const offlineLabel = this.messageHandler
            ? this.messageHandler.get('setup.global.colorsModal.fields.offline.label', {}, null, gcfg)
            : 'Offline Farbe (Hex)';

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('color_online')
                    .setLabel(onlineLabel)
                    .setPlaceholder('#00FF00')
                    .setValue(gcfg.embedColors?.online || '#00FF00')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('color_offline')
                    .setLabel(offlineLabel)
                    .setPlaceholder('#FF0000')
                    .setValue(gcfg.embedColors?.offline || '#FF0000')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            )
        );

        await interaction.showModal(modal);
    }

    async handleSelectMenu(interaction) {
        const gcfg = this.configManager.loadGuild(interaction.guildId);

        // Main Menu Navigation
        if (interaction.customId === 'setup_main_menu') {
            const category = interaction.values[0];
            
            if (category === 'servers') {
                await interaction.update({
                    embeds: [this.setupMenus.createServerManagementEmbed(gcfg)],
                    components: [this.setupMenus.createServerMenu(gcfg)]
                });
            } else if (category === 'intervals') {
                await interaction.update({
                    embeds: [this.setupMenus.createIntervalsEmbed(gcfg.servers, gcfg)],
                    components: [this.setupMenus.createIntervalsMenu(gcfg.servers, gcfg)]
                });
            } else if (category === 'embed') {
                await interaction.update({
                    embeds: [this.setupMenus.createEmbedDesignEmbed(gcfg.servers, gcfg)],
                    components: [this.setupMenus.createEmbedDesignMenu(gcfg.servers, gcfg)]
                });
            } else if (category === 'buttons') {
                await interaction.update({
                    embeds: [this.setupMenus.createButtonsEmbed(gcfg.servers, gcfg)],
                    components: [this.setupMenus.createButtonsMenu(gcfg.servers, gcfg)]
                });
            } else if (category === 'permissions') {
                await interaction.update({
                    embeds: [this.setupMenus.createPermissionsEmbed(gcfg, gcfg)],
                    components: [this.setupMenus.createPermissionsMenu(gcfg)]
                });
            } else if (category === 'global') {
                await interaction.update({
                    embeds: [this.setupMenus.createGlobalEmbed(gcfg, gcfg)],
                    components: [this.setupMenus.createGlobalMenu(gcfg)]
                });
            } else if (category === 'texts') {
                await this.handleTextsMenu(interaction, gcfg);
            }
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // EMBED FIELDS TOGGLE
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId.startsWith('setup_embed_fields_')) {
            const idx = parseInt(interaction.customId.split('_')[3]);
            const value = interaction.values[0];
            const srv = gcfg.servers[idx];

            if (value === 'back') {
                const title = this.messageHandler
                    ? this.messageHandler.get('setup.embedDesign.designOptions.title', { serverName: srv.serverName }, srv, gcfg)
                    : `🎨 ${srv.serverName} - Design`;
                
                const description = this.messageHandler
                    ? this.messageHandler.get('setup.embedDesign.designOptions.description', {}, srv, gcfg)
                    : 'Was möchtest du ändern?';

                await interaction.update({
                    embeds: [new EmbedBuilder()
                        .setColor('#FF69B4')
                        .setTitle(title)
                        .setDescription(description)],
                    components: [this.setupMenus.createEmbedOptionsMenu(idx, gcfg)]
                });
                return;
            }

            if (!srv.embedSettings) srv.embedSettings = {};
            const s = srv.embedSettings;

            if (value === 'ip') {
                s.showIP = !(s.showIP !== false);
            } else if (value === 'port') {
                s.showPort = !s.showPort;
            } else if (value === 'players') {
                s.showPlayerList = !(s.showPlayerList !== false);
            } else if (value === 'motd') {
                s.showMOTD = !(s.showMOTD !== false);
            }

            this.configManager.saveGuild(interaction.guildId, gcfg);
            this.monitoringManager.startMonitoring(interaction.guildId);

            const title = this.messageHandler
                ? this.messageHandler.get('setup.embedDesign.fields.success.title', {}, srv, gcfg)
                : '✅ Feld-Einstellungen aktualisiert';
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.embedDesign.fields.success.description', { serverName: srv.serverName }, srv, gcfg)
                : `**${srv.serverName}**\nÄnderungen wurden gespeichert!`;

            await interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle(title)
                    .setDescription(description)],
                components: []
            });
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // PERMISSION ROLE TOGGLE
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId === 'setup_permissions_role_toggle') {
            const roleId = interaction.values[0];

            if (!gcfg.setupPermissions.allowedRoles) {
                gcfg.setupPermissions.allowedRoles = [];
            }

            const idx = gcfg.setupPermissions.allowedRoles.indexOf(roleId);

            // Toggle durchführen
            const wasAdded = idx === -1;
            if (idx > -1) {
                gcfg.setupPermissions.allowedRoles.splice(idx, 1);
            } else {
                gcfg.setupPermissions.allowedRoles.push(roleId);
            }

            this.configManager.saveGuild(interaction.guildId, gcfg);

            const action = wasAdded ? 'hinzugefügt' : 'entfernt';
            const title = this.messageHandler
                ? this.messageHandler.get(wasAdded ? 'setup.permissions.roleToggled.titleAdded' : 'setup.permissions.roleToggled.titleRemoved', {}, null, gcfg)
                : `✅ Rolle ${action}`;
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.permissions.roleToggled.description', { roleId, action }, null, gcfg)
                : `<@&${roleId}> wurde ${action}!`;
            
            const accessLabel = this.messageHandler
                ? this.messageHandler.get('setup.permissions.roleToggled.accessList', {}, null, gcfg)
                : '📋 Setup-Zugriff haben:';
            
            const adminsText = this.messageHandler
                ? this.messageHandler.get('setup.permissions.roleToggled.admins', {}, null, gcfg)
                : '👑 **Alle Administratoren**';
            
            const additionalRoles = gcfg.setupPermissions.allowedRoles.length > 0
                ? (this.messageHandler
                    ? this.messageHandler.get('setup.permissions.roleToggled.additionalRoles', { 
                        roles: gcfg.setupPermissions.allowedRoles.map(r => `<@&${r}>`).join(', ')
                      }, null, gcfg)
                    : `\n🎭 **Zusätzliche Rollen:** ${gcfg.setupPermissions.allowedRoles.map(r => `<@&${r}>`).join(', ')}`)
                : '';

            await interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor(wasAdded ? '#00FF00' : '#FF0000')
                    .setTitle(title)
                    .setDescription(description)
                    .addFields({
                        name: accessLabel,
                        value: `${adminsText}${additionalRoles}`,
                        inline: false
                    })],
                components: []
            });
            return;
        }

        // Server Management Actions
        if (interaction.customId === 'setup_servers_action') {
            await this.handleServerAction(interaction, gcfg);
            return;
        }

        // Server Selection for Edit
        if (interaction.customId === 'select_server_edit') {
            await this.handleServerEdit(interaction, gcfg);
            return;
        }

        // Server Selection for Delete
        if (interaction.customId === 'select_server_delete') {
            await this.handleServerDelete(interaction, gcfg);
            return;
        }

        // Channel Selection
        if (interaction.customId === 'select_channel') {
            await this.handleChannelSelect(interaction, gcfg);
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // UPDATE INTERVALS
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId === 'setup_intervals_select' || interaction.customId === 'setup_intervals_back') {
            const value = interaction.values[0];
            if (value === 'back') {
                await interaction.update({
                    embeds: [this.setupMenus.createMainMenu(gcfg)],
                    components: [this.setupMenus.createMainMenuSelect(gcfg)]
                });
                return;
            }

            const idx = parseInt(value);
            const srv = gcfg.servers[idx];
            const currentInterval = (srv.updateInterval || 10000) / 1000;

            const title = this.messageHandler
                ? this.messageHandler.get('setup.intervals.changeTitle', { serverName: srv.serverName }, srv, gcfg)
                : `⏱️ ${srv.serverName} - Intervall ändern`;
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.intervals.changeDescription', { interval: currentInterval }, srv, gcfg)
                : `Aktuell: **${currentInterval}s**\n\nWähle ein neues Update-Intervall:`;
            
            const recommendationLabel = this.messageHandler
                ? this.messageHandler.get('setup.intervals.recommendation', {}, srv, gcfg)
                : '💡 Empfehlung';
            
            const recommendationText = this.messageHandler
                ? this.messageHandler.get('setup.intervals.recommendationText', {}, srv, gcfg)
                : '10 Sekunden ist optimal für die meisten Server.\nKürzere Intervalle erhöhen die Serverlast.';

            await interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle(title)
                    .setDescription(description)
                    .addFields({
                        name: recommendationLabel,
                        value: recommendationText,
                        inline: false
                    })],
                components: [this.setupMenus.createIntervalOptionsMenu(idx, gcfg)]
            });
            return;
        }

        if (interaction.customId.startsWith('setup_interval_set_')) {
            const idx = parseInt(interaction.customId.split('_')[3]);
            const value = interaction.values[0];

            if (value === 'back') {
                await interaction.update({
                    embeds: [this.setupMenus.createIntervalsEmbed(gcfg.servers, gcfg)],
                    components: [this.setupMenus.createIntervalsMenu(gcfg.servers, gcfg)]
                });
                return;
            }

            const newInterval = parseInt(value);
            gcfg.servers[idx].updateInterval = newInterval;
            this.configManager.saveGuild(interaction.guildId, gcfg);
            this.monitoringManager.startMonitoring(interaction.guildId);

            const title = this.messageHandler
                ? this.messageHandler.get('setup.intervals.success.title', {}, null, gcfg)
                : '✅ Intervall aktualisiert';
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.intervals.success.description', { 
                    serverName: gcfg.servers[idx].serverName,
                    interval: newInterval / 1000
                  }, null, gcfg)
                : `**${gcfg.servers[idx].serverName}**\nNeues Intervall: **${newInterval / 1000}s**`;
            
            const footer = this.messageHandler
                ? this.messageHandler.get('setup.intervals.success.footer', {}, null, gcfg)
                : 'Monitoring wurde neu gestartet!';

            await interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle(title)
                    .setDescription(description)
                    .setFooter({ text: footer })],
                components: []
            });
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // EMBED DESIGN
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId === 'setup_embed_select' || interaction.customId === 'setup_embed_back') {
            const value = interaction.values[0];
            if (value === 'back') {
                await interaction.update({
                    embeds: [this.setupMenus.createMainMenu(gcfg)],
                    components: [this.setupMenus.createMainMenuSelect(gcfg)]
                });
                return;
            }

            const idx = parseInt(value);
            const title = this.messageHandler
                ? this.messageHandler.get('setup.embedDesign.designOptions.title', { serverName: gcfg.servers[idx].serverName }, null, gcfg)
                : `🎨 ${gcfg.servers[idx].serverName} - Design`;
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.embedDesign.designOptions.description', {}, null, gcfg)
                : 'Was möchtest du ändern?';

            await interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#FF69B4')
                    .setTitle(title)
                    .setDescription(description)],
                components: [this.setupMenus.createEmbedOptionsMenu(idx, gcfg)]
            });
            return;
        }

        if (interaction.customId.startsWith('setup_embed_option_')) {
            const idx = parseInt(interaction.customId.split('_')[3]);
            const value = interaction.values[0];

            if (value === 'back') {
                await interaction.update({
                    embeds: [this.setupMenus.createEmbedDesignEmbed(gcfg.servers, gcfg)],
                    components: [this.setupMenus.createEmbedDesignMenu(gcfg.servers, gcfg)]
                });
                return;
            }

            if (value === 'fields') {
                await this.handleEmbedFields(interaction, idx, gcfg);
            } else if (value === 'icon') {
                await this.handleEmbedIcon(interaction, idx, gcfg);
            } else if (value === 'colors') {
                await this.handleEmbedColors(interaction, idx, gcfg);
            }
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // BUTTONS
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId === 'setup_buttons_select' || interaction.customId === 'setup_buttons_back') {
            const value = interaction.values[0];
            if (value === 'back') {
                await interaction.update({
                    embeds: [this.setupMenus.createMainMenu(gcfg)],
                    components: [this.setupMenus.createMainMenuSelect(gcfg)]
                });
                return;
            }

            const idx = parseInt(value);
            const srv = gcfg.servers[idx];

            const title = this.messageHandler
                ? this.messageHandler.get('setup.buttons.options.title', { serverName: srv.serverName }, srv, gcfg)
                : `🔘 ${srv.serverName} - Buttons`;
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.buttons.options.description', {}, srv, gcfg)
                : 'Konfiguriere die interaktiven Buttons:';

            await interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle(title)
                    .setDescription(description)],
                components: [this.setupMenus.createButtonOptionsMenu(idx, srv, gcfg)]
            });
            return;
        }

        if (interaction.customId.startsWith('setup_button_toggle_')) {
            const idx = parseInt(interaction.customId.split('_')[3]);
            const value = interaction.values[0];
            const srv = gcfg.servers[idx];

            if (value === 'back') {
                await interaction.update({
                    embeds: [this.setupMenus.createButtonsEmbed(gcfg.servers, gcfg)],
                    components: [this.setupMenus.createButtonsMenu(gcfg.servers, gcfg)]
                });
                return;
            }

            if (!srv.buttonSettings) srv.buttonSettings = {};

            if (value === 'toggle') {
                srv.buttonSettings.enabled = !(srv.buttonSettings.enabled !== false);
            } else if (value === 'ip') {
                srv.buttonSettings.showIPButton = !(srv.buttonSettings.showIPButton !== false);
            } else if (value === 'port') {
                srv.buttonSettings.showPortButton = !srv.buttonSettings.showPortButton;
            } else if (value === 'players') {
                srv.buttonSettings.showPlayersButton = !srv.buttonSettings.showPlayersButton;
            }

            this.configManager.saveGuild(interaction.guildId, gcfg);
            this.monitoringManager.startMonitoring(interaction.guildId);

            const title = this.messageHandler
                ? this.messageHandler.get('setup.buttons.options.success.title', {}, srv, gcfg)
                : '✅ Button-Einstellungen aktualisiert';
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.buttons.options.success.description', { serverName: srv.serverName }, srv, gcfg)
                : `**${srv.serverName}**\nÄnderungen wurden gespeichert!`;

            await interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle(title)
                    .setDescription(description)],
                components: []
            });
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // PERMISSIONS
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId === 'setup_permissions_action') {
            const value = interaction.values[0];

            if (value === 'back') {
                await interaction.update({
                    embeds: [this.setupMenus.createMainMenu(gcfg)],
                    components: [this.setupMenus.createMainMenuSelect(gcfg)]
                });
                return;
            }

            if (value === 'roles') {
                await this.handlePermissionRoles(interaction, gcfg);
            }
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // GLOBAL SETTINGS
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId === 'setup_global_action') {
            const value = interaction.values[0];

            if (value === 'back') {
                await interaction.update({
                    embeds: [this.setupMenus.createMainMenu(gcfg)],
                    components: [this.setupMenus.createMainMenuSelect(gcfg)]
                });
                return;
            }

            if (value === 'footer') {
                await this.handleGlobalFooter(interaction, gcfg);
            } else if (value === 'colors') {
                await this.handleGlobalColors(interaction, gcfg);
            }
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // TEXT-SYSTEM HANDLER
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId === 'setup_texts_action') {
            await this.handleTextsAction(interaction, gcfg);
            return;
        }

        if (interaction.customId === 'setup_global_language_select') {
            await this.handleGlobalLanguageSelect(interaction, gcfg);
            return;
        }

        if (interaction.customId === 'setup_server_language_select' || interaction.customId === 'setup_server_language_back') {
            await this.handleServerLanguageSelect(interaction, gcfg);
            return;
        }

        if (interaction.customId.startsWith('setup_server_language_change_')) {
            await this.handleServerLanguageChange(interaction, gcfg);
            return;
        }
    }

    async handleServerAction(interaction, gcfg) {
        const action = interaction.values[0];

        if (action === 'back') {
            await interaction.update({
                embeds: [this.setupMenus.createMainMenu(gcfg)],
                components: [this.setupMenus.createMainMenuSelect(gcfg)]
            });
            return;
        }

        if (action === 'add') {
            const modalTitle = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.add.modalTitle', {}, null, gcfg)
                : '➕ Server hinzufügen';

            const modal = new ModalBuilder()
                .setCustomId('modal_add_server')
                .setTitle(modalTitle);

            const nameLabel = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.add.fields.name.label', {}, null, gcfg)
                : 'Server Name';
            
            const namePlaceholder = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.add.fields.name.placeholder', {}, null, gcfg)
                : 'z.B. Mein Survival Server';
            
            const ipLabel = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.add.fields.ip.label', {}, null, gcfg)
                : 'Server IP';
            
            const ipPlaceholder = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.add.fields.ip.placeholder', {}, null, gcfg)
                : 'z.B. mc.hypixel.net';
            
            const portLabel = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.add.fields.port.label', {}, null, gcfg)
                : 'Server Port';
            
            const portPlaceholder = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.add.fields.port.placeholder', {}, null, gcfg)
                : '25565 (Standard)';

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('server_name')
                        .setLabel(nameLabel)
                        .setPlaceholder(namePlaceholder)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('server_ip')
                        .setLabel(ipLabel)
                        .setPlaceholder(ipPlaceholder)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('server_port')
                        .setLabel(portLabel)
                        .setPlaceholder(portPlaceholder)
                        .setValue('25565')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                )
            );

            await interaction.showModal(modal);
            return;
        }

        if (action === 'edit') {
            if (gcfg.servers.length === 0) {
                const errorMsg = this.messageHandler
                    ? this.messageHandler.get('setup.serverManagement.edit.noServers', {}, null, gcfg)
                    : '❌ Keine Server vorhanden! Füge erst einen Server hinzu.';

                return interaction.reply({
                    content: errorMsg,
                    ephemeral: true
                });
            }

            const title = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.edit.selectPrompt', {}, null, gcfg)
                : '✏️ Server bearbeiten';
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.edit.selectDescription', {}, null, gcfg)
                : 'Wähle den Server, den du bearbeiten möchtest:';
            
            const placeholder = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.edit.selectPlaceholder', {}, null, gcfg)
                : '🖊️ Server zum Bearbeiten wählen...';

            const select = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('select_server_edit')
                        .setPlaceholder(placeholder)
                        .addOptions(gcfg.servers.map((s, i) => ({
                            label: s.serverName,
                            description: `${s.serverIP}:${s.serverPort}`,
                            value: `${i}`,
                            emoji: '🎮'
                        })))
                );

            await interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle(title)
                    .setDescription(description)],
                components: [select]
            });
            return;
        }

        if (action === 'delete') {
            if (gcfg.servers.length === 0) {
                const errorMsg = this.messageHandler
                    ? this.messageHandler.get('setup.serverManagement.delete.noServers', {}, null, gcfg)
                    : '❌ Keine Server vorhanden!';

                return interaction.reply({
                    content: errorMsg,
                    ephemeral: true
                });
            }

            const title = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.delete.selectPrompt', {}, null, gcfg)
                : '🗑️ Server löschen';
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.delete.selectDescription', {}, null, gcfg)
                : '⚠️ Wähle den Server, den du entfernen möchtest:';
            
            const placeholder = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.delete.selectPlaceholder', {}, null, gcfg)
                : '🗑️ Server zum Löschen wählen...';

            const select = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('select_server_delete')
                        .setPlaceholder(placeholder)
                        .addOptions(gcfg.servers.map((s, i) => ({
                            label: s.serverName,
                            description: `${s.serverIP}:${s.serverPort}`,
                            value: `${i}`,
                            emoji: '🎮'
                        })))
                );

            await interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(title)
                    .setDescription(description)],
                components: [select]
            });
        }
    }

    async handleServerEdit(interaction, gcfg) {
        const idx = parseInt(interaction.values[0]);
        const srv = gcfg.servers[idx];

        const modalTitle = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.edit.modalTitle', { serverName: srv.serverName }, srv, gcfg)
            : `✏️ ${srv.serverName} bearbeiten`;

        const modal = new ModalBuilder()
            .setCustomId(`modal_edit_server_${idx}`)
            .setTitle(modalTitle);

        const nameLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.fields.name.label', {}, srv, gcfg)
            : 'Server Name';
        
        const ipLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.fields.ip.label', {}, srv, gcfg)
            : 'Server IP';
        
        const portLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.fields.port.label', {}, srv, gcfg)
            : 'Server Port';

        modal.addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('server_name')
                    .setLabel(nameLabel)
                    .setValue(srv.serverName)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('server_ip')
                    .setLabel(ipLabel)
                    .setValue(srv.serverIP)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('server_port')
                    .setLabel(portLabel)
                    .setValue(srv.serverPort.toString())
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            )
        );

        await interaction.showModal(modal);
    }

    async handleServerDelete(interaction, gcfg) {
        const idx = parseInt(interaction.values[0]);
        const srv = gcfg.servers[idx];

        // Server aus Config entfernen
        gcfg.servers.splice(idx, 1);
        this.configManager.saveGuild(interaction.guildId, gcfg);
        
        // Alte Status-Message löschen falls vorhanden
        const { StateManager } = require('./StateManager');
        const stateMgr = new StateManager(interaction.guildId);
        const state = stateMgr.get(srv.channelID);
        
        if (state?.messageID) {
            try {
                const channel = interaction.guild.channels.cache.get(srv.channelID);
                if (channel) {
                    const msg = await channel.messages.fetch(state.messageID);
                    await msg.delete();
                    this.logger.info(`Status-Message gelöscht für ${srv.serverName}`);
                }
            } catch (e) {
                this.logger.verbose(`Message ${state.messageID} konnte nicht gelöscht werden: ${e.message}`);
            }
            
            // State entfernen
            delete stateMgr.state.servers[srv.channelID];
            stateMgr.save();
        }
        
        // Monitoring neu starten (ohne den gelöschten Server)
        this.monitoringManager.startMonitoring(interaction.guildId);

        const title = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.delete.success.title', {}, null, gcfg)
            : '✅ Server gelöscht';
        
        const description = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.delete.success.description', { serverName: srv.serverName }, null, gcfg)
            : `Server **${srv.serverName}** wurde entfernt.\n\n✅ Status-Message wurde gelöscht`;

        await interaction.update({
            embeds: [new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(title)
                .setDescription(description)],
            components: []
        });
    }

    async handleChannelSelect(interaction, gcfg) {
        const channelId = interaction.values[0];
        
        // WICHTIG: User ID aus interaction.user holen, nicht aus message
        const userId = interaction.user.id;
        
        const tempData = this.client.tempServerData.get(userId);
        if (!tempData) {
            this.logger.error(`Temp data nicht gefunden für User ${userId}`);
            this.logger.verbose(`Verfügbare Keys: ${Array.from(this.client.tempServerData.keys()).join(', ')}`);
            
            const title = this.messageHandler
                ? this.messageHandler.get('errors.sessionExpired.title', {}, null, gcfg)
                : '❌ Sitzung abgelaufen';
            
            const description = this.messageHandler
                ? this.messageHandler.get('errors.sessionExpired.description', {}, null, gcfg)
                : 'Deine Sitzung ist abgelaufen. Bitte starte erneut mit `/setup`';
            
            const tipLabel = this.messageHandler
                ? this.messageHandler.get('errors.sessionExpired.tip', {}, null, gcfg)
                : '💡 Tipp';
            
            const tipText = this.messageHandler
                ? this.messageHandler.get('errors.sessionExpired.tipText', {}, null, gcfg)
                : 'Versuche schneller zu sein oder starte den Prozess neu.';

            return interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(title)
                    .setDescription(description)
                    .addFields({
                        name: tipLabel,
                        value: tipText,
                        inline: false
                    })],
                components: []
            });
        }

        // Channel-Berechtigungen prüfen
        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel) {
            const errorMsg = this.messageHandler
                ? this.messageHandler.get('errors.channelNotFound', {}, null, gcfg)
                : '❌ Channel nicht gefunden';

            return interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(errorMsg)],
                components: []
            });
        }

        const { PermissionManager } = require('./PermissionManager');
        const permCheck = await PermissionManager.checkChannelPerms(channel);

        if (!permCheck.hasAll) {
            const missingPerms = PermissionManager.formatMissingPerms(permCheck.missing, this.messageHandler, gcfg);
            
            const title = this.messageHandler
                ? this.messageHandler.get('errors.missingPermissions.title', {}, null, gcfg)
                : '❌ Fehlende Berechtigungen';
            
            const description = this.messageHandler
                ? this.messageHandler.get('errors.missingPermissions.description', { channelId }, null, gcfg)
                : `Der Bot hat nicht alle benötigten Berechtigungen in <#${channelId}>!`;
            
            const permLabel = this.messageHandler
                ? this.messageHandler.get('errors.missingPermissions.permissionsList', {}, null, gcfg)
                : '📋 Benötigte Berechtigungen';
            
            const footer = this.messageHandler
                ? this.messageHandler.get('errors.missingPermissions.footer', {}, null, gcfg)
                : 'Bitte gib dem Bot die fehlenden Berechtigungen und versuche es erneut.';

            return interaction.update({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(title)
                    .setDescription(description)
                    .addFields({
                        name: permLabel,
                        value: missingPerms,
                        inline: false
                    })
                    .setFooter({ text: footer })],
                components: []
            });
        }

        tempData.channelID = channelId;

        const newServer = {
            serverName: tempData.serverName,
            serverIP: tempData.serverIP,
            serverPort: tempData.serverPort,
            channelID: channelId,
            updateInterval: this.configManager.globalConfig.defaults.updateInterval,
            useServerIcon: true,
            autoSaveIcon: true,
            embedSettings: {},
            buttonSettings: { enabled: true }
        };

        gcfg.servers.push(newServer);
        this.configManager.saveGuild(interaction.guildId, gcfg);
        
        // Cleanup
        this.client.tempServerData.delete(userId);
        this.logger.success(`Server "${newServer.serverName}" hinzugefügt von ${interaction.user.tag}`);
        
        this.monitoringManager.startMonitoring(interaction.guildId);

        const title = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.success.title', {}, null, gcfg)
            : '✅ Server hinzugefügt!';
        
        const serverLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.success.server', {}, null, gcfg)
            : '🎮 Server';
        
        const ipLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.success.ip', {}, null, gcfg)
            : '🌐 IP';
        
        const channelLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.success.channel', {}, null, gcfg)
            : '📺 Channel';
        
        const footer = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.success.footer', {}, null, gcfg)
            : 'Monitoring wurde gestartet!';

        await interaction.update({
            embeds: [new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(title)
                .addFields(
                    { name: serverLabel, value: newServer.serverName, inline: true },
                    { name: ipLabel, value: `${newServer.serverIP}:${newServer.serverPort}`, inline: true },
                    { name: channelLabel, value: channel.name, inline: true }
                )
                .setFooter({ text: footer })],
            components: []
        });
    }

    async handleModal(interaction) {
        const gcfg = this.configManager.loadGuild(interaction.guildId);

        if (interaction.customId === 'modal_add_server') {
            await this.handleAddServerModal(interaction, gcfg);
            return;
        }

        if (interaction.customId.startsWith('modal_edit_server_')) {
            await this.handleEditServerModal(interaction, gcfg);
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // EMBED COLORS MODAL
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId.startsWith('modal_colors_')) {
            const idx = parseInt(interaction.customId.split('_')[2]);
            const srv = gcfg.servers[idx];

            const onlineColor = interaction.fields.getTextInputValue('color_online') || '#00FF00';
            const offlineColor = interaction.fields.getTextInputValue('color_offline') || '#FF0000';

            if (!srv.embedSettings) srv.embedSettings = {};
            srv.embedSettings.colorOnline = onlineColor;
            srv.embedSettings.colorOffline = offlineColor;

            this.configManager.saveGuild(interaction.guildId, gcfg);
            this.monitoringManager.startMonitoring(interaction.guildId);

            const title = this.messageHandler
                ? this.messageHandler.get('setup.embedDesign.colors.success.title', {}, srv, gcfg)
                : '✅ Farben aktualisiert';
            
            const onlineLabel = this.messageHandler
                ? this.messageHandler.get('setup.embedDesign.colors.success.online', {}, srv, gcfg)
                : '🟢 Online';
            
            const offlineLabel = this.messageHandler
                ? this.messageHandler.get('setup.embedDesign.colors.success.offline', {}, srv, gcfg)
                : '🔴 Offline';

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(onlineColor)
                    .setTitle(title)
                    .setDescription(`**${srv.serverName}**`)
                    .addFields(
                        { name: onlineLabel, value: onlineColor, inline: true },
                        { name: offlineLabel, value: offlineColor, inline: true }
                    )],
                ephemeral: true
            });
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // GLOBAL FOOTER MODAL
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId === 'modal_global_footer') {
            const footerText = interaction.fields.getTextInputValue('footer_text');
            gcfg.footerText = footerText;

            this.configManager.saveGuild(interaction.guildId, gcfg);
            this.monitoringManager.startMonitoring(interaction.guildId);

            const title = this.messageHandler
                ? this.messageHandler.get('setup.global.footerModal.success.title', {}, null, gcfg)
                : '✅ Footer-Text aktualisiert';
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.global.footerModal.success.description', { text: footerText }, null, gcfg)
                : `Neuer Footer: \`${footerText}\``;

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle(title)
                    .setDescription(description)
                    .setFooter({ text: footerText })],
                ephemeral: true
            });
            return;
        }

        // ═══════════════════════════════════════════════════════════
        // GLOBAL COLORS MODAL
        // ═══════════════════════════════════════════════════════════

        if (interaction.customId === 'modal_global_colors') {
            const onlineColor = interaction.fields.getTextInputValue('color_online') || '#00FF00';
            const offlineColor = interaction.fields.getTextInputValue('color_offline') || '#FF0000';

            if (!gcfg.embedColors) gcfg.embedColors = {};
            gcfg.embedColors.online = onlineColor;
            gcfg.embedColors.offline = offlineColor;

            this.configManager.saveGuild(interaction.guildId, gcfg);

            const title = this.messageHandler
                ? this.messageHandler.get('setup.global.colorsModal.success.title', {}, null, gcfg)
                : '✅ Standard-Farben aktualisiert';
            
            const description = this.messageHandler
                ? this.messageHandler.get('setup.global.colorsModal.success.description', {}, null, gcfg)
                : 'Diese Farben werden für neue Server verwendet.';
            
            const onlineLabel = this.messageHandler
                ? this.messageHandler.get('setup.global.colorsModal.success.online', {}, null, gcfg)
                : '🟢 Online';
            
            const offlineLabel = this.messageHandler
                ? this.messageHandler.get('setup.global.colorsModal.success.offline', {}, null, gcfg)
                : '🔴 Offline';

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(onlineColor)
                    .setTitle(title)
                    .setDescription(description)
                    .addFields(
                        { name: onlineLabel, value: onlineColor, inline: true },
                        { name: offlineLabel, value: offlineColor, inline: true }
                    )],
                ephemeral: true
            });
            return;
        }
    }

    async handleAddServerModal(interaction, gcfg) {
        const serverName = interaction.fields.getTextInputValue('server_name');
        const serverIP = interaction.fields.getTextInputValue('server_ip');
        const serverPort = parseInt(interaction.fields.getTextInputValue('server_port') || '25565');

        this.client.tempServerData.set(interaction.user.id, {
            serverName,
            serverIP,
            serverPort
        });

        const { PermissionManager } = require('./PermissionManager');
        
        // Channels mit Permissions-Check
        const channels = await Promise.all(
            interaction.guild.channels.cache
                .filter(c => c.type === ChannelType.GuildText)
                .map(async c => {
                    const permCheck = await PermissionManager.checkChannelPerms(c);
                    return {
                        channel: c,
                        hasPerms: permCheck.hasAll
                    };
                })
        );

        if (channels.length === 0) {
            const errorMsg = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.add.noChannels', {}, null, gcfg)
                : '❌ Keine Text-Channels gefunden!';

            return interaction.reply({
                content: errorMsg,
                ephemeral: true
            });
        }

        // Sortiere: Channels mit Perms zuerst
        channels.sort((a, b) => {
            if (a.hasPerms && !b.hasPerms) return -1;
            if (!a.hasPerms && b.hasPerms) return 1;
            return 0;
        });

        const options = channels.slice(0, 25).map(({ channel: c, hasPerms }) => ({
            label: `${hasPerms ? '✅' : '⚠️'} #${c.name}`,
            description: hasPerms 
                ? (c.topic ? c.topic.substring(0, 80) : (this.messageHandler 
                    ? this.messageHandler.get('setup.serverManagement.add.channelSelect.permissions', {}, null, gcfg)
                    : 'Alle Berechtigungen vorhanden'))
                : (this.messageHandler
                    ? this.messageHandler.get('errors.missingPermissions.title', {}, null, gcfg)
                    : 'Bot hat fehlende Berechtigungen!'),
            value: c.id,
            emoji: hasPerms ? '💬' : '⚠️'
        }));

        const select = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_channel')
                    .setPlaceholder(this.messageHandler
                        ? this.messageHandler.get('setup.serverManagement.add.channelSelect.placeholder', {}, null, gcfg)
                        : '📺 Channel für Status-Updates wählen...')
                    .addOptions(options)
            );

        const warningChannels = channels.filter(c => !c.hasPerms);
        
        const title = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.channelSelect.title', {}, null, gcfg)
            : '📺 Channel auswählen';
        
        let description = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.channelSelect.description', { serverName }, null, gcfg)
            : `Server **${serverName}** wird hinzugefügt.\n\nWähle den Channel, in dem die Status-Updates erscheinen sollen:`;
        
        if (warningChannels.length > 0) {
            const warningText = this.messageHandler
                ? this.messageHandler.get('setup.serverManagement.add.channelSelect.descriptionWithWarning', { 
                    serverName,
                    count: warningChannels.length
                  }, null, gcfg)
                : description + `\n\n⚠️ **Achtung:** ${warningChannels.length} Channel(s) haben fehlende Berechtigungen!`;
            description = warningText;
        }

        const ipLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.channelSelect.ip', {}, null, gcfg)
            : '🌐 IP';
        
        const permLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.channelSelect.permissions', {}, null, gcfg)
            : '📋 Benötigte Berechtigungen';
        
        const permList = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.add.channelSelect.permissionsList', {}, null, gcfg)
            : '👁️ Kanal ansehen\n💬 Nachrichten senden\n🔗 Embeds verwenden\n📁 Dateien anhängen\n📜 Nachrichtenverlauf';

        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(warningChannels.length > 0 ? '#FFA500' : '#00FF00')
                .setTitle(title)
                .setDescription(description)
                .addFields(
                    { name: ipLabel, value: `${serverIP}:${serverPort}`, inline: true },
                    { 
                        name: permLabel, 
                        value: permList, 
                        inline: true 
                    }
                )],
            components: [select],
            ephemeral: true
        });
    }

    async handleEditServerModal(interaction, gcfg) {
        const idx = parseInt(interaction.customId.split('_')[3]);
        const srv = gcfg.servers[idx];

        srv.serverName = interaction.fields.getTextInputValue('server_name');
        srv.serverIP = interaction.fields.getTextInputValue('server_ip');
        srv.serverPort = parseInt(interaction.fields.getTextInputValue('server_port') || '25565');

        this.configManager.saveGuild(interaction.guildId, gcfg);
        this.monitoringManager.startMonitoring(interaction.guildId);

        const title = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.edit.success.title', {}, srv, gcfg)
            : '✅ Server aktualisiert';
        
        const nameLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.edit.success.name', {}, srv, gcfg)
            : '🎮 Name';
        
        const ipLabel = this.messageHandler
            ? this.messageHandler.get('setup.serverManagement.edit.success.ip', {}, srv, gcfg)
            : '🌐 IP';

        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(title)
                .addFields(
                    { name: nameLabel, value: srv.serverName, inline: true },
                    { name: ipLabel, value: `${srv.serverIP}:${srv.serverPort}`, inline: true }
                )],
            ephemeral: true
        });
    }

    // ═══════════════════════════════════════════════════════════
    // BUTTON HANDLER - PHASE 2 MULTILANG
    // ═══════════════════════════════════════════════════════════

    async handleButton(interaction) {
        const [action, channelID] = interaction.customId.split('_');
        const gcfg = this.configManager.loadGuild(interaction.guildId);
        const srv = gcfg.servers.find(s => s.channelID === channelID);

        if (!srv) {
            const errorMsg = this.messageHandler 
                ? this.messageHandler.get('buttons.error.serverNotFound', {}, srv, gcfg)
                : '❌ Server nicht gefunden!';
            
            return interaction.reply({
                content: errorMsg,
                ephemeral: true
            });
        }

        if (action === 'ip') {
            const ipValue = `${srv.serverIP}${srv.serverPort !== 25565 ? ':' + srv.serverPort : ''}`;
            const msg = this.messageHandler
                ? this.messageHandler.get('buttons.ip.response', { ip: ipValue }, srv, gcfg)
                : `📋 **Server IP:**\n\`\`\`\n${ipValue}\n\`\`\`\n**Zum Kopieren:** Text markieren und STRG+C`;
            
            await interaction.reply({ content: msg, ephemeral: true });
            return;
        }

        if (action === 'port') {
            const msg = this.messageHandler
                ? this.messageHandler.get('buttons.port.response', { port: srv.serverPort }, srv, gcfg)
                : `🔑 **Server Port:**\n\`\`\`\n${srv.serverPort}\n\`\`\`\n**Zum Kopieren:** Text markieren und STRG+C`;
            
            await interaction.reply({ content: msg, ephemeral: true });
            return;
        }

        if (action === 'players') {
            try {
                const iconMgr = new IconManager(interaction.guildId, this.configManager);
                const data = await StatusChecker.getStatus(srv, iconMgr);
                
                if (!data.online) {
                    const offlineMsg = this.messageHandler
                        ? this.messageHandler.get('buttons.players.offline', {}, srv, gcfg)
                        : '❌ **Server ist offline oder nicht erreichbar!**';
                    
                    await interaction.reply({
                        content: offlineMsg,
                        ephemeral: true
                    });
                    return;
                }
                
                if (data.players.list.length > 0) {
                    const playersList = data.players.list.join('\n');
                    const msg = this.messageHandler
                        ? this.messageHandler.get('buttons.players.response', {
                            count: data.players.online,
                            max: data.players.max,
                            players: playersList
                        }, srv, gcfg)
                        : `👥 **Online Spieler (${data.players.online}/${data.players.max}):**\n\`\`\`\n${playersList}\n\`\`\``;
                    
                    await interaction.reply({ content: msg, ephemeral: true });
                } else {
                    const noPlayersMsg = this.messageHandler
                        ? this.messageHandler.get('buttons.players.noPlayers', { max: data.players.max }, srv, gcfg)
                        : `👥 **Online Spieler (0/${data.players.max}):**\n➖ Niemand online`;
                    
                    await interaction.reply({
                        content: noPlayersMsg,
                        ephemeral: true
                    });
                }
            } catch (e) {
                this.logger.error(`Button Error (players): ${e.message}`);
                
                const errorMsg = this.messageHandler
                    ? this.messageHandler.get('buttons.error.fetchFailed', {}, srv, gcfg)
                    : '❌ Fehler beim Abrufen der Spielerliste!';
                
                await interaction.reply({
                    content: errorMsg,
                    ephemeral: true
                });
            }
            return;
        }
    }

    // ═══════════════════════════════════════════════════════════
    // TEXT-SYSTEM HANDLER METHODS
    // ═══════════════════════════════════════════════════════════

    async handleTextsMenu(interaction, gcfg) {
        await interaction.update({
            embeds: [this.setupMenus.createTextsMenu(gcfg)],
            components: [this.setupMenus.createTextsMenuSelect(gcfg)]
        });
    }

    async handleTextsAction(interaction, gcfg) {
        const action = interaction.values[0];

        if (action === 'back') {
            await interaction.update({
                embeds: [this.setupMenus.createMainMenu(gcfg)],
                components: [this.setupMenus.createMainMenuSelect(gcfg)]
            });
            return;
        }

        if (action === 'global_language') {
            await this.handleGlobalLanguageMenu(interaction, gcfg);
            return;
        }

        if (action === 'server_language') {
            await this.handleServerLanguageMenu(interaction, gcfg);
            return;
        }
    }

    async handleGlobalLanguageMenu(interaction, gcfg) {
        await interaction.update({
            embeds: [this.setupMenus.createGlobalLanguageMenu(gcfg)],
            components: [this.setupMenus.createGlobalLanguageSelect(gcfg)]
        });
    }

    async handleGlobalLanguageSelect(interaction, gcfg) {
        const languageCode = interaction.values[0];

        if (languageCode === 'back') {
            await interaction.update({
                embeds: [this.setupMenus.createTextsMenu(gcfg)],
                components: [this.setupMenus.createTextsMenuSelect(gcfg)]
            });
            return;
        }

        // Sprache ändern
        if (!gcfg.globalTextSettings) {
            gcfg.globalTextSettings = {};
        }
        gcfg.globalTextSettings.defaultLanguage = languageCode;
        
        this.configManager.saveGuild(interaction.guildId, gcfg);
        
        // MessageHandler neu laden
        if (this.messageHandler) {
            this.messageHandler.reloadAll();
        }
        
        // Monitoring neu starten damit neue Texte verwendet werden
        this.monitoringManager.startMonitoring(interaction.guildId);

        const langName = this.messageHandler ? this.messageHandler.getLanguageName(languageCode, gcfg) : languageCode;

        const title = this.messageHandler
            ? this.messageHandler.get('setup.texts.globalLanguage.success.title', {}, null, gcfg)
            : '✅ Globale Sprache geändert';
        
        const description = this.messageHandler
            ? this.messageHandler.get('setup.texts.globalLanguage.success.description', { language: langName }, null, gcfg)
            : `Neue Sprache: **${langName}**\n\n💡 Server mit eigener Sprache bleiben unverändert.`;

        await interaction.update({
            embeds: [new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(title)
                .setDescription(description)],
            components: []
        });

        this.logger.success(`Global language changed to ${languageCode} by ${interaction.user.tag}`);
    }

    async handleServerLanguageMenu(interaction, gcfg) {
        const { embed, select } = this.setupMenus.createServerLanguageServerSelect(gcfg.servers, gcfg);
        
        await interaction.update({
            embeds: [embed],
            components: [select]
        });
    }

    async handleServerLanguageSelect(interaction, gcfg) {
        const value = interaction.values[0];

        if (value === 'back') {
            await interaction.update({
                embeds: [this.setupMenus.createTextsMenu(gcfg)],
                components: [this.setupMenus.createTextsMenuSelect(gcfg)]
            });
            return;
        }

        const idx = parseInt(value);
        const srv = gcfg.servers[idx];
        const currentLang = srv.textSettings?.language || 'global';

        await interaction.update({
            embeds: [this.setupMenus.createServerLanguageMenu(srv.serverName, currentLang, gcfg)],
            components: [this.setupMenus.createServerLanguageSelect(idx, gcfg)]
        });
    }

    async handleServerLanguageChange(interaction, gcfg) {
        const idx = parseInt(interaction.customId.split('_').pop());
        const languageCode = interaction.values[0];

        if (languageCode === 'back') {
            const { embed, select } = this.setupMenus.createServerLanguageServerSelect(gcfg.servers, gcfg);
            await interaction.update({
                embeds: [embed],
                components: [select]
            });
            return;
        }

        const srv = gcfg.servers[idx];

        // Sprache ändern
        if (!srv.textSettings) {
            srv.textSettings = {};
        }
        srv.textSettings.language = languageCode;

        this.configManager.saveGuild(interaction.guildId, gcfg);
        
        // MessageHandler neu laden
        if (this.messageHandler) {
            this.messageHandler.reloadAll();
        }
        
        // Monitoring neu starten
        this.monitoringManager.startMonitoring(interaction.guildId);

        const langName = this.messageHandler ? this.messageHandler.getLanguageName(languageCode, gcfg) : languageCode;

        const title = this.messageHandler
            ? this.messageHandler.get('setup.texts.serverLanguage.success.title', {}, srv, gcfg)
            : '✅ Server-Sprache geändert';
        
        const description = this.messageHandler
            ? this.messageHandler.get('setup.texts.serverLanguage.success.description', { 
                serverName: srv.serverName,
                language: langName
              }, srv, gcfg)
            : `**${srv.serverName}**\nNeue Sprache: **${langName}**`;

        await interaction.update({
            embeds: [new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(title)
                .setDescription(description)],
            components: []
        });

        this.logger.success(`Server language for "${srv.serverName}" changed to ${languageCode} by ${interaction.user.tag}`);
    }
}

module.exports = { InteractionHandler };