module.exports = function(client, message) {
    if (message.author.bot) return;
    switch(message.channel.type) {
        case 0:
            client.db.query(`SELECT * FROM mail WHERE channel = '${message.channel.id}';`, function(err, res) {
                if (!res?.length) return;
                let user = client.users.cache.get(res[0].createdBy);
                if (!user) return message.reply({ content: "I was unable to find the recepient for this mail thread in my data." });
                let embed = {
                    color: client.config.color,
                    description: message.content,
                    author: { name: message.author.username, icon_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }) }
                };
                if (message?.attachments?.first()?.proxyURL) embed.image = { url: message?.attachments?.first()?.proxyURL };
                let word = null;
                if (!embed.image) {
                    for (let word of message.content.split(" ")) {
                        if (embed.image) return;
                        if (word.startsWith("https://")) embed.image = { url: word };
                    };
                };
                user.send({ embeds: [embed] });
                updateUsers(client, message.author);
                client.emit("logMessage", message, res[0]);            
            });
        break;
        case 1:
            client.db.query(`SELECT * FROM mail WHERE createdBy = '${message.author.id}' AND active = 1;`, function(err, res) {
                let cache = require("../components/buttons/newmail").getCache(message.author.id);
                if (cache) return;
                updateUsers(client, message.author);
                if (res?.length) return client.emit("activeDMMail", message, res[0]);
                client.emit("newDMMail", message);
            });
        break;
    };
};


function updateUsers(client, user) {
    client.db.query(`SELECT * FROM users WHERE userid = '${user.id}';`, function(err, res) {
        if (!res?.length) return client.db.query(`INSERT INTO users (username, userid, logo) VALUES ('${user.username}', '${user.id}', '${user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}');`, function() {});
        if (res[0].username !== user.username || res[0].logo !== user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })) client.db.query(`UPDATE users SET username = '${user.username}' AND logo = '${user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 })}' WHERE id = ${res[0].id};`, function() {});
    });
};