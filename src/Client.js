if (Number(process.version.slice(1).split(".")[0] < 12)) throw new Error(`Node.js 12.0.0 is required, Discord.JS relies on this version, please update @ https://nodejs.org`);
const { Client, Collection, MessageEmbed } = require('discord.js');
const path = require('path');
const { readdirSync } = require('fs');
var num = 0;
const symbols = require(`log-symbols`);
const config = require(`../config/config.json`);
class ModMail extends Client {
    constructor(options) {
        super(options);
        this.config = config;
        this.commands = new Collection();
        this.aliases = new Collection();
        this.data = require("./schemas/datas");
        this.checkForDocument = async(client) => {
            client.guilds.cache.forEach(guild => {
                client.data.findById(guild.id, async function(_err, res) {
                    if (res == null) {
                        return client.data.create({
                            _id: `${guild.id}`
                        }).then(() => {
                            return console.log(symbols.warning, `I was invited to ${guild.name} while offline. I added them to the database.`).then(a => a.delete({ timeout: 5000 }))
                        }).catch(() => {})
                    }
                });
            });
        };
        this.docUpdate = async(message, document, newData, replyText) => {
            this.data.findByIdAndUpdate(message.guild.id, {
                [`${document}`]: newData
            }).then(() => {
                return message.reply(replyText)
            }).catch(e => { return message.reply(`An error accured: ${e.stack}`) });
        };
    };
};

const client = new ModMail({
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

const init = async() => {
    var totalLoaded = 0;
    readdirSync(path.join(__dirname, `../`, 'commands')).forEach(dir => {
        const commands = readdirSync(path.join(__dirname, `../`, `commands/`, `${dir}`)).filter(f => f.endsWith('.js'));

        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.info.name) {
                client.commands.set(pull.info.name, pull)
                totalLoaded++;
            } else {
                console.log(`Failed to load a command.`)
                continue;
            }
            if (pull.info.aliases) {
                try {
                    pull.info.aliases.forEach(alias => {
                        client.commands.set(alias, pull);
                    })
                } catch (e) {}
            }
        }
    });

    const events = await readdirSync(path.join(__dirname, `../`, 'events'))
    events.forEach(e => {
        const name = e.split('.')[0];
        const event = require(`../events/${e}`)
        client.on(name, event.bind(null, client));
        delete require.cache[require.resolve(`../events/${e}`)]
    })
    if (events.length === 0) console.warn(`No event files found to load.`)
    global.cmdsLoaded = totalLoaded;
    global.evnsLoaded = events.length;

    client.login(config.token).catch(e => console.log(`Failed to login [${e}]`))
}
client.on('disconnect', () => client.logger.warn(`Connection the Discord API lost, attempting to reconnect.`)).on('reconnecting', () => client.logger.log(`Attempting API reconnection.`))
client.on(`error`, e => client.logger.log(e)).on(`warn`, w => client.logger.warn(w))

exports.init = init;