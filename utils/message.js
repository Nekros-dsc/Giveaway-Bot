const config = require('../config.json');
module.exports = {
  giveaway:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **GIVEAWAY** 🎉",
  giveawayEnded:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **GIVEAWAY Fini** 🎉",
  drawing:  `Fini dans: **{timestamp}**`,
  inviteToParticipate: `Appuie sur 🎉 pour participer!`,
  winMessage: "Bien joué, {winners}! tu as gagné **{this.prize}**!",
  embedFooter: "Giveaways",
  noWinner: "Giveaway annulé, il y avait aucune participation.",
  hostedBy: "Hosted by: {this.hostedBy}",
  winners: "gagnants(s)",
  endedAt: "fini"
}