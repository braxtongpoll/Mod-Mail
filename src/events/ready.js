module.exports = async(client) => {
    await require("../structure/client/updatemanager")(client);
    if (!client.application) await client.application.fetch();
    client.user.setPresence({
        activities: [client.config.bot_presence.activities[0]],
        status: (!client.config.bot_presence.activities[0].url) ? client.config.bot_presence.status.toLowerCase() : "streaming"
    });
    status(client);
    client.commands.forEach(async function(command) {
        client.application.commands.create(command.info).catch(function(e) { console.log(e)});
    });
};

let i = 0;

function status(client) {
    if (i == client.config.bot_presence.activities.length) i = 0;
    if (typeof client.config.bot_presence.activities[i].type == "string") client.config.bot_presence.activities[i].type = activityTypes[client.config.bot_presence.activities[i].type];
    client.user.setPresence({
        activities: [client.config.bot_presence.activities[i]],
        status: (!client.config.bot_presence.activities[i].url) ? client.config.bot_presence.status.toLowerCase() : "streaming"
    });
    i++;
    setTimeout(() => status(client), 120000); 
};

let activityTypes = {
    "PLAYING": 0,
    "STREAMING": 1,
    "LISTENING": 2,
    "WATCHING": 3,
    "COMPETING": 5
};