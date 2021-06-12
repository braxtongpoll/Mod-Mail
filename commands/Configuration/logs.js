exports.run = async(client, message, args) => {
    let channel = await client.utils.findChannel(message, args);
    if (!channel) return client.ia(message, exports.info.arguments);
    client.docUpdate(message, "closedMailLogs", `${channel.id}`, "The closed mail logs was set to **" + channel.name + "**")
}, exports.info = {
    name: "logs",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Set the logging channel for closed mail.`,
    arguments: "CATEGORY"
};