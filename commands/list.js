const Discord = require('discord.js');
const config = require('../config.json');
module.exports.run = async (client, message, args) => {
  const select = new Discord.MessageSelectMenu().setCustomId("select").setPlaceholder("Choisis le type de giveaway à voir!").addOptions([
    {
      label: '🎉 Giveaways Normales',
      description: 'Regarder les giveaways normal en cours sur votre serveur!',
      value: 'normal',
    },
    {
      label: "⚙ Giveaways avec Condition!",
      description: "Voir les giveaways avec des conditions!",
      value: "guildReq"
    },
  ])
  const row = new Discord.MessageActionRow().addComponents([select])
  let giveaways = client.giveawaysManager.giveaways.filter(g => g.guildId === `${message.guild.id}` && !g.ended);
  if (!giveaways.some(e => e.messageId)) {
    return message.reply('💥 Aucun giveaway en cours')
  }
  const msg = await message.reply({ embeds: [new Discord.MessageEmbed().setDescription("Choisis une option dans le menu!").setColor("#2F3136").setTimestamp()], components: [row] })
  let embed = new Discord.MessageEmbed()
    .setTitle("Giveaways actif")
    .setColor("#2F3136")
    .setFooter({
      text: `${client.user.username}`, 
      iconURL: client.user.displayAvatarURL()
    })
    .setTimestamp()
  let embedGuild = new Discord.MessageEmbed()
    .setTitle("Giveaway avec conditions")
    .setColor("#2F3136")
    .setFooter({
      text: `${client.user.username}`, 
      iconURL: client.user.displayAvatarURL()
    })    
    .setTimestamp()

  const filter = x => x.customId == "select" && x.user.id == message.author.id
  const collector = await message.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })
  collector.on("collect", async (i) => {
    i.update({ components: [] });
    const val = i.values[0]
    if (val == "normal") {
      await Promise.all(giveaways.map(async (x) => {
        embed.addField(`Giveaway Normales:`, `**Prix:** **[${x.prize}](https://discord.com/channels/${x.guildID}/${x.channelID}/${x.messageID})\nCommencer:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Fini:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`)
      }));
     msg.edit({ embeds: [embed] })
    }
    if (val == "guildReq") {
      if (!giveaways.some(e => e.extraData)) return msg.edit({ content: '💥 No Giveaways To Be Displayed', embeds: [] }).catch(e => console.error(e))
      await Promise.all(giveaways.map(async (x) => {
        if (x.extraData) {
          const guild = client.guilds.cache.get(x.extraData.server)
          const channel = guild.channels.cache
            .filter((channel) => channel.type === 'text')
            .first()
          const inv = await channel.createInvite()
          embedGuild.addField(`Giveaway avec condition:`, `**Prix:** **[${x.prize}](https://discord.com/channels/${x.guildID}/${x.channelID}/${x.messageID})**\n**Conditions: [Ce serveur](${inv})**\n**Commencer le:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Fini:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`)
        }
      }));
      msg.edit({ embeds: [embedGuild] })
    }
  })
  collector.on("end",(collected, reason) => {
   if(reason == "time")
   msg.edit({ content: "👀 Récrivez la commande!", components: [] })
  })
}

