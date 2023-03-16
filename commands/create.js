const Discord = require('discord.js'),
  { MessageEmbed } = Discord,
  parsec = require('parsec'),
  messages = require('../utils/message');
module.exports.run = async (client, message) => {
  const collector = message.channel.createMessageCollector({
    filter: (m) => m.author.id === message.author.id,
    time: 60000,
  });

  let xembed = new MessageEmbed()
  .setTitle("Oops! Temps Ecoulé! 🕖")
  .setColor("#FF0000")
  .setDescription('💥 Oups, tu as pris trop de temps pour te décider!\nEssaie de répondre en moins de **30 secondes**!')
  .setFooter({
     text: `${client.user.username}`,
     iconURL: client.user.displayAvatarURL()
  })  
  .setTimestamp()


  function waitingEmbed(title, desc) {
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle('Giveaway ' + title)
          .setDescription(desc + ' Répond en moins de **60 secondes**.')
          .setFooter({
            text: "Ecrit `cancel` pour annuler.",
            iconURL: client.user.displayAvatarURL()
           })
          .setTimestamp()
          .setColor('#2F3136'),
      ],
    });
  }

  let winnerCount, channel, duration, prize, cancelled;

  await waitingEmbed('Prix', 'Envoie un prix');

  collector.on('collect', async (m) => {
    if (cancelled) return;

    async function failed(options, ...cancel) {
      if (typeof cancel[0] === 'boolean')
        (cancelled = true) && (await m.reply(options));
      else {
        await m.reply(
          options instanceof MessageEmbed ? { embeds: [options] } : options
        );
        return await waitingEmbed(...cancel);
      }
    }

    if (m.content === 'cancel'){ 
  collector.stop()
 return await failed('Giveaway annulé.', true) 
}

    switch (true) {
      case !prize: {
        if (m.content.length > 256)
          return await failed(
            'Le prix ne peut pas dépasser 256 caractères.',
            'Prix',
            'Envoie un prix'
          );
        else {
          prize = m.content;
          await waitingEmbed('Salon', 'Envoie le salon du giveaway');
        }

        break;
      }

      case !channel: {
        if (!(_channel = m.mentions.channels.first() || m.guild.channels.cache.get(m.content)))
          return await failed(
            'Envoie un salon valide.',
            'Salon',
            'Envoie un salon du giveaway'
          );
        else if (!_channel.isText())
          return await failed(
            'Le salon doit être un salon textuel.',
            'Salon',
            'Envoie le salon du giveaway'
          );
        else {
          channel = _channel;
          await waitingEmbed(
            'Nombre de gagnants',
            'Envoie le nombre de gagnants.'
          );
        }

        break;
      }

      case !winnerCount: {
        if (!(_w = parseInt(m.content)))
          return await failed(
            'Le gagnant doit être un chiffre.',

            'Nombre de gagnants',
            'Envoie le nombre de gagnants.'
          );
        if (_w < 1)
          return await failed(
            'Le nombre de gagnant doit être 1 ou supérieur à 1.',
            'Nombre de gagnants',
            'Envoie le nombre de gagnants.'
          );
        else if (_w > 15)
          return await failed(
            'Le nombre de gagnants ne peut pas être plus de 15.',
            'Nombre de gagnants',
            'Envoie le nombre de gagnants.'
          );
        else {
          winnerCount = _w;
          await waitingEmbed('Duration', 'Donne une durée valide');
        }

        break;
      }

      case !duration: {
        if (!(_d = parsec(m.content).duration))
          return await failed(
            'Entre une durée valide.',
            'Duration',
            'Donne une durée valide'
          );
        if (_d > parsec('21d').duration)
          return await failed(
            'Le temps doit être inferieur à 21 jours!',
            'Duration',
            'Donne une durée valide'
          );
        else {
          duration = _d;
        }

        return client.giveawaysManager.start(channel, {
          prize,
          duration,
          winnerCount,
          messages,
          hostedBy: client.config.hostedBy && message.author,
        });
      }
    }
  });
  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
       message.reply({ embeds: [xembed]})
    }
  })
};
