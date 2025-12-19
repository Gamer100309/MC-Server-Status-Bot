// ═══════════════════════════════════════════════════════════
//  COMMAND HANDLER MODULE - MULTILANG COMPLETE
//  Enhanced with Multi-Language Support
//  FIXED: SetupMenus als instance statt static
// ═══════════════════════════════════════════════════════════

const { SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
const { PermissionManager } = require('./PermissionManager');
const { SetupMenus } = require('./SetupMenus');

class CommandHandler {
    constructor(client, configManager, logger, monitoringManager, messageHandler) {
        this.client = client;
        this.configManager = configManager;
        this.logger = logger;
        this.monitoringManager = monitoringManager;
        this.messageHandler = messageHandler;
        
        // SetupMenus mit MessageHandler initialisieren
        this.setupMenus = new SetupMenus(messageHandler);
        
        this.commands = [
            new SlashCommandBuilder()
                .setName('setup')
                .setDescription('🔧 Interactive setup menu for the bot'),
            
            new SlashCommandBuilder()
                .setName('reload')
                .setDescription('🔄 Reload config and restart monitoring'),
            
            new SlashCommandBuilder()
                .setName('refresh')
                .setDescription('🔄 Delete and recreate status messages'),
            
            new SlashCommandBuilder()
                .setName('botinfo')
                .setDescription('📊 Show bot information'),
            
            new SlashCommandBuilder()
                .setName('checkperms')
                .setDescription('🔐 Check bot permissions in a channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel to check (empty = current channel)')
                        .setRequired(false)
                )
        ];
    }

    async registerCommands() {
        try {
            this.logger.info('Registriere Slash Commands...');
            
            const rest = new REST({ version: '10' }).setToken(this.configManager.globalConfig.token);
            
            const commandData = this.commands.map(cmd => cmd.toJSON());
            
            await rest.put(
                Routes.applicationCommands(this.client.user.id), 
                { body: commandData }
            );
            
            this.logger.success(`✅ ${commandData.length} Slash Commands registriert`);
            this.logger.info(`Commands: ${this.commands.map(c => '/' + c.name).join(', ')}`);
            
            // Warte kurz damit Discord die Commands cached
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            this.logger.error(`❌ Command Registration Error: ${e.message}`);
            this.logger.error(e.stack);
        }
    }

    async handle(interaction) {
        try {
            this.logger.info(`Command: /${interaction.commandName} von ${interaction.user.tag}`);
            
            const gcfg = this.configManager.loadGuild(interaction.guildId, interaction.guild.name);
            
            if (!PermissionManager.hasSetupPerm(interaction.member, gcfg) && interaction.commandName !== 'botinfo') {
                // Permission Error - mehrsprachig
                const errorMsg = this.messageHandler
                    ? this.messageHandler.get('commands.errors.noPermission', {}, null, gcfg)
                    : '❌ Keine Berechtigung! Du benötigst Admin-Rechte oder eine berechtigte Rolle.';
                
                return interaction.reply({
                    content: errorMsg,
                    ephemeral: true
                });
            }

            switch (interaction.commandName) {
                case 'setup':
                    await interaction.reply({
                        embeds: [this.setupMenus.createMainMenu(gcfg)],
                        components: [this.setupMenus.createMainMenuSelect(gcfg)],
                        ephemeral: true
                    });
                    this.logger.success(`Setup-Menü gesendet an ${interaction.user.tag}`);
                    break;

                case 'reload':
                    this.monitoringManager.startMonitoring(interaction.guildId);
                    
                    // Reload Success - mehrsprachig
                    const reloadMsg = this.messageHandler
                        ? this.messageHandler.get('commands.reload.success', {}, null, gcfg)
                        : '✅ Config neu geladen und Monitoring neu gestartet!';
                    
                    await interaction.reply({
                        content: reloadMsg,
                        ephemeral: true
                    });
                    this.logger.success(`Reload ausgeführt von ${interaction.user.tag}`);
                    break;

                case 'refresh':
                    await this.handleRefresh(interaction, gcfg);
                    break;

                case 'botinfo':
                    // Botinfo Titel & Felder - mehrsprachig
                    const infoTitle = this.messageHandler
                        ? this.messageHandler.get('commands.botinfo.title', {}, null, gcfg)
                        : '🤖 Bot Informationen';
                    
                    const serversLabel = this.messageHandler
                        ? this.messageHandler.get('commands.botinfo.fields.servers', {}, null, gcfg)
                        : '📊 Server';
                    
                    const guildsLabel = this.messageHandler
                        ? this.messageHandler.get('commands.botinfo.fields.guilds', {}, null, gcfg)
                        : '🌐 Guilds';
                    
                    const pingLabel = this.messageHandler
                        ? this.messageHandler.get('commands.botinfo.fields.ping', {}, null, gcfg)
                        : '📡 Ping';
                    
                    const versionLabel = this.messageHandler
                        ? this.messageHandler.get('commands.botinfo.fields.version', {}, null, gcfg)
                        : '⚡ Version';
                    
                    const footerText = this.messageHandler
                        ? this.messageHandler.get('commands.botinfo.footer', {}, null, gcfg)
                        : 'MC Status Bot - Modular Structure';
                    
                    const info = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle(infoTitle)
                        .addFields(
                            { name: serversLabel, value: `${gcfg.servers.length}`, inline: true },
                            { name: guildsLabel, value: `${this.client.guilds.cache.size}`, inline: true },
                            { name: pingLabel, value: `${this.client.ws.ping}ms`, inline: true },
                            { name: versionLabel, value: 'v4.0 Multi-Guild', inline: true }
                        )
                        .setFooter({ text: footerText });
                    
                    await interaction.reply({ embeds: [info], ephemeral: true });
                    this.logger.success(`Botinfo gesendet an ${interaction.user.tag}`);
                    break;

                case 'checkperms':
                    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
                    
                    if (targetChannel.type !== 0) { // 0 = GuildText
                        // Not a text channel - mehrsprachig
                        const errorMsg = this.messageHandler
                            ? this.messageHandler.get('commands.checkperms.errors.notTextChannel', {}, null, gcfg)
                            : '❌ Das ist kein Text-Channel!';
                        
                        return interaction.reply({
                            content: errorMsg,
                            ephemeral: true
                        });
                    }

                    const permCheck = await PermissionManager.checkChannelPerms(targetChannel);
                    // WICHTIG: messageHandler und gcfg übergeben!
                    const permList = PermissionManager.getPermissionsList(this.messageHandler, gcfg);
                    
                    const permStatus = permList.map(({ flag, name }) => {
                        const bot = targetChannel.guild.members.me;
                        const hasIt = targetChannel.permissionsFor(bot).has(flag);
                        return `${hasIt ? '✅' : '❌'} ${name}`;
                    }).join('\n');

                    // CheckPerms Titel & Labels - mehrsprachig
                    const permTitle = permCheck.hasAll
                        ? (this.messageHandler 
                            ? this.messageHandler.get('commands.checkperms.title.allPermissions', {}, null, gcfg)
                            : '✅ Alle Berechtigungen vorhanden')
                        : (this.messageHandler
                            ? this.messageHandler.get('commands.checkperms.title.missingPermissions', {}, null, gcfg)
                            : '⚠️ Fehlende Berechtigungen');
                    
                    const permLabel = this.messageHandler
                        ? this.messageHandler.get('commands.checkperms.fields.permissions', {}, null, gcfg)
                        : '📋 Berechtigungen';
                    
                    const permEmbed = new EmbedBuilder()
                        .setColor(permCheck.hasAll ? '#00FF00' : '#FF0000')
                        .setTitle(permTitle)
                        .setDescription(`**Channel:** <#${targetChannel.id}>`)
                        .addFields({
                            name: permLabel,
                            value: permStatus,
                            inline: false
                        });

                    if (!permCheck.hasAll) {
                        const solutionLabel = this.messageHandler
                            ? this.messageHandler.get('commands.checkperms.fields.solution.label', {}, null, gcfg)
                            : '💡 Lösung';
                        
                        const solutionText = this.messageHandler
                            ? this.messageHandler.get('commands.checkperms.fields.solution.text', {}, null, gcfg)
                            : 'Gehe zu **Servereinstellungen → Rollen** und gib dem Bot die fehlenden Berechtigungen für diesen Channel.';
                        
                        permEmbed.addFields({
                            name: solutionLabel,
                            value: solutionText,
                            inline: false
                        });
                    }

                    await interaction.reply({ embeds: [permEmbed], ephemeral: true });
                    this.logger.success(`Permissions Check in #${targetChannel.name} von ${interaction.user.tag}`);
                    break;
                    
                default:
                    // Unknown command - mehrsprachig
                    const unknownMsg = this.messageHandler
                        ? this.messageHandler.get('commands.errors.unknownCommand', {}, null, gcfg)
                        : '❌ Unbekannter Command!';
                    
                    await interaction.reply({
                        content: unknownMsg,
                        ephemeral: true
                    });
            }
        } catch (error) {
            this.logger.error(`Command Handler Error: ${error.message}`);
            this.logger.error(error.stack);
            
            // gcfg Variable deklarieren falls noch nicht vorhanden
            let gcfg;
            try {
                gcfg = this.configManager.loadGuild(interaction.guildId, interaction.guild?.name || 'Unknown');
            } catch (e) {
                gcfg = null;
            }
            
            if (!interaction.replied && !interaction.deferred) {
                // General error - mehrsprachig
                const errorMsg = this.messageHandler
                    ? this.messageHandler.get('commands.errors.generalError', {}, null, gcfg)
                    : '❌ Ein Fehler ist beim Ausführen des Commands aufgetreten!';
                
                await interaction.reply({
                    content: errorMsg,
                    ephemeral: true
                }).catch(() => {});
            }
        }
    }

    async handleRefresh(interaction, gcfg) {
        const { StateManager } = require('./StateManager');
        
        await interaction.deferReply({ ephemeral: true });

        try {
            let deleted = 0;
            let errors = 0;

            for (const srv of gcfg.servers) {
                try {
                    const channel = interaction.guild.channels.cache.get(srv.channelID);
                    if (!channel) {
                        this.logger.warning(`Channel ${srv.channelID} nicht gefunden für ${srv.serverName}`);
                        errors++;
                        continue;
                    }

                    const stateMgr = new StateManager(interaction.guildId);
                    const state = stateMgr.get(srv.channelID);

                    if (state?.messageID) {
                        try {
                            const msg = await channel.messages.fetch(state.messageID);
                            await msg.delete();
                            deleted++;
                            this.logger.info(`Message gelöscht für ${srv.serverName}`);
                        } catch (e) {
                            this.logger.verbose(`Message ${state.messageID} bereits gelöscht oder nicht gefunden`);
                        }

                        // State löschen damit neue Message erstellt wird
                        stateMgr.state.servers[srv.channelID] = null;
                        stateMgr.save();
                    }
                } catch (e) {
                    this.logger.error(`Fehler beim Refresh von ${srv.serverName}: ${e.message}`);
                    errors++;
                }
            }

            // Monitoring neu starten um neue Messages zu erstellen
            this.monitoringManager.startMonitoring(interaction.guildId);

            // Refresh Success - mehrsprachig
            const successMsg = this.messageHandler
                ? this.messageHandler.get('commands.refresh.success', { 
                    deleted, 
                    errors: errors > 0 ? `⚠️ ${errors} Fehler` : '' 
                  }, null, gcfg)
                : `✅ Refresh abgeschlossen!\n\n📋 ${deleted} Message(s) gelöscht\n${errors > 0 ? `⚠️ ${errors} Fehler` : ''}\n\n💡 Neue Messages werden in wenigen Sekunden erstellt.`;

            await interaction.editReply({
                content: successMsg
            });

            this.logger.success(`Refresh ausgeführt von ${interaction.user.tag}: ${deleted} gelöscht, ${errors} Fehler`);
        } catch (e) {
            this.logger.error(`Refresh Error: ${e.message}`);
            
            // Refresh Error - mehrsprachig
            const errorMsg = this.messageHandler
                ? this.messageHandler.get('commands.refresh.error', {}, null, gcfg)
                : '❌ Fehler beim Refresh! Siehe Logs für Details.';
            
            await interaction.editReply({
                content: errorMsg
            });
        }
    }
}

module.exports = { CommandHandler };