const config = require("../../config/config.json");
module.exports = function(client, app, connection) {
    app.get("/view/:id", async function(req, res) {
        let id = req.params.id;
        if(req.isAuthenticated()) {
            connection.query(`SELECT * FROM mail WHERE id = ${Number(id)};`, function(err, result) {
                if (!result?.length) return res.render("404", { config: client.config, error: "I was unable to find a mail transcript under that ID." });
                client.db.query(`SELECT * FROM messages WHERE mail = ${Number(id)};`, function(err, messages) {
                    client.db.query(`SELECT * FROM users;`, function(err, users) {
                        viewMail(client, req, res, result, messages, users)
                    });
                });
            });
        } else {
            req.session.loginRef = req.path;
            res.redirect('/auth/discord');
        };
    });
};

function viewMail(client, req, res, result, messages, users) {
    let guild = client.guilds.cache.get(client.config.guild);
    let perm = false;
    if (result[0].createdBy == req.user.id) perm = true;
    let member = guild.members.cache.get(req.user.id);
    let user = client.users.cache.get(result[0].createdBy);
    console.log(member)
    for (let id of client.config["support roles"]) {
        let role = guild.roles.cache.get(id);
        if (member._roles.includes(id)) perm = true;
    };
    if (perm == false) return res.render("401", { error: "You do not have sufficient permission to view this page.", config: client.config });
    let userData = {};
    for (let user of users) {
        userData[user.userid] = {
            username: user.username,
            iconURL: user.logo
        };
    };
    if (result.length) res.render("viewmail", { config: client.config, users: userData, messages: messages, data: result[0], user: user });
};