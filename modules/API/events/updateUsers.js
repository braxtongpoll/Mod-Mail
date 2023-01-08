const config = require("../config/config.json");
module.exports = function(client, o, interaction, mail) {
    client.db.query(`INSERT INTO api_mail (openedBy, closedBy, messages, users, guild) VALUES ('${o.openedBy}', '${o.closedBy}', '${o.messages}', '${o.users}', '${interaction.guild.id}');`, function(err, res) {
        let guild = client.guilds.cache.get(mail[0].guild);
        client.db.query(`SELECT * FROM data WHERE id = '${mail[0].guild}';`, function(err, settings) {
            let logs = guild.channels.cache.get(interaction.guild.settings.maillogs);
            let embed = new EmbedBuilder()
                .setFooter({ text: guild.name, iconURL: guild.iconURL() })
                .setColor(settings[0].color)
                .setTitle(client.languages(settings, "Mail Log"))
                .setURL(`${config.domain}/mail/${res.insertId}`)
                .addFields(
                    {
                        name: client.languages(settings, "Key Members"),
                        value: `**Opened By**: <@!${mail[0].user}>\n**Closed By**: <@!${interaction.user.id}>`,
                        inline: true
                    }, {
                        name: client.languages(settings, "Mail Number"),
                        value: `\`${mail[0].id}\``,
                        inline: true
                    }, {
                        name: client.languages(settings, "Members"),
                        value: o.members.join("\n"),
                        inline: true
                    }
                )
            logs.send({ embeds: [embed] });
            o.startUser.send({ embeds: [embed] }).catch(function(_) {});
            let channel = guild.channels.cache.get(mail[0].channel);
            if (channel) channel.delete().catch(function(_) {});
            client.db.query(`UPDATE mail SET active = false WHERE id = ${Number(o.id)};`, function(_) {});
            client.db.query(`DELETE FROM mailmessages WHERE channel = '${o.id}';`, function(_) {});
        });
    });
};