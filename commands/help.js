const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const config = require('../config.json');

module.exports.run = async (client, message, args) => {

const embed = new MessageEmbed()
.setTitle(`Commands of ${client.user.username}`)
.setColor('#2F3136')
.setDescription('**Sélectionne la catégorie de commande que tu veux**')
.addField(`Liens:`,`- [Discord Server](${config.support})`,true)
.setTimestamp()
.setFooter({
  text: `${message.author.username} | ${client.user.tag}`, 
  iconURL: message.author.displayAvatarURL()
});

  const giveaway = new MessageEmbed()
  .setTitle("Categories » Giveaway")
  .setColor('#2F3136')
  .setDescription("```yaml\nVoici les commandes Giveaways:```")
  .addFields(
    { name: 'Create / Start'  , value: `Commencer un giveaway!\n > **Ecrit: \`${config.prefix}start\`**`, inline: true },
    { name: 'Edit' , value: `Modifie un giveaway en cours!\n > **Ecrit: \`${config.prefix}edit\`**`, inline: true },
    { name: 'End' , value: `Termine un giveaway!\n > **Ecrit: \`${config.prefix}end\`**`, inline: true },
    { name: 'List' , value: `Te liste tous les giveaways en cours sur le serveur!\n > **Ecrit: \`${config.prefix}list\`**`, inline: true },
    { name: 'Pause' , value: `Met en pause un giveaway!\n > **Ecrit: \`${config.prefix}pause\`**`, inline: true },
    { name: 'Reroll' , value: `Reroll un giveaway terminé!\n > **Ecrit: \`${config.prefix}reroll\`**`, inline: true },
    { name: 'Resume' , value: `Reprend un giveaway mit en pause!\n > **Ecrit: \`${config.prefix}resume\`**`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `${message.author.username} | ${client.user.tag}`, 
    iconURL: message.author.displayAvatarURL()
  });

  const general = new MessageEmbed()
  .setTitle("Categories » General")
  .setColor('#2F3136')
  .setDescription("```yaml\nVoici les commandees générales:```")
  .addFields(
    { name: 'Help'  , value: `Montre toutes les commandes disponibles sur ce bot!\n > **Ecrit: \`${config.prefix}help\`**`, inline: true },
    { name: 'Invite' , value: `Invite le bot!\n > **Ecrit: \`${config.prefix}invite\`**`, inline: true },
    { name: 'Ping' , value: `Regarder la latance du bot!\n > **Ecrit: \`${config.prefix}ping\`**`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `${message.author.username} | ${client.user.tag}`, 
    iconURL: message.author.displayAvatarURL()
  });
  
  const components = (state) => [
    new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("help-menu")
        .setPlaceholder("Séléctionne une catégorie")
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
                description: `Voir toutes les commandes général!`,
                emoji: `⚙`
            }
        ])
    ),
];

const initialMessage = await message.reply({ embeds: [embed], components: components(false) });

const filter = (interaction) => interaction.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector(
            {
                filter,
                componentType: "SELECT_MENU",
                idle: 300000,
                dispose: true,
            });

        collector.on('collect', (interaction) => {
            if (interaction.values[0] === "giveaway") {
                interaction.update({ embeds: [giveaway], components: components(false) }).catch((e) => {});
            } else if (interaction.values[0] === "general") {
                interaction.update({ embeds: [general], components: components(false) }).catch((e) => {});
            }
        });
        collector.on("end", (collected, reason) => {
            if (reason == "time") {
                initialMessage.edit({
                   content: "La commande est terminée, récrit la commande!",
                   components: [],
                });
             }
        });
}
