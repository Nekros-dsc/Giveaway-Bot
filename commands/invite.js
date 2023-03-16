const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
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
    .setDescription(`Invite ${client.user} sur votre serveur pour lancé des giveaways facilement!`)
    .setColor('#2F3136')
    .setTimestamp()
    .setFooter({
        text: `${message.author.tag} | ${client.user.tag}`, 
        iconURL: message.author.displayAvatarURL()
    })
    message.reply({ embeds: [invite], components: [row]});
}
