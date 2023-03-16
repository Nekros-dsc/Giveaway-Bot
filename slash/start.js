const Discord = require("discord.js")
const messages = require("../utils/message");
const ms = require("ms");
const config = require('../config.json')
module.exports = {
  name: 'start',
  description: '🎉 Commencer un giveaway',

  options: [
    {
      name: 'duration',
      description: 'Le temps du giveaway. Exemple : 1m, 1h, 1d',
      type: 'STRING',
      required: true
    },
    {
      name: 'winners',
      description: 'Combien y aura t\'il de gagnants',
      type: 'INTEGER',
      required: true
    },
    {
      name: 'prize',
      description: 'Quel est le prix du giveaway ?',
      type: 'STRING',
      required: true
    },
    {
      name: 'channel',
      description: 'Sans quel salon y aura t\'il le giveaway ?',
      type: 'CHANNEL',
      required: true
    },
    {
      name: 'bonusrole',
      description: 'Rôle avec des entrées bonus',
      type: 'ROLE',
      required: false
    },
    {
      name: 'bonusamount',
      description: 'Le nombre d\'entrées bonus',
      type: 'INTEGER',
      required: false
    },
    {
      name: 'invite',
      description: 'L\'invitation du serveur a rejoindre',
      type: 'STRING',
      required: false
    },
    {
      name: 'role',
      description: 'Rôle du gagnant avec condition à donner',
      type: 'ROLE',
      required: false
    },
  ],

  run: async (client, interaction) => {

    // If the member doesn't have enough permissions
    if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Tu dois avoir la permission de gérer les messages.',
        ephemeral: true
      });
    }

    const giveawayChannel = interaction.options.getChannel('channel');
    const giveawayDuration = interaction.options.getString('duration');
    const giveawayWinnerCount = interaction.options.getInteger('winners');
    const giveawayPrize = interaction.options.getString('prize');

    if (!giveawayChannel.isText()) {
      return interaction.reply({
        content: ':x: Selectionne un salon!',
        ephemeral: true
      });
    }
   if(isNaN(ms(giveawayDuration))) {
    return interaction.reply({
      content: ':x: Donne moi une durée valide!',
      ephemeral: true
    });
  }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Donne moi un gagnant égale ou supérieur à 1.',
      })
    }

    const bonusRole = interaction.options.getRole('bonusrole')
    const bonusEntries = interaction.options.getInteger('bonusamount')
    let rolereq = interaction.options.getRole('role')
    let invite = interaction.options.getString('invite')

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `:x: Tu dois me dire combien de personnes auront ${bonusRole} !`,
          ephemeral: true
        });
      }
    }


    await interaction.deferReply({ ephemeral: true })
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite)
      let client_is_in_server = client.guilds.cache.get(
        invitex.guild.id
      )
      reqinvite = invitex
      if (!client_is_in_server) {
        return interaction.editReply({
          embeds: [{
            color: "#2F3136",
            author: {
              name: client.user.username,
              iconURL: client.user.displayAvatarURL() 
            },
            title: "Server Check!",
            url: config.support,
            description:
              "Woah woah woah! Je vois un nouveau serveur mais je suis pas dedans, invite moi! 😳",
            timestamp: new Date(),
            footer: {
              iconURL: client.user.displayAvatarURL(),
              text: "Server Check"
            }
          }]
        })
      }
    }

    if (rolereq && !invite) {
      messages.inviteToParticipate = `**Appuie sur 🎉 pour participer!**\n>>> - Seul ceux qui ont le rôle ${rolereq} peuvent participer à ce giveaway!`
    }
    if (rolereq && invite) {
      messages.inviteToParticipate = `**Appuie sur 🎉 pour participer!**\n>>> - Seul les membres qui ont ${rolereq} sont autoriser à participer à ce giveaway!\n- Les membres doivent rejoindre [ce serveur](${invite}) pour participerr!`
    }
    if (!rolereq && invite) {
      messages.inviteToParticipate = `**Appuie sur 🎉 pour participer!**\n>>> - Les membres doivent rejoindre [ce serveur](${invite}) pour participer à ce giveaway!`
    }


    // start giveaway
    client.giveawaysManager.start(giveawayChannel, {
      // The giveaway duration
      duration: ms(giveawayDuration),
      // The giveaway prize
      prize: giveawayPrize,
      // The giveaway winner count
      winnerCount: parseInt(giveawayWinnerCount),
      // BonusEntries If Provided
      bonusEntries: [
        {
          // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
          bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
          cumulative: false
        }
      ],
      // Messages
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      }
    });
    interaction.editReply({
      content:
        `Giveaway commencer dans ${giveawayChannel}!`,
      ephemeral: true
    })

    if (bonusRole) {
      let giveaway = new Discord.MessageEmbed()
        .setDescription(
          `**${bonusRole}** a **${bonusEntries}** en entrées bonus!`
        )
        .setColor("#2F3136")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }

  }

};
