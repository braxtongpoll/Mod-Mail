module.exports = async(client) => {
    require("../src/functions/start").prompt(client);
    require("../src/functions/utils").initDB(client);
    goCheckDocuments(client)
    client.user.setPresence({
        activity: {
            type: "PLAYING",
            name: client.config["status message"]
        }
    });
};

function goCheckDocuments(client) {
    client.checkForDocument(client);
    setTimeout(() => {
        goCheckDocuments(client);
    }, 3600000);
}