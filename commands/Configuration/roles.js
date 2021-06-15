exports.run = async(client, message, args) => {
    let role;
    if (message.mentions.roles.first()) {
        role = message.mentions.roles.first();
    } else {
        role = message.guild.roles.cache.get(args[0]);
    };
    if (!role) return client.ia(message, exports.info.arguments);
    client.db.findById(message.guild.id, async function(err, res) {
        if (res.roles.includes(role.id)) {
            res.roles = res.roles.filter(id => id !== role.id);
            client.docUpdate(message, "roles", res.roles, `${role.name} was removed from the support roles.`);
        } else {
            res.roles.push(role.id);
            client.docUpdate(message, "roles", res.roles, `${role.name} was added to the support roles.`);
        };
    });
}, exports.info = {
    name: "roles",
    aliases: [],
    permission: `MANAGE_GUILD`,
    description: `Change the roles aloud to see mail.`,
    arguments: "ROLE"
}