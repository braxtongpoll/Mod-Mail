exports.run = async(client, message, args) => {
    let prefix = args.join(" ");
    if (!prefix) return client.ia(message, exports.info.arguments);
    client.docUpdate(message, "prefix", prefix, `Your prefix was changed to **${prefix}**`)
}, exports.info = {
    name: "prefix",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Change the prefix of the bot.`,
    arguments: "NEW_PREFIX"
}