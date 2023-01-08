module.exports.run = function(client, interaction, args) {
    client.db.query(`SELECT * FROM mail WHERE channel = '${interaction.channel.id}';`, function(err, res) {
        if (!res?.length) return interaction.reply({ content: "You can't use this command in this channel.", ephemeral: true });
        let modal = {
            "custom_id": "internal",
            "title": "Internal mail message",
            "components": [{
                "type": 1,
                "components": [{
                    "type": 4,
                    "custom_id": "message",
                    "label": "Message",
                    "style": 2,
                    "min_length": 1,
                    "max_length": 4000,
                    "placeholder": "Type your message here...",
                    "required": true
                }]
            }]
        };
        interaction.showModal(modal);
    });
}, module.exports.info = {
    name: "internal",
    description: "Post an internal message in a mail channel."
}