const server = {
    user: {
        messageSession: {}
    },
    data: {},
    modules: {
        discordJS: require("discord.js"),
        fs: require("fs"),
        yml: require("js-yaml"),
        MongoDB: require("mongodb")
    },
    dataTemp: {},
    errMsgHandler: (server, message, err) => {
        console.log("\n[Console] Error Catched:\n" + err);
        message.channel.messages.fetch(message.id).catch(() => {
            console.log("Message Doesn't Exist");
            message.channel.send({
                content: "\u200B",
                embeds: [{
                    color: "0xD0342C",
                    author: {
                        name: message.author.username + "#" + message.author.discriminator,
                        icon_url: message.author.avatarURL()
                    },
                    thumbnail: {
                        url: "https://i.ibb.co/p2c0rLg/Warning.png"
                    },
                    description: "Something went wrong!, your session has been ended. You can start again.",
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    }
                }]
            });
            delete server.user.messageSession[message.channel.id][message.author.id];
            if(server.user.messageSession[message.channel.id][message.author.id].session.data.timeout._destroyed === false) clearInterval(server.user.messageSession[message.channel.id][message.author.id].session.data.timeout);
        });
    },
    async getDatabaseData(collection) {
        let dataBase = await server.dataBase.db("DiscordBot").collection(collection);
        let data = dataBase.findOne({});

        return data;
    },
    async saveDatabaseData(collection, newData) {
        let dataBase = await server.dataBase.db("DiscordBot").collection(collection);
        let currentData = dataBase.findOne({});
        await dataBase.replaceOne(currentData, newData);
        return;
    }
};

const { Client, Intents } = server.modules.discordJS;
server.client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

require("./utils/SaveDataFile.js")(server);
require("./utils/GetDataFile.js")(server);
require("./utils/ConfigFileHandler.js")(server);

require("./events/EventsHandler.js")(server);

(async () => {
    server.client.eventsHandler();

    if(server.configs.token === "") {
        console.log("[Console]: Token can't be empty");
        return;
    }
    server.dataBase = await new server.modules.MongoDB.MongoClient("mongodb://uktjaya:mahasiswabudiman@cluster0-shard-00-00.q5ruc.mongodb.net:27017,cluster0-shard-00-01.q5ruc.mongodb.net:27017,cluster0-shard-00-02.q5ruc.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-b64ifr-shard-0&authSource=admin&retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }).connect();
    await server.client.login(server.configs.token).catch(err => console.log("\n[Console] Error Catched:\n" + err));
})();