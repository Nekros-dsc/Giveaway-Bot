const Discord = require("discord.js")

module.exports = {
    name: 'list',
    description: '🎉 Liste de tous les giveaways actifs sur ce serveur.',
    run: async (client, interaction) => {
        const select = new Discord.MessageSelectMenu().setCustomId("select").setPlaceholder("Choisis le type de giveaway à voir!").addOptions([
            {
              label: '🎉 Giveaways Normaux',
              description: 'Regarder les giveaways normaux sur ce serveur!',
              value: 'normal',
            },
            {
              label: "⚙ GIveaways avec Conditions!",
              description: "Voir les giveaways avec des conditions sur ce serveur!",
              value: "guildReq"
            },
          ])
          const row = new Discord.MessageActionRow().addComponents([select])
          let giveaways = client.giveawaysManager.giveaways.filter(g => g.guildId === `${interaction.guild.id}` && !g.ended);
          if (!giveaways.some(e => e.messageId)) {
            return interaction.reply('💥 Aucun giveaway de trouvé')
          }
  const msg = await interaction.channel.send({ embeds: [new Discord.MessageEmbed().setDescription("Choisis une option sur le menu pour les voir!").setColor("#2F3136").setTimestamp()], components: [row] })
          let embed = new Discord.MessageEmbed()
            .setTitle("Giveaways disponnible en ce moment")
            .setColor("#2F3136")
            .setFooter({
               text: `${interaction.user.username}`,
               iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
          let embedGuild = new Discord.MessageEmbed()
            .setTitle("Giveaways avec conditions disponible en ce moment")
            .setColor("#2F3136")
            .setFooter({
               text: `${interaction.user.username}`,
               iconURL: interaction.user.displayAvatarURL()
            })
          .setTimestamp()
          const filter = x => x.customId == "select" && x.user.id == interaction.member.id
          const collector = await interaction.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })
          await interaction.deferReply()
          collector.on("collect", async (i) => {
            const val = i.values[0]
            if (val == "normal") {
              await Promise.all(giveaways.map(async (x) => {
                embed.addField(`Giveaway Normal:`, `**Prix:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})\nA commencer:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Se fini:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`)
              }));
              msg.delete()
              interaction.editReply({ embeds: [embed], components: [] })
            }
            if (val == "guildReq") {
               if (val == "guildReq") {
              if (!giveaways.some(e => e.extraData)){  interaction.editReply({ content: '💥 Aucun giveaway de trouvé', embeds: [], components: [] })
               msg.delete()
               return
            }
               }
              await Promise.all(giveaways.map(async (x) => {
                if (x.extraData) {
                  const guild = client.guilds.cache.get(x.extraData.server)
                  const channel = guild.channels.cache
                    .filter((channel) => channel.type === 'text')
                    .first()
                  const inv = await channel.createInvite()
                  embedGuild.addField(`Giveaway avec conditions:`, `**Prix:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})**\n**Condition: [Ce serveur](${inv})**\n**A commencer:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Fe fini:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`)
                }
              }));
              msg.delete()
              interaction.editReply({ embeds: [embedGuild], components: [] })
              
            }
          })
          collector.on("end",(collected, reason) => {
            if(reason == "time"){
         interaction.editReply({ content: "👀 Récrit la commande!", components: [] })
            }
        })  
    },
};
