const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config.json')
module.exports = {
    name: 'invite',
    description: '➕ Invite le bot sur vos serveurs!',
    run: async (client, interaction) => {
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setLabel(`Invite ${client.user.username}`)
        .setStyle('LINK')
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`),
        new MessageButton()
        .setLabel('Serveur Support')
        .setStyle('LINK')
        .setURL(config.support),
    )
    let invite = new MessageEmbed()
      .setAuthor({ 
          name: `Invite ${client.user.username}`, 
          iconURL: client.user.displayAvatarURL() 
      })    
    .setTitle("Invite & Support!")
    .setDescription(`Invite ${client.user} sur votre serveur pour gérer vos giveaways!`)
    .setColor('#2F3136')
    .setTimestamp()
    .setFooter({
        text: `${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
    })
    
    interaction.reply({ embeds: [invite], components: [row]});
}
}
