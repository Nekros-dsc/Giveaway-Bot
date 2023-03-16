module.exports = {
    name: "pause",
    description: '⏸ Mettre un giveaway en pause',

    options: [
        {
            name: 'giveaway',
            description: 'Le giveaway a mettre en paise (message ID)',
            type: 'STRING',
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Tu dois avoir la permission de gérer les messages.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // try to find the giveaway with prize alternatively with ID
        const giveaway =
            // Search with giveaway prize
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Search with giveaway ID
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // If no giveaway was found
        if (!giveaway) {
            return interaction.reply({
                content: 'Impossible de trouvé un giveaway avec `' + query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.pauseOptions.isPaused) {
            return interaction.reply({
                content: `**<[Ce giveaway]>(https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  est déjà en pause.`,
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveawaysManager.pause(giveaway.messageId)
            // Success message
            .then(() => {
                // Success message
                interaction.reply(`**<[Ce giveaway]>(https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** est maintenant en pause!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};