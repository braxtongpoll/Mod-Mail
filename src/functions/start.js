const carden = require(`carden`);
const chalk = require('chalk');
const figlet = require(`figlet`);
const { readdir } = require('fs');
const { join } = require('path');
module.exports = {
    async prompt(client) {
        var djsVer = require(`discord.js`).version;
        var totalEvents;
        readdir(join(__dirname, "../", "../", "events/"), (err, files) => {
            totalEvents = files.length;
        });
        figlet.text(`Plutos   World`, { width: '500', }, async function(err, art) {
            if (err) return;
            var box = carden(art, chalk.black(`Logged in as ${client.user.tag} (${chalk.green(client.user.id)})\n\nCommands: ${chalk.black(global.commands)}\nEvents: ${chalk.black(totalEvents)}\n\nCreated By: ${chalk.black("Pluto's World")}\nFor support ${chalk.red("https://plutothe.dev/discord")}\n\nMod Mail Version: ${require("../../package.json").version}\nDiscord.js Version: ${djsVer}\nNode Version: ${process.version.replace("v","")}`), { borderColor: "yellow", borderStyle: "bold", padding: 1, backgroundColor: "black", header: { backgroundColor: "black" }, content: { backgroundColor: "white" } });
            return console.log(box);
        });
    }
};