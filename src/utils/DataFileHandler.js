class DataFileHandler{
    constructor(filePath, fileType) {
        this.dataFolder = "./client_data/";
        this.filePath = this.dataFolder + filePath;
        this.fileType = fileType;
        this.fs = require("fs");
        this.yml = require("js-yaml");

        this.folderHandler(this.fs);

        return;
    }

    folderHandler(fs) {
        if(!fs.existsSync(this.dataFolder)) {
            fs.mkdirSync(this.dataFolder);
        }
        return;
    }
}

module.exports = DataFileHandler;