const DataFileHandler = require("./DataFileHandler");

class GetDataFile extends DataFileHandler{
    constructor(filePath, fileType) {
        super(filePath, fileType);

        return this.fileHandler();
    }

    fileHandler() {
        if(!this.fs.existsSync(this.dataFolder)) throw new Error("Directory doesn't exist");
        if(!this.fs.existsSync(this.filePath)) throw new Error("File doesn't exist");

        let fileContent = this.fs.readFileSync(this.filePath, err => {
            if (err) throw err;
        });
        switch(this.fileType) {
            case "YAML": {
                let objYAML = this.yml.load(fileContent);
                return objYAML;
            }

            case "JSON": {
                return JSON.parse(fileContent);
            }

            default: {
                throw new Error("Unable to recognize file type");
            }
        }
    }
}

module.exports = (server) => {
    server.data.get = function(filePath, FileType) {
        return new GetDataFile(filePath, FileType);
    };
}