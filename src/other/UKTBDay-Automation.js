module.exports = (server) => {
    const app = {
        client: {},
        module: {
            Instagram: require("instagram-web-api"),
            FS: require("fs"),
            FileCookieStore: require("tough-cookie-filestore2"),
            MongoDB: require("mongodb")
        },
        main: async (server) => {
    
            app.dataBase = await new app.module.MongoDB.MongoClient("mongodb://uktjaya:mahasiswabudiman@cluster0-shard-00-00.q5ruc.mongodb.net:27017,cluster0-shard-00-01.q5ruc.mongodb.net:27017,cluster0-shard-00-02.q5ruc.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-b64ifr-shard-0&authSource=admin&retryWrites=true&w=majority", {
                useNewUrlParser: true,
                useUnifiedTopology: true 
            }).connect();
    
            const cookieStore = new app.module.FileCookieStore('./client_data/uktbday-automation/cookies.json')
            let configsData = app.getConfigs();
            let username = configsData.username
            let password = configsData.password
            app.client = new app.module.Instagram({username, password, cookieStore})
    
            const { authenticated, user } = await app.client.login()
            if(authenticated == true) {
                console.log("Login Success");
            } else {
                console.log("Login Failed");
                return;
            }
    
            let profile = await app.client.getProfile()
            
            console.log(" - Username: " + profile.username);
            console.log(" - Email: " + profile.email);
            
            app.automation(server);
            return;
        },
        getConfigs: () => {
            let configFile = app.module.FS.readFileSync("./client_data/uktbday-automation/config.json", err => {
                if (err) throw err;
            });
            
            return JSON.parse(configFile);
        },
        automation: async (server) => {
            const db = app.dataBase.db("BDay-Automation").collection("bioData");
            console.log("\nBirthday Automation Starting...\n\n");
    
            while(true) {
                let currentDateTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
                let currentYear = currentDateTime.getFullYear();
                let currentMonth = currentDateTime.getMonth() + 1;
                let currentDate = currentDateTime.getDate();
                let documentData = await db.findOne({});
                let bioData = documentData.bioData;
    
                for(let i in bioData) {
                    if(bioData[i].celebration.isCeleb == true) {
                        if(bioData[i].celebration.year === currentYear) {
                            if(bioData[i].bDay.month === currentMonth && bioData[i].bDay.day === currentDate) {
                                let yearData = "bioData." + i + ".celebration.year"
                                console.log("Birth Day person is found!")
                                console.log("Happy Birthday!, " + bioData[i].name)
                                if(bioData[i].celebration.isCeleb == true) {
                                    let discordChannel = server.client.channels.cache.get("931124152339943464");
                                    discordChannel.send("***Birthday person is detected!*** :partying_face:\n[@here]\n\n>>> Happy Birthday!, " + bioData[i].name + " :tada: :tada: :tada:\n\nDate: " + currentDateTime.toLocaleString());
                                    if(bioData[i].celebration.imgURL !== "") {
                                        let image = bioData[i].celebration.imgURL;
                                        let isErr = false;
                                        console.log("Uploading Instagram Story...");
                                        try{
                                            await app.client.uploadPhoto({ photo: image, caption: '', post: 'story' });
                                        }catch(err) {
                                            isErr = true;
                                        }
                                        if(isErr == true) {
                                            console.log("Upload IGStory Failed...")
                                        } else if(isErr == false) {
                                            console.log("Upload IGStory Success...")
                                        }
                                    }
                                }
                                console.log("Date: " + currentDateTime.toLocaleString() + "\n\n");
                                await db.updateOne({"document": "bioData"}, {$inc: {[yearData]: 1}});
                            }
                        }
                    }
                }
            }
            return
        }
    }
    app.main(server);
}
