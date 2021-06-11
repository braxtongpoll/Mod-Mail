module.exports = async(client) => {
    require("../src/functions/start").prompt(client);
    require("../src/functions/utils").initDB(client);
};