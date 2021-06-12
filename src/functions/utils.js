const mongoose = require("mongoose")

function initDB(client) {
    mongoose.connect(client.config["mongo database link"], {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }, err => {
        if (err) return console.log(`There was an error connecting to mongoDB. ${err.stack}`);
    });
}
err => {
    if (err) console.log(`Failed to init mongoDB ${err.stack}`)
};

async function findChannel(message, args) {
    let channel;
    if (message.mentions.channels.first()) {
        channel = message.mentions.channels.first();
    } else {
        channel = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name === args.join(" "))
    };
    return channel;
};

exports.findChannel = findChannel;
exports.initDB = initDB;