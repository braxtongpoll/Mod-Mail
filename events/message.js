const { MessageEmbed } = require("discord.js");
const users = require("../src/schemas/users");
module.exports = async(client, message) => {
    if (!message.author) return;
    if (!message.guild) return DMMessageEvent(client, message);
    client.db.findById(message.guild.id, async function(err, res) {
        if (message.content.startsWith(res.prefix)) return commandController(client, message, res.prefix);
    });
};


async function DMMessageEvent(client, message) {
    users.findById(message.author.id, async function(err, res) {
        if (err) users.create({ _id: message.author.id }).then(() => {});
        let cont = false;
        if (res) {
            if (res.active.length > 1) cont = true;
        }
        if (cont == true) {

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
            message.channel.send("Please select a number from the list of guilds above.");
            const filter = response => { return response.author.id === message.author.id };
            message.channel.awaitMessages(filter, { max: 1, time: 120000, errors: [`time`] }).then(collected => {
                if (isNan(collected.first().content) || collected.first().content > guilds.length) return message.channel.send("Invalid selection. Please try again.");
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
                                .setFooter(guild.name, guild.iconURL())
                                .setColor(client.config.color)
                                .setDescription(content)
                                .setAuthor(`New mail from ${message.author.tag}`, message.author.displayAvatarURL())
                            channel.send({ embeds: [mail] })
                        });
                    });
                });
            }).catch(e => {
                return message.channel.send("Time error.");
            })
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