const { MessageEmbed } = require("discord.js");
const users = require("../src/schemas/users");
let active = [];
module.exports = async(client, message) => {
    if (!message.author) return;
    if (message.author.id == client.user.id) return;
    if (!message.guild) return DMMessageEvent(client, message);
    client.db.findById(message.guild.id, async function(err, res) {
        if (message.content.startsWith(res.prefix)) return commandController(client, message, res.prefix);
        if (res.activeMail[message.channel.id]) {
            let user = await client.users.cache.get(res.activeMail[message.channel.id].user);
            if (!user) return message.reply("The user receipent has disconnected from the chat.");
            user.send(`**Reply from ${message.author}**: ${message.content}`);
        }
    });
};


async function DMMessageEvent(client, message) {
    if (active.includes(message.author.id)) return;
    active.push(message.author.id);
    users.findById(message.author.id, async function(err, res) {
        if (err || !res) users.create({ _id: message.author.id }).then(() => {});
        let channel;
        if (res) channel = await client.channels.cache.get(res.active);
        if (channel) {
            if (message.content.toLowerCase() == "close") {
                client.db.findById(channel.guild.id, async function(err, res) {
                    if (res.activeMail[channel.id]) {
                        let logs = await channel.guild.channels.cache.get(res.closedMailLogs);
                        let user = await client.users.cache.get(res.activeMail[channel.id].user) || res.activeMail[channel.id].user;
                        if (logs) {
                            let embed = new MessageEmbed()
                                .setFooter(channel.guild.name, channel.guild.iconURL())
                                .setColor(client.config.color)
                                .setAuthor("Closed Mail")
                                .addFields({
                                    name: "User",
                                    value: `${user}`,
                                    inline: true
                                }, {
                                    name: "Channel",
                                    value: channel.name,
                                    inline: true
                                }, {
                                    name: "Closed By",
                                    value: `${message.author}`,
                                    inline: true
                                })
                            logs.send({ embeds: [embed] });
                        };
                        users.findByIdAndUpdate(res.activeMail[channel.id].user, { active: "" }).then(() => {}).catch(e => {});
                        message.reply("The inbox has been closed.").catch(() => {});
                        res.activeMail[channel.id] = null;
                        client.db.findByIdAndUpdate(channel.guild.id, { activeMail: res.activeMail }).then(() => {}).catch(e => {});
                        return channel.delete().catch(e => {});
                    };
                });
            };
            channel.send(`**Reply from ${message.author}**: ${message.content}`);
        } else {
            let guilds = [];
            await client.guilds.cache.forEach(async(guild) => {
                let member = await guild.members.cache.get(message.author.id);
                if (member) guilds.push(guild);
            });
            let string = "";
            let integer = 1;
            let temp = 1;
            let embed = new MessageEmbed()
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setColor(client.config.color)
            for (let guild of guilds) {
                if (temp < 11) {
                    string += `**${integer}.** - ${guild.name}\n`;
                    temp++;
                    integer++;
                } else {
                    embed.setDescription(string)
                    message.channel.send({ embeds: [embed] });
                    string = "";
                    temp = 0;
                };
            };
            if (string.length) message.channel.send({ embeds: [embed.setDescription(string)] });
            message.channel.send("Please select a number from the list of guilds above.");
            const filter = response => { return response.author.id === message.author.id };
            message.channel.awaitMessages(filter, { max: 1, time: 120000, errors: [`time`] }).then(collected => {
                if (isNaN(collected.first().content) || collected.first().content > guilds.length) return message.channel.send("Invalid selection. Please try again.");
                const guild = guilds[collected.first().content - 1];
                client.db.findById(guild.id, async function(err, res) {
                    const category = await guild.channels.cache.get(res.category);
                    if (!category) return message.channel.send("Your selected guild has not set me up yet!");
                    message.channel.send("What mail would you like to send?");
                    message.channel.awaitMessages(filter, { max: 1, time: 120000, errors: [`time`] }).then(c => {
                        let content = c.first().content;
                        guild.channels.create(`mail-${message.author.username}`, {
                            parent: category.id,
                            permissionOverwrites: [{
                                id: guild.id,
                                deny: [`VIEW_CHANNEL`]
                            }]
                        }).then(async function(channel) {
                            let mail = new MessageEmbed()
                                .setColor(client.config.color)
                                .setDescription(content)
                                .setAuthor(`New mail from ${message.author.tag}`, message.author.displayAvatarURL())
                            channel.send({ embeds: [mail] })
                            active = active.filter(id => id !== message.author.id);
                            message.author.send("Your mail has been delivered! Support staff will be with you shortly.")
                            users.findById(message.author.id, async function(err, res) {
                                if (err || !res) {
                                    return users.create({
                                        _id: message.author.id,
                                        active: `${channel.id}`
                                    });
                                } else users.findByIdAndUpdate(message.author.id, { active: `${channel.id}` }).then(() => {});
                                client.db.findById(guild.id, async function(err, res) {
                                    res.activeMail[channel.id] = {
                                        user: message.author.id,
                                        date: new Date()
                                    };
                                    client.db.findByIdAndUpdate(guild.id, { activeMail: res.activeMail }).then(() => {});
                                });
                            })
                        });
                    });
                });
            }).catch(e => {
                active = active.filter(id => id !== message.author.id);
                console.log(e.stack)
                return message.channel.send("Time error.");
            });
        };
    });
};




function commandController(client, message, prefix) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    try {
        if (!message.member.permissions.has(cmd.info.permission)) return message.reply("You're missing the permission `" + cmd.info.permission + "` to run this command.", { reply: { messageReference: '765432109876543219' } });
    } catch {};
    if (cmd) {
        try {
            cmd.run(client, message, args)
        } catch (e) {
            return console.log(error, `[NON-FATAL]: ${e}`)
        };
    };
};

const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789abcdefghijklmnopqrstuvwxyz";
var res = "";
for (var i = 0; i < 5; i++) {
    var rnd = Math.floor(Math.random() * list.length);
    res = res + list.charAt(rnd);
};