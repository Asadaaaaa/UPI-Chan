module.exports = {
    name: "messageCreate",
    async execute(server, onMessage) {
        let prefix = server.configs.prefix;
        let session = server.user.messageSession;

        // Message Handler
        if (onMessage.author.bot) return;
        if (!onMessage.content.startsWith(prefix)) {
            if (session[onMessage.channel.id] === undefined) {
                return;
            } else if (session[onMessage.channel.id][onMessage.author.id] === undefined) {
                return;
            }
        }
        
        require("./menu/MenuHandler.js")(server, onMessage);
    }
}