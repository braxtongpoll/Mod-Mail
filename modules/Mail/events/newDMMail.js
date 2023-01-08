module.exports = function(client, message) {
    require("../components/buttons/newmail").updateCache(message.author.id, true);
    message.reply({ content: "How can we help you today?" });
    let filter = m => m.author.id === message.author.id;
    let collector = message.channel.createMessageCollector({ filter, time: 150000, max: 1 });
    collector.on("collect", m => {
        if (!m?.content) return;
        let embed = {
            color: client.config.color,
            author: { name: "New Mail" },
            description: m.content
        };
        if (m.attachments.first()) embed.image = { url: m.attachments.first().url };
        let row = [
            {
                "type": 1,
                "components": [{
                    "type": 2,
                    "style": 3,
                    "label": "Submit",
                    "custom_id": "newmail-submit",
                }, {
                    "type": 2,
                    "style": 4,
                    "label": "Cancel",
                    "custom_id": "newmail-cancel",
                    "disabled": false
                }]
            }
        ];
        message.channel.send({ embeds: [embed], components: row });
        require("../components/buttons/newmail").updateCache(message.author.id, { text: m?.content, image: m.attachments?.first()?.url });
    });
    collector.on("end", collected => {
        if (!require("../components/buttons/newmail").getCache(message.author.id)?.text) require("../components/buttons/newmail").deleteCache(message.author.id);
    });
};