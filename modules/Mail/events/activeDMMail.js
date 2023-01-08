const axios = require("axios");
module.exports = async function(client, message, res) {
    let content = message.content;
    if (message?.attachments?.first()?.proxyURL) content += `\n${message?.attachments?.first()?.proxyURL}`;
    let webpush = await axios({
        method: 'POST',
        url: res.webhook,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            username: message.author.username,
            avatar_url: message.author.displayAvatarURL({ format: "png", dynamic: true, size: 512 }),
            content: content,
        }
    });
    message.react(client.config["sent emoji"]);
    client.emit("logMessage", message, res);
};