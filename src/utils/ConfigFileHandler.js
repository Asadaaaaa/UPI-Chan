const DataFileHandler =  require("./DataFileHandler");

class ConfigFileLoader extends DataFileHandler{
    constructor() {
        super("");
        
        this.resourceFolder = "./src/resources/";
        let resourceFile = this.fs.readdirSync(this.resourceFolder);
        for(let file of resourceFile) {
            let filePath = this.filePath + file;
            if(!this.fs.existsSync(filePath)) {
                this.fs.copyFile(this.resourceFolder + file, (this.filePath + file), (err) => {
                    if (err) throw err;
                });
            }
        }
    }
}

module.exports = (server) => {
    new ConfigFileLoader();
    server.configs = server.data.get("config.yml", "YAML");
};