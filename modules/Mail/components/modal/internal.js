module.exports.run = function(client, interaction) {
    let message = interaction.fields.fields.get("message").value;
    interaction.reply({ embeds: [
        {
            color: client.config.color,
            description: message,
            footer: { text: "This is an internal message.\nThe recipient did not receive this message." }
        }
    ] })
};