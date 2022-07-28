const DataFileHandler = require("./DataFileHandler");

class SaveDataFile extends DataFileHandler{
    constructor(filePath, fileData, fileType) {
        super(filePath, fileType);
        
        this.fileData = fileData;

        this.fileHandler();

        return;
    }

    fileHandler() {
        switch(this.fileType) {
            case "YAML": {
                let strYAML =  this.yml.dump(this.fileData);
                this.fs.writeFileSync(this.filePath, strYAML, err => {
                    if (err) console.log("Error writing file:", err);
                });
                return;
            }

            case "JSON": {
                let strJSON = JSON.stringify(this.fileData, null, 2); 
                this.fs.writeFileSync(this.filePath, strJSON, err => {
                    if (err) console.log("Error writing file:", err);
                });
                return;
            }

            default: {
                throw new Error("Unable to recognize file type");
            }
        }
    }
}

module.exports = (server) => {
    server.data.save = function(filePath, fileData, fileType) {
        new SaveDataFile(filePath, fileData, fileType);
    };
};