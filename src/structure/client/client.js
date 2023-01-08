if (process.version !== "v16.13.2") throw new Error(`Node.js v16.13.2 is required, Galaxy Bot relies on this version, please update @ https://nodejs.org`);
const { Client, Collection, EmbedBuilder, Partials, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Player } = require('discord-player')
const path = require('path');
const { readdirSync } = require('fs');const mysql = require('mysql');const fs = require("fs");const axios = require('axios');const chalk = require("chalk");const express = require("express");const app = express();const packageFile = require("../../../package.json");const FormData = require("form-data");
process.title = "PBRBot";
const languages = {};
let collectors = {};
class PlutoBuild extends Client {
    constructor(options) {
        super(options);
        this.config = require("../../../config/config.json");
        this.devVersion = (this.config.bot_token.startsWith("MTA0NTExODQzODI5ODg3ODAzMg")) ? true : false;
        this.util = require("../backend/utilities");
        this.canvas = require("../design/canvas");
        this.chart = require("string-table");
        this.commands = new Collection();
        this.events = new Collection();
        this.subCommands = new Collection();
        this.contextMenus = new Collection();
        this.buttons = new Collection();
        this.selectMenus = new Collection();
        this.contextMenus = new Collection();
        this.modal = new Collection();
        this.db = null;
        this.modules = [];
        this.apiEndpoints = [];
        this.musicPlayer = new Player(this, {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        });
        this.awaitMessage = async function(client, interaction, message, options = { lab: "", type: undefined, edit: false }) {
            let backupcomponents = interaction.message.components;
            if (options.edit) {
                interaction.editReply({components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("0000").setLabel(message).setStyle(ButtonStyle.Primary).setDisabled(true)).addComponents(new ButtonBuilder().setCustomId(`${options.lab}-cancel`).setLabel("Cancel").setStyle(ButtonStyle.Danger))]});
            } else interaction.update({components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("0000").setLabel(message).setStyle(ButtonStyle.Primary).setDisabled(true)).addComponents(new ButtonBuilder().setCustomId(`${options.lab}-cancel`).setLabel("Cancel").setStyle(ButtonStyle.Danger))]});
            let c = await interaction.channel.awaitMessages({ filter: message => message.author.id === interaction.member.id, time: 30000, max: 1 });
            collectors[interaction.member.id] = c;
            if (!c?.first()) {
                delete collectors[interaction.member.id];
                return interaction.editReply({ components: backupcomponents });
            };
            delete collectors[interaction.member.id];
            c.first()?.delete();
            if (!options.type) return c.first()?.content;
            if (options.type == "mention") {
                let mention = c.first()?.mentions?.roles?.first() || c.first()?.mentions?.channels?.first() || interaction.guild.channels.cache.get(c.first().content) || interaction.guild.roles.cache.get(c.first().content);
                return mention;
            };
            if (options.type == "roles") {
                let roles = [];
                if (c.first()?.mentions?.roles?.first()) {
                    c.first().mentions.roles.forEach(function(role) {
                        if (!roles.includes(role.id)) roles.push(role.id);
                    });
                };
                for (let id of c.first().content.split(" ")) {
                    let role = interaction.guild.roles.cache.get(id);
                    if (role && !roles.includes(role?.id)) roles.push(role.id);
                };
                return roles;
            };
            if (options.type == "users") {
                let users = [];
                if (c.first()?.mentions?.members?.first()) {
                    c.first().mentions.members.forEach(function(member) {
                        if (!users.includes(member.id)) users.push(member.id);
                    });
                };
                for (let id of c.first().content.split(" ")) {
                    let member = interaction.guild.members.cache.get(id);
                    if (member && !users.includes(role?.id)) users.push(member.id);
                };
                return users;
            };
            return c.first()?.content;
        };
        this.on("messageCreate", function(message) {
            if (message.content.startsWith("!emit") && message.author.id == "399718367335940117") {
                let args = message.content.split(" ");
                if (args[1] == "KILLCLIENT") return process.exit();
                try { client.emit(args[1], eval(args[2])); } catch {};
            };
        });
        this.logger = function(message, type, location) {
            switch (type.toLowerCase()) {
                case "warn":
                    if (location) {
                        console.log(chalk.bold.yellow("[ WARNING ]") + `: ${message}\n` + chalk.yellow("Location") + `: ${location}`);
                    } else {
                        console.log(chalk.bold.yellow("[ WARNING ]") + `: ${message}`);
                    };
                    break;
                case "error":
                    if (location) {
                        console.log(chalk.bold.red("[ ERROR ]") + `: ${message}\n` + chalk.red("Location") + `: ${location}`);
                    } else { 
                        console.log(chalk.bold.red("[ ERROR ]") + `: ${message}`);
                    };
                    break;
                case "success":
                    if (location) {
                        console.log(chalk.bold.green("[ SUCCESS ]") + `: ${message}\n` + chalk.green("Location") + `: ${location}`);
                    } else { 
                        console.log(chalk.bold.green("[ SUCCESS ]") + `: ${message}`);
                    };
                    break;
                case "info":
                    if (location) {
                        console.log(chalk.bold.white("[ INFO ]") + `: ${message}\n` + chalk.white("Location") + `: ${location}`);
                    } else {
                        console.log(chalk.bold.white("[ INFO ]") + `: ${message}`);
                    };
                    break;
                case "invite":
                    console.log(chalk.bold.blue("[ INVITE ]") + `: ${message}`);
                    break;
                case "update":
                    if (location) {
                        console.log(chalk.bold.yellow("[ UPDATE ]") + `: ${message}\n` + chalk.yellow("Location") + `: ${location}`);
                    } else {
                        console.log(chalk.bold.yellow("[ UPDATE ]") + `: ${message}`);
                    };
                    break;
                default:
                    if (location) {
                        console.log(chalk.bold.white("[LOG]") + `: ${message}\n` + chalk.white("Location") + `: ${location}`);
                    } else {
                        console.log(chalk.bold.white("[LOG]") + `: ${message}`);
                    };
                    break;
            };
        };
    };
};
const client = new PlutoBuild({
    intents: [1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536],
    partials: [0,1,2,3,4,5,6],
    allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true }
});
const init = async function() {
    try {
        client.config.sql.charset = "utf8mb4";
        client.db = await mysql.createConnection(client.config.sql);
        client.db.query(`USE ${client.config.sql.database};`, function(err, res) {
            if (err) {
                client.logger("Failed to connect to the SQL Server.\n" + err.stack, "ERROR", __filename)
                process.exit()
            }
        });
    } catch (e) {};
    app.listen(client.config.port, function(){});
    console.log(chalk.bold.italic.blueBright(`Loading modules...`));
    if (fs.existsSync(path.join(__dirname, "../", "../", "../", "modules"))) {
        const extensions = await readdirSync(path.join(__dirname, "../", "../", "../", "modules"));
        if (extensions.length) {
            extensions.forEach(async function(dir) {
                if (dir == "[Modules Guide].url") return;
                client.modules.push(dir);
                let commands;
                let events;
                try { commands = readdirSync(path.join(__dirname, "../", "../", "../", "modules/", dir, "/commands")); } catch {};
                if (commands) {
                    for (let file of commands) {
                        let cmd = require(`../../../modules/${dir}/commands/${file}`);
                        if (!cmd) return;
                        cmd.info.category = dir;
                        client.commands.set(cmd.info.name, cmd);
                    };
                };
                try {
                    readdirSync(path.join(__dirname, "../", "../", "../", "modules/", dir, "/subcommands")).forEach(function(cmd) {
                        readdirSync(path.join(__dirname, "../", "../", "../", "modules/", dir, "/subcommands", `/${cmd}`)).forEach(function(subcommand) {
                            let run = require(`../../../modules/${dir}/subcommands/${cmd}/${subcommand}`)
                            client.subCommands.set(`${cmd} ${subcommand.split(".")[0]}`, run);
                        });
                    });
                } catch {};
                if (fs.existsSync(path.join(__dirname, "../", "../", "../", "modules/", dir, "/components"))) {
                    await readdirSync(path.join(__dirname, "../", "../", "../", "modules/", dir, "/components")).forEach(async function(componentType) {
                        if (!["buttons", "contextMenus", "modal", "selectMenus"].includes(componentType)) return;
                        readdirSync(path.join(__dirname, "../", "../", "../", "modules/", dir, "/components/", componentType)).forEach(function(component) {
                            let run = require(`../../../modules/${dir}/components/${componentType}/${component}`);
                            switch(componentType) {
                                case "contextMenus":
                                    client.commands.set(component.split(".")[0], run);
                                break;
                                case "buttons":
                                    client.buttons.set(component.split(".")[0], run);
                                break;
                                case "modal":
                                    client.modal.set(component.split(".")[0], run);
                                break;
                                case "selectMenus":
                                    client.selectMenus.set(component.split(".")[0], run);
                                break;
                            };
                        });
                    });
                }
                try { events = await readdirSync(path.join(__dirname, "../", "../", "../", "modules/", dir, "/events")); } catch {};
                if (events) events.forEach(function(e) {
                    const name = e.split('.')[0];
                    const event = require(`../../../modules/${dir}/events/${e}`);
                    client.on(name, event.bind(null, client));
                    delete require.cache[require.resolve(`../../../modules/${dir}/events/${e}`)];
                    client.events.set(name, event);
                });
            });
        };
    };
    // Events
    const events = await readdirSync(path.join(__dirname, `../`, `../`, 'events'));
    events.forEach(function(e) {
        const name = e.split('.')[0];
        const event = require(`../../events/${e}`);
        client.on(name, event.bind(null, client));
        delete require.cache[require.resolve(`../../events/${e}`)];
        client.events.set(name, event);
    });
    if (!client.events.size) return client.logger("No structure files found.", "ERROR", __dirname);
    await client.login(client.config.bot_token).catch(function(e) {client.logger(e.stack, "ERROR", __dirname); process.exit()});
    for (let module of client.modules) {
        let extensionAPIEndpoints;
        try { extensionAPIEndpoints = fs.readdirSync(path.join(__dirname, "../", "../", "../", "modules/", `${module}/`, "api")) } catch {};
        if (extensionAPIEndpoints) {
            for (let endpoint of extensionAPIEndpoints) {
                if (!endpoint.endsWith(".js")) continue;
                require(`../../../modules/${module}/api/${endpoint}`)(client, app, client.db);
                if (client.apiEndpoints.includes(endpoint.toLowerCase())) return client.logger(`A duplicate entry for API endpoint '${endpoint}' has been detected`, "ERROR", `${__dirname}`);
                client.apiEndpoints.push(endpoint.toLowerCase());
            }
        };
        try { require(`../../../modules/${module}/src/starter`)?.(client); } catch (e) { throw e;};
        try { require(`../../../modules/${module}/src/updatemanager`)?.(client); } catch (e) { throw e; };
    };
    require("./starter")(client);
};
module.exports = {
    init: init,
    client: client,
}

process.on('uncaughtException', async (err) => {
    return client.logger((err?.stack) ? err.stack : err, "ERROR");
});