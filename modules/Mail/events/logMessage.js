module.exports = function(client, message, res) {
    if (message.content.includes("<@")) {
        message.mentions.members.forEach(member => {
            // message.content = message.content.replaceAll(`<@${member.id}>`, `!?!${member.user.username}`);
            message.content = message.content.replaceAll(`<@${member.id}>`, `<span class='tagcolor'>@${member.user.username}</span>`);
        });
    };
    if (message.content.includes("<@!")) {
        message.mentions.members.forEach(member => {
            // message.content = message.content.replaceAll(`<@!${member.id}>`, `!?!${member.user.username}`);
            message.content = message.content.replaceAll(`<@!${member.id}>`, `<span class='tagcolor'>@${member.user.username}</span>`);
        });
    };
    if (message.content.includes("<#")) {
        message.mentions.channels.forEach(channel => {
            // message.content = message.content.replaceAll(`<#${channel.id}>`, `!??!${channel.name}`);
            message.content = message.content.replaceAll(`<#${channel.id}>`, `<span class='tagcolor'>#${channel.name}</span>`);
        });
    };
    if (message.content.includes("<@&")) {
        message.mentions.roles.forEach(role => {
            // message.content = message.content.replaceAll(`<@&${role.id}>`, `!???!${role.name}`);
            message.content = message.content.replaceAll(`<@&${role.id}>`, `<span class='tagcolor'>@${role.name}</span>`);
        });
    };
    let content = `<p id="text02">${message.content}</p><hr id="divider02">`
    client.db.query(`INSERT INTO messages (text, image, user, mail) VALUES (${client.db.escape(content)}, '${message?.attachments?.first()?.proxyURL}', '${message.author.id}', ${res.id});`, function(err) {if (err) console.log(err.stack)});
};