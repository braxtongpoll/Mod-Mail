const path = require("path");const express = require("express");const bodyParser = require('body-parser');const multer = require('multer');const passport = require('passport');const session  = require('express-session');var DiscordStrategy = require('passport-discord-faxes').Strategy;const config = require("../config/config.json");const fs = require('fs');
module.exports = async function(client, app, connection) {
    app.set("views", path.join(__dirname, "../", "views"));
    var multerStorage = multer.memoryStorage()
    app.use(multer({ storage: multerStorage }).any());
    app.use(express.static(path.join(__dirname, "../", "public")));
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 31556952000},
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.set('view engine', 'ejs');

    function loop() {
        connection.ping();
        setTimeout(() => loop(), 60000 * 30);
    };

    // Discord Login
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    app.get('/auth/discord', passport.authenticate('discord'));
    app.get('/auth/discord/callback', passport.authenticate('discord', {failureRedirect: '/'}), async function(req, res) {
        req.session?.loginRef ? res.redirect(req.session.loginRef) : res.redirect('/');
        delete req.session?.loginRef
    });
    passport.use(new DiscordStrategy({
        clientID: config.discord.oauthId,
        clientSecret: config.discord.oauthToken,
        callbackURL: `${(config.domain.endsWith('/') ? config.domain.slice(0, -1) : config.domain)}/auth/discord/callback`,
        scope: ['identify', 'guilds', 'email'],
        prompt: 'consent'
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
    app.get("/", async function(req, res) {
        res.render("index", { config: config });
    });
    require("../api")
    let getFiles = await fs.readdirSync(path.join(__dirname, "../", "api/", "get"));
    for (let file of getFiles) {
        require(`../api/get/${file}`)(client, app, connection);
    };
    let postFiles = await fs.readdirSync(path.join(__dirname, "../", "api/", "post"));
    for (let file of postFiles) {
        require(`../api/post/${file}`)(client, app, connection);
    };
};