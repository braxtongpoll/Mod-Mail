const { EmbedBuilder } = require("discord.js");
module.exports = function(client, guild, toReply, stack, res) {
    let embed = new EmbedBuilder()
        .setAuthor({ name: "Interaction Fail" })
        .setDescription(`There was an error while using an interaction.\n` + '```\n' + stack + '\n```')
    if (guild) embed.setFooter({ text: guild.name, iconURL: guild.iconURL() })
    toReply.reply({ embeds: [embed], ephemeral: true });
};