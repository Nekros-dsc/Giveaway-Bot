module.exports = {
    name: 'edit',
    description: '🎉 Modifier un giveaway',

    options: [
        {
            name: 'giveaway',
            description: 'Le giveaway a fini (message ID)',
            type: 'STRING',
            required: true
        },
        {
            name: 'durée',
            description: 'Paramétrer le temps!',
            type: 'STRING',
            required: true
        },
        {
            name: 'gagnants',
            description: 'Combien de gagnants veux-tu qu\'il y a ?',
            type: 'INTEGER',
            required: true
        },
        {
            name: 'prix',
            description: 'Le prix du giveaway',
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
        const gid = interaction.options.getString('giveaway');
        const time = interaction.options.getString('durée');
        const winnersCount = interaction.options.getInteger('gagnants');
        const prize = interaction.options.getString('prix');
        
        await interaction.deferReply({
         ephemeral: true
        })
        // Edit the giveaway
        try {
        await client.giveawaysManager.edit(gid, {
            newWinnersCount: winnersCount,
            newPrize: prize,
            addTime: time
        })
        } catch(e) {
return interaction.editReply({
            content:
                `Aucun giveaway trouvé avec l'id: \`${gid}\``,
            ephemeral: true
        });
        }
        interaction.editReply({
            content:
                `Le giveaway a été modifier!`,
            ephemeral: true
        });
    }

};
