module.exports.run = async (client, message) => {
  const Discord = require("discord.js");
  const ms = require("ms");
  let time = "";
  let winnersCount;
  let prize = "";
  let giveawayx = "";
  let embed = new Discord.MessageEmbed()
    .setTitle("Modifie un giveaway!")
    .setColor('#2F3136')
    .setFooter({ 
      text: `${client.user.username}`, 
      iconURL: client.user.displayAvatarURL() 
    })
    .setTimestamp();
  const msg = await message.reply({
    embeds:
      [embed.setDescription(
        "Quel giveaway veux-tu modifier ?\nDonne moi l'ID du message avant **30 secondes**!**"
      )]
  }
  );
  let xembed = new Discord.MessageEmbed()
    .setTitle("Oops! J'ai l'impression que le temps est écouler! 🕖")
    .setColor("#FF0000")
    .setDescription('💥 J\'ai l\'impression que tu as pris trop de temps pour répondre!')
    .setFooter({ 
      text: `${client.user.username}`, 
      iconURL: client.user.displayAvatarURL() 
    })
    .setTimestamp();

  const filter = m => m.author.id === message.author.id && !m.author.bot;
  const collector = await message.channel.createMessageCollector(filter, {
    max: 3,
    time: 30000
  });

  collector.on("collect", async collect => {

    const response = collect.content;
    let gid = BigInt(response).toString()
    await collect.delete()
    if (!gid) {
      return msg.edit({
        embeds: [
          embed.setDescription(
            "Uh-Oh! Donne moi un ID de message valide!\n**Ressaie?**\n Exemple: ``677813783523098627``"
          )]
      }
      );
    } else {
      collector.stop(
        msg.edit({
          embeds: [
            embed.setDescription(
              `Très bien, donne moi le nouveau temps du giveaway\nTu dois répondre avant **30 secondes!**`
            )]
        }
        )
      );
    }
    const collector2 = await message.channel.createMessageCollector(filter, {
      max: 3,
      time: 30000
    });
    collector2.on("collect", async collect2 => {

      let mss = ms(collect2.content);
      await collect2.delete()
      if (!mss) {
        return msg.edit({
          embeds: [
            embed.setDescription(
              "Aw Snap! Tu ne m'as pas donner un temps valide\n**Ressaie?**\n Exemple: ``-10 minutes``,``-10m``,``-10``\n **Note: - (moins) Indique que tu veux retirer du temps!**"
            )]
        }
        );
      } else {
        time = mss;
        collector2.stop(
          msg.edit({
            embeds: [
              embed.setDescription(
                `Combien de gagnant veux-tu mettre ?.**`
              )]
          }
          )
        );
      }
      const collector3 = await message.channel.createMessageCollector(filter, {
        max: 3,
        time: 30000,
        errors: ['time']
      });
      collector3.on("collect", async collect3 => {

        const response3 = collect3.content.toLowerCase();
        await collect3.delete()
        if (parseInt(response3) < 1 || isNaN(parseInt(response3))) {
          return msg.edit({
            embeds: [
              embed.setDescription(
                "Boi! Le gagnant doit être un chiffre!\n**Ressaie?**\n Exemple ``1``,``10``, etc..."
              )]
          }
          );
        } else {
          winnersCount = parseInt(response3);
          collector3.stop(
            msg.edit({
              embeds: [
                embed.setDescription(
                  `Très bien généreux humain, quel est le nouveau prix?\n**Répond en moins de 30 seconds!**`
                )]
            }
            )
          );
        }
        const collector4 = await message.channel.createMessageCollector(
          filter,
          { max: 3, time: 30000 }
        );
        collector4.on("collect", async collect4 => {

          const response4 = collect4.content.toLowerCase();
          prize = response4;
          await collect4.delete()
          collector4.stop(
            console.log(giveawayx),
            msg.edit({
              embeds: [
                embed.setDescription(
                  `Edited`
                )]
            }
            )
          );
          client.giveawaysManager.edit(gid, {
            newWinnersCount: winnersCount,
            newPrize: prize,
            addTime: time
          })
        });
      });
    });
  });
  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
      message.reply({ embeds: [xembed] });
    }
  })
  try {
    collector2.on('end', (collected, reason) => {
      if (reason == 'time') {

        message.reply({ embeds: [xembed] });
      }
    });
    collector3.on('end', (collected, reason) => {
      if (reason == 'time') {
        message.reply({ embeds: [xembed] });

      }
    })
    collector4.on('end', (collected, reason) => {
      if (reason == 'time') {

        message.reply({ embeds: [xembed] });
      }
    })
  } catch (e) { }
}
