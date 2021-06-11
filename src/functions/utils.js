function initDB(client) {
    mongoose.connect(client.config.mongoLink, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }, err => {
        if (err) return console.log(`Fuck ${err.stack}`);
        if (!err) return console.log(success, `Mongo Connection Secured`)
    });
}
err => {
    if (err) console.log(`Failed to init mongoDB ${err.stack}`)
}