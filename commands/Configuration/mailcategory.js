exports.run = async(client, message, args) => {
    let channel = await client.utils.findChannel(message, args);
    if (!channel) return client.ia(message, exports.info.arguments);
    if (channel.type !== "category") return client.ia(message, exports.info.arguments);
    client.docUpdate(message, "category", `${channel.id}`, "The mail category was set to **" + channel.name + "**")
}, exports.info = {
    name: "mailcategory",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Set the category for new mail.`,
    arguments: "CATEGORY"
};