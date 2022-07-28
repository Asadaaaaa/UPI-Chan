module.exports = server => {
    server.client.eventsHandler = function() {
        let eventsDir = "./src/events/"
        let eventFiles = server.modules.fs.readdirSync(eventsDir).filter((files) => files.endsWith(".js"));
        for(let file of eventFiles) {
            if(file !== "EventsHandler.js") {
                const event = require("./" + file);
                server.client.on(event.name, eventDo => { event.execute(server, eventDo) });
            }
        }
    };
};