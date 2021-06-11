const carden = require(`carden`);
const chalk = require('chalk');
const figlet = require(`figlet`);
const { readdir } = require('fs');
const { join } = require('path');
module.exports = {
    async prompt(client) {
        var djsVer = require(`discord.js`).version;
        var operating;
        if (process.platform == "aix") operating = "IBM AIX";
        if (process.platform == "darwin") operating = "Apple Darwin";
        if (process.platform == "freebsd") operating = "FreeBSD";
        if (process.platform == "linux") operating = "Linux/Linux Distro";
        if (process.platform == "openbsd") operating = "OpenBSD";
        if (process.platform == "sunos") operating = "SunOS";
        if (process.platform == "win32") operating = "Windows";
        if (process.platform == "ubuntu") operating = "Linux - Docker";
        else operating = "Unknown";
        var totalEvents;
        readdir(join(__dirname, "../", "../", "events/"), (err, files) => {
            totalEvents = files.length;
        });
        figlet.text(`Plutos   World`, { width: '500', }, async function(err, art) {
            if (err) return;
            var box = carden(art, chalk.black(`Logged in as ${client.user.tag} (${chalk.green(client.user.id)})\n\nCommands: ${chalk.black(global.commands)}\nAliases: ${chalk.black(global.aliases)}\nEvents: ${chalk.black(totalEvents)}\nCreated By: ${chalk.black("Pluto's World")}\nFor support ${chalk.red("https://plutothe.dev/discord")}\n\nOperating System: ${operating}\nProcess PID: ${process.pid}\nDiscord.js Version: ${djsVer}\nNode Version: ${process.version.replace("v","")}`), { borderColor: "yellow", borderStyle: "bold", padding: 1, backgroundColor: "black", header: { backgroundColor: "black" }, content: { backgroundColor: "white" } });
            return console.log(box);
        });
    }
};