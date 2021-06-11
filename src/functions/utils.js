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
}


exports.initDB = initDB;