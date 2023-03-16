const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js")
const config = require('../config.json');


module.exports = {
  name: 'help',
  description: '📜 Voir toutes les commandes du bot!',
  run: async (client, interaction) => {
    const embed = new MessageEmbed()
      .setTitle(`Commandes de ${client.user.username}`)
      .setColor('#2F3136')
      .setDescription('**Choisis une catégorie**')
      .addField(`Liens:`, `- [Discord Server](${config.support})`, true)
      .setTimestamp()
      .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })

    const giveaway = new MessageEmbed()
      .setTitle("Categories » Giveaway")
      .setColor('#2F3136')
      .setDescription("```yaml\nVoici les commandes giveaways:```")
      .addFields(
        { name: 'Create / Start'  , value: `Commencer un giveaway!\n > **Ecrit: \`/start\`**`, inline: true },
        { name: 'Edit' , value: `Modifie un giveaway en cours!\n > **Ecrit: \`/edit\`**`, inline: true },
        { name: 'End' , value: `Termine un giveaway!\n > **Ecrit: \`/end\`**`, inline: true },
        { name: 'List' , value: `Te liste tous les giveaways en cours sur le serveur!\n > **Ecrit: \`/list\`**`, inline: true },
        { name: 'Pause' , value: `Met en pause un giveaway!\n > **Ecrit: \`/pause\`**`, inline: true },
        { name: 'Reroll' , value: `Reroll un giveaway terminé!\n > **Ecrit: \`/reroll\`**`, inline: true },
        { name: 'Resume' , value: `Reprend un giveaway mit en pause!\n > **Ecrit: \`/resume\`**`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })

    const general = new MessageEmbed()
      .setTitle("Categories » General")
      .setColor('#2F3136')
      .setDescription("```yaml\nVoici les commandes générales:```")
      .addFields(
        { name: 'Help'  , value: `Montre toutes les commandes disponibles sur ce bot!\n > **Ecrit: \`/help\`**`, inline: true },
        { name: 'Invite' , value: `Invite le bot!\n > **Ecrit: \`/invite\`**`, inline: true },
        { name: 'Ping' , value: `Regarder la latance du bot!\n > **Ecrit: \`/ping\`**`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })

    const components = (state) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder("Choisis une catégorie")
          .setDisabled(state)
          .addOptions([{
            label: `Giveaways`,
            value: `giveaway`,
            description: `Voir toutes les commandes giveaways!`,
            emoji: `🎉`
          },
          {
            label: `General`,
            value: `general`,
            description: `Voir les commandes général!`,
            emoji: `⚙`
          }
          ])
      ),
    ];

    const initialMessage = await interaction.reply({ embeds: [embed], components: components(false) });

    const filter = (interaction) => interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector(
      {
        filter,
        componentType: "SELECT_MENU",
        idle: 300000,
        dispose: true,
      });

    collector.on('collect', (interaction) => {
      if (interaction.values[0] === "giveaway") {
        interaction.update({ embeds: [giveaway], components: components(false) }).catch((e) => { });
      } else if (interaction.values[0] === "general") {
        interaction.update({ embeds: [general], components: components(false) }).catch((e) => { });
      }
    });
    collector.on('end', (collected, reason) => {
      if (reason == "time") {
        initialMessage.edit({
          content: "Récrit la commande pour revoir le help!",
          components: [],
        });
      }
    })
  }
}
