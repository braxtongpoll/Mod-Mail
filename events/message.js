const { MessageEmbed } = require("discord.js");
module.exports = async(client, message) => {
    if (!message.author) return;
    if (!message.guild) return DMMessageEvent(client, message);
    client.db.findById(message.guild.id, async function(err, res) {
        if (message.content.startsWith(res.prefix)) return commandController(client, message, res.prefix);
    });
};


async function DMMessageEvent(client, message) {

};




function commandController(client, message, prefix) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    try {
        if (!message.member.permissions.has(cmd.info.permission)) return message.reply("You're missing the permission `" + cmd.info.permission + "` to run this command.", { reply: { messageReference: '765432109876543219' } })
    } catch {};
    if (cmd) {
        try {
            cmd.run(client, message, args)
        } catch (e) {
            return console.log(error, `[NON-FATAL]: ${e}`)
        };
    };
};