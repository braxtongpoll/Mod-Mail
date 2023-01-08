const chalk = require('chalk');const figlet = require(`figlet`);const config = require("../../../config/config.json");
module.exports = async function(client) {
    console.log(chalk.bold.italic.blueBright(`Connecting to discord...`));
    setTimeout(() => {
        figlet.text(`Mod Mail`, async function(err, art) {
            await console.log(chalk.bold.blue(art) + "\n" + "━━━━━━━━━━━━━━ Info ━━━━━━━━━━━━━━");
            await logger("Created by Pluto's World at https://plutos.world", "INFO");
            logger(`${client.commands.size + client.subCommands.size + client.contextMenus.size + client.events.size + client.buttons.size + client.selectMenus.size + client.buttons.size} Interactions registered`, "INFO");
            logger("Logged in as " + client.user.tag + ` (${client.user.id}) on port ${config.port}`, "SUCCESS");
            logger(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`, "INVITE");
            console.log("━━━━━━━━━━━━━ Modules ━━━━━━━━━━━━")
            for (let module of client.modules) {
                let moduleConfig = require(`../../../modules/${module}/config/config.json`);
                let moduleVersion = require(`../../../modules/${module}/src/data.json`).version;
                console.log(`${(moduleConfig.module_active) ? chalk.bold.green(`[ ${module} ]`) : chalk.bold.red(`[ ${module} ]`)}: ${moduleVersion}`);
            };
        });
    }, 3000);
};

let logger = function(message, type, location) {
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
                console.log(chalk.bold.white("[ LOG ]") + `: ${message}\n` + chalk.white("Location") + `: ${location}`);
            } else {
                console.log(chalk.bold.white("[ LOG ]") + `: ${message}`);
            };
            break;
    };
};