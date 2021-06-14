const { MessageEmbed } = require('discord.js');
const users = require("../../src/schemas/users");
exports.run = async(client, message, args) => {
    client.db.findById(message.guild.id, async function(err, res) {
        if (res.activeMail[message.channel.id]) {
            let logs = await message.guild.channels.cache.get(res.closedMailLogs);
            let user = await client.users.cache.get(res.activeMail[message.channel.id].user) || res.activeMail[message.channel.id].user;
            if (logs) {
                let embed = new MessageEmbed()
                    .setFooter(message.guild.name, message.guild.iconURL())
                    .setColor(client.config.color)
                    .setAuthor("Closed Mail")
                    .addFields({
                        name: "User",
                        value: `${user}`,
                        inline: true
                    }, {
                        name: "Channel",
                        value: message.channel.name,
                        inline: true
                    }, {
                        name: "Closed By",
                        value: `${message.author}`,
                        inline: true
                    })
                logs.send({ embeds: [embed] });
            };
            user.send("The recipient has closed this inbox.").catch(() => {});
            users.findByIdAndUpdate(res.activeMail[message.channel.id].user, { active: "" }).then(() => {}).catch(e => {});
            res.activeMail[message.channel.id] = null;
            client.db.findByIdAndUpdate(message.guild.id, { activeMail: res.activeMail }).then(() => {}).catch(e => {});
            message.channel.delete().catch(e => {});
        };
    });
}, exports.info = {
    name: "close",
    aliases: [],
    permission: `@everyone`,
    description: `Close a mail channel.`,
    arguments: "N/A"
}