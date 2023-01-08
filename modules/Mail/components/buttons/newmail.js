let cache = {};
const { ChannelType } = require("discord.js");
module.exports.run = function(client, interaction, data) {
    switch(data) {
        case "submit":
            if (!cache[interaction.user.id]) return interaction.update({ embeds: [], content: "Unable to find mail data.", components: [] });
            let guild = client.guilds.cache.get(client.config.guild);
            if (!guild) return interaction.update({ embeds: [], content: "Unable to find guild.", components: [] });
            let permissions = [
                {
                    id: guild.id,
                    deny: ["ViewChannel"]
                }
            ];
            for (let id of client.config["support roles"]) {
                permissions.push({
                    id: id,
                    allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                });
            };
            guild.channels.create({
                name: `mail-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: client.config["mail category"],
                permissionOverwrites: permissions
            }).then(async function(channel) {
                await channel.createWebhook({
                    name: `${interaction.user.username}-mail`,
                    avatar: interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })
                }).then(function(webhook) {
                    let text = cache[interaction.user.id].text;
                    let image = cache[interaction.user.id].image;
                    client.db.query(`INSERT INTO mail (createdBy, createdOn, channel, webhook) VALUES ('${interaction.user.id}', '${new Date().getTime()}', '${channel.id}', '${webhook.url}');`, function(err, res) {
                        let content = `<p id="text02">${text}</p><hr id="divider02">`
                        client.db.query(`INSERT INTO messages (text, image, user, mail) VALUES (${client.db.escape(content)}, '${image}', '${interaction.user.id}', ${res.insertId});`, function() {});
                    });
                });
                let embed = {
                    author: { name: "New mail" },
                    description: `**Sender**: ${interaction.user.tag} (${interaction.user.id})\n**Message**\n${cache[interaction.user.id].text}`,
                    color: client.config.color
                };
                if (cache[interaction.user.id].image) embed.image = { url: cache[interaction.user.id].image };
                let row = [{
                    "type": 1,
                    "components": [{
                        "type": 2,
                        "style": 4,
                        "label": "Close mail connection",
                        "custom_id": "mailclose-start",
                        "disabled": false
                    }]
                }];
                interaction.update({ embeds: [{
                    color: client.config.color,
                    description: "Connection established...\n\nLive feed connected. We will be with you shortly."
                }], components: row });
                channel.send({ embeds: [embed], components: row });
                delete cache[interaction.user.id];
            });
        break;
        case "cancel":
            interaction.update({ embeds: [], content: "Mail cancelled.", components: [] });
            delete cache[interaction.user.id];
        break;
    }
};

module.exports.getCache = function(id) {
    return cache[id];
};

module.exports.updateCache = function(id, newcache) {
    cache[id] = newcache;
};

module.exports.deleteCache = function(id) {
    delete cache[id];
}