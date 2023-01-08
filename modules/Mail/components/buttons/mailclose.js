module.exports.run = function(client, interaction, data) {
    switch(data){
        case "start":
            let row = [{
                "type": 1,
                "components": [{
                    "type": 2,
                    "style": 3,
                    "label": "Confirm",
                    "custom_id": "mailclose-yes",
                    "disabled": false
                }, {
                    "type": 2,
                    "style": 4,
                    "label": "Cancel",
                    "custom_id": "mailclose-no",
                    "url": null,
                    "disabled": false
                }]
            }]
            if (!interaction.guild) {
                client.db.query(`SELECT * FROM mail WHERE createdBy = '${interaction.user.id}';`, function(err, res) {
                    if (!res?.length) return interaction.reply({ content: "I was not able to find mail data to close.", ephemeral: true });
                    interaction.reply({ components: row, ephemeral: true });
                });
            } else {
                client.db.query(`SELECT * FROM mail WHERE channel = '${interaction.channel.id}';`, function(err, res) {
                    if (!res?.length) return interaction.reply({ content: "I was not able to find mail data to close.", ephemeral: true });
                    interaction.reply({ components: row, ephemeral: true });
                });
            };
        break;
        case "yes":
            if (!interaction.guild) {
                client.db.query(`SELECT * FROM mail WHERE createdBy = '${interaction.user.id}';`, function(err, res) {
                    if (!res?.length) return interaction.reply({ content: "I was not able to find mail data to close.", ephemeral: true });
                    client.db.query(`UPDATE mail SET active = 0 WHERE id = ${res[0].id};`, function() {});
                    log(client, interaction, res);
                });
            } else {
                client.db.query(`SELECT * FROM mail WHERE channel = '${interaction.channel.id}';`, function(err, res) {
                    if (!res?.length) return interaction.reply({ content: "I was not able to find mail data to close.", ephemeral: true });
                    interaction.channel.delete()
                    client.db.query(`UPDATE mail SET active = 0 WHERE id = ${res[0].id};`, function() {});
                    log(client, interaction, res);
                    let user = client.users.cache.get(res[0].createdBy);
                    if (!user) return;
                    user.send({ embeds: [
                        {
                            color: client.config.color,
                            author: { name: "Mail connection closed" },
                            description: `Your mail connection was closed by (**${interaction.user.username}**)\nTo view your transcript head to ${client.config.domain}/view/${res[0].id}.`
                        }
                    ] });
                });
            };
        break;
        case "no":
            interaction.update({ components: [], content: "Action cancelled." });
        break;
    }
};
function log(client, interaction, res) {
    let logs = client.channels.cache.get(client.config["mail logging"]);
    if (!logs) return;
    let user = client.users.cache.get(res[0].createdBy);
    logs.send({
        embeds: [
            {
                color: client.config.color,
                author: { name: "Mail Transcript" },
                description: `- Opened by: ${user.tag} (${user.id})\n- Closed by: ${interaction.user.tag} (${interaction.user.id})\n- Transcript: ${client.config.domain}/view/${res[0].id}`
            }
        ]
    })
};