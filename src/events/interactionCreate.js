const { EmbedBuilder, InteractionType } = require('discord.js');

module.exports = async function(client, interaction) {
    if (interaction.type === InteractionType.ApplicationCommand) {
        const command = await client.commands.get(interaction.commandName)
        if (!command) return;
        let permCheck = command.info.name;
        if (interaction.options?._group) permCheck += ` ${interaction.options._group}`;
        if (interaction.options?._subcommand) permCheck += ` ${interaction.options._subcommand}`;
        try {
            command.run(client, interaction);
        } catch (e) {};
    };
    if (interaction.type === InteractionType.MessageComponent) {
        if (interaction.customId.includes("-")) {
            let name = interaction.customId.split("-")[0];
            let component;
            switch(interaction.componentType) {
                case 8:
                    component = client.selectMenus.get(name);
                break;
                case 3:
                    component = client.selectMenus.get(name);
                break;
                case 2:
                    component = client.buttons.get(name);
                break;
            };
            if (!component) return;
            let id = interaction.customId.split("-").slice(1).join("-");
            if (!interaction.guild) {
                try { component.run(client, interaction, id); } catch (e) {};
                return;
            }
            try { component.run(client, interaction, id); } catch (e) {
                client.emit("errorEmbed", interaction.guild, interaction, e.stack, interaction.guild.settings);
            };
        } else {
            let component;
            switch(interaction.componentType) {
                case 8:
                    component = client.selectMenus.get(interaction.customId);
                break;
                case 3:
                    component = client.selectMenus.get(interaction.customId);
                break;
                case 2:
                    component = client.buttons.get(interaction.customId);
                break;
            };
            if (!component) return;
            try { component.run(client, interaction); } catch (e) {
                client.emit("errorEmbed", interaction.guild, interaction, e.stack, interaction.guild.settings);
            };
        }
    };
    if (interaction.type === InteractionType.ModalSubmit) {
        let modal = client.modal.get(interaction.customId.split("-")[0]);
        if (!modal) return;
        try { modal.run(client, interaction, interaction.customId.split("-").slice(1).join("-")); } catch (e) {
            
        };
    }
};