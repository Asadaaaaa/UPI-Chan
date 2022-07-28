module.exports = {
    name: "ready",
    async execute(server, onReady) {
        const client = server.client;
        const channel = client.channels.cache.get(server.configs.logs);
        let backupCount = 1;
        setInterval(() => {
            client.user.setActivity(server.configs.prefix);
            // client.user.setActivity("Maintenance");
        }, 3000);
        
        /*setInterval(async() => {
            await client.channels.cache.get("940612865784709190").send({
                content: "Backup " + backupCount,
                files: [
                    "./client_data/data/AssignmentsData.json"
                ]
            });
            backupCount++;
        }, 21600000);*/
        
        console.log("[Console]: Login as " + client.user.tag); 
        channel.send("UPI'Chan is Online!");
        // require("../other/UKTBDay-Automation.js")(server);
        //require("../other/UPI-Fess.js")(server);
    }
};
