class AssignmentsList{
    
    constructor(server, message) {
        this.server = server;
        this.message = message;

        this.channel = this.message.channel;
        this.user = this.message.author;
        this.messageSession = this.server.user.messageSession;
        this.session = this.messageSession[this.channel.id][this.user.id].session;
        this.userProperties = this.session.user;
        this.formMsg = this.messageSession[this.channel.id][this.user.id].formMsg;
    }    
};

class MainMenu extends AssignmentsList{

    constructor(server, message) {
        super(server, message);

        this.menu();
    }

    async menu() {
        if(this.message.content === undefined) {
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "\u200B",
                embeds: [{
                    color: "0xFFC600",
                    title: "Home/Assignments List/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Choose one of the menus by sending a message according to the menu numbers below",
                    fields: [
                        { name: "\u200B", value: "Choose" },
                        { name: "〔１〕View", value: "────────────────────" },
                        { name: "〔２〕Manage", value: "────────────────────" }
                    ],
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    },
                }],
                components: [this.formMsg.row] 
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));

            this.session.data.timeout = setTimeout(async () => {
                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                delete this.messageSession[this.channel.id][this.user.id];
            }, this.server.configs.formTimeout * 1000);

            this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                filter: async interaction => {
                    if(interaction.user.id === this.user.id) {
                        switch(interaction.customId) {
                            case "1-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
        
                            case "2-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                delete this.messageSession[this.channel.id][this.user.id];
                                return true;
                            }
        
                            case "3-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
                        }
                    } else {
                        interaction.reply({
                            content: "This button isn't for you",
                            ephemeral: true
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                },
                max: 1,
                time: (this.server.configs.formTimeout * 1000)
            });
        } else {
            switch(this.message.content) {
                case "1": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu1"
                        new Menu1(this.server, this.message).menu1();
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "2": {
                    if(this.message.member.permissions.has("ADMINISTRATOR") || this.server.configs.permissions.developers.includes(this.user.id)) {
                        this.message.content = undefined;
                        await this.formMsg.properties.edit({
                            content: "Loading...",
                            embeds: []
                        }).then(() => {
                            clearTimeout(this.session.data.timeout);
                            this.session.data.collector.stop();
                            this.session.data["AssignmentsList"].menu = "Menu2";
                            new Menu2(this.server, this.message).mainMenu();
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    } else {
                        this.formMsg.properties.embeds[0].color = "0xD0342C";
                        this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You don't have permission to do that!\n\u200B";
                        this.formMsg.properties.edit({
                            embeds: this.formMsg.properties.embeds
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    }
                    return;
                }

                default: {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }
            }
        }
        return;
    }
};

class Menu1 extends AssignmentsList{

    constructor(server, message) {
        super(server, message);
        return;
    }

    async menu1() {
        if(this.message.content === undefined) {
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "\u200B",
                embeds: [{
                    color: "0xFFC600",
                    title: "Home/Assignment List/View/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Choose one of the menus by sending a message according to the menu numbers below",
                    fields: [
                        { name: "\u200B", value: "Choose Class:" },
                        { name: "〔１〕Class A", value: "────────────────────" },
                        { name: "〔２〕Class B", value: "────────────────────" }
                    ],
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    },
                }],
                components: [this.formMsg.row] 
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));

            this.session.data.timeout = setTimeout(async () => {
                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                delete this.messageSession[this.channel.id][this.user.id];
            }, this.server.configs.formTimeout * 1000);

            this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                filter: async interaction => {
                    if(interaction.user.id === this.user.id) {
                        switch(interaction.customId) {
                            case "1-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
        
                            case "2-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                delete this.messageSession[this.channel.id][this.user.id];
                                return true;
                            }
        
                            case "3-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                new MainMenu(this.server, this.message);
                                return true;
                            }
                        }
                    } else {
                        interaction.reply({
                            content: "This button isn't for you",
                            ephemeral: true
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                },
                max: 1,
                time: (this.server.configs.formTimeout * 1000)
            });
        } else {
            switch(this.message.content) {
                case "1": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu1_1";
                        this.menu1_class("A");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "2": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu1_2";
                        this.menu1_class("B");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                default: {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }
            }
        }
        return;
    }

    async menu1_class(objClass) {
        if(this.message.content === undefined) {
            let sessionData = this.session.data["AssignmentsList"].data[this.session.data["AssignmentsList"].menu];
            sessionData = [];
            let assignmentsData = await this.server.getDatabaseData("AssignmentsData");

            var assignmentsList = "";
            for (var indexCourse in assignmentsData[objClass]) {
                for (var courseSubject in assignmentsData[objClass][indexCourse]) {
                    assignmentsList += courseSubject + ":";
                    for (var indexAssignments in assignmentsData[objClass][indexCourse][courseSubject]) {
                        assignmentsList += "\n    =- Assignment: " + assignmentsData[objClass][indexCourse][courseSubject][indexAssignments].assignment;
                        assignmentsList += "\n       Deadline: " + assignmentsData[objClass][indexCourse][courseSubject][indexAssignments].deadline;
                    }
                    assignmentsList += "\n\n";
                }
            }

            let assignmentsListChunk = this.chunkSubstr(assignmentsList, 1950);

            for(let index in assignmentsListChunk) {
                let msg;
                if(index == 0) {
                    msg = await this.message.channel.send(":information_source: <@" + this.message.author.id + ">:\n```\n" + assignmentsListChunk[index] + "\n```");
                } else {
                    msg = await this.message.channel.send("\u200B\n```\n" + assignmentsListChunk[index] + "\n```");
                }
                sessionData.push(msg);
            }

            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
            this.formMsg.properties = await this.message.channel.send({
                content: "\u200B",
                embeds: [{
                    color: "0xFFC600",
                    title: "../Assignment List/View/Class A/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "The Assignments List for Class A is above this menu",
                    fields: [
                        {
                            name: "\u200B",
                            value: "Use the button below to go to the previous page"
                        }
                    ],
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    },
                }],
                components: [this.formMsg.row] 
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));

            this.session.data.timeout = setTimeout(async () => {
                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                for(let indexMsg in sessionData) {
                    await sessionData[indexMsg].delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                }
                sessionData.filter(Boolean);
                delete this.messageSession[this.channel.id][this.user.id];
            }, this.server.configs.formTimeout * 1000);

            this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                filter: async interaction => {
                    if(interaction.user.id === this.user.id) {
                        switch(interaction.customId) {
                            case "1-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                for(let indexMsg in sessionData) {
                                    await sessionData[indexMsg].delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                }
                                sessionData.filter(Boolean);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
        
                            case "2-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                for(let indexMsg in sessionData) {
                                    await sessionData[indexMsg].delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                }
                                sessionData.filter(Boolean);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                delete this.messageSession[this.channel.id][this.user.id];
                                return true;
                            }
        
                            case "3-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                for(let indexMsg in sessionData) {
                                    await sessionData[indexMsg].delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                }
                                sessionData.filter(Boolean);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "Menu1";
                                new Menu1(this.server, this.message).menu1();
                                return true;
                            }
                        }
                    } else {
                        interaction.reply({
                            content: "This button isn't for you",
                            ephemeral: true
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                },
                max: 1,
                time: (this.server.configs.formTimeout * 1000)
            });
        } else {
            this.formMsg.properties.embeds[0].color = "0xD0342C";
            this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
            this.formMsg.properties.edit({
                embeds: this.formMsg.properties.embeds
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
            return;
        }
        return;
    }

    chunkSubstr(str, size) {
        const numChunks = Math.ceil(str.length / size)
        const chunks = new Array(numChunks)
      
        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
          chunks[i] = str.substr(o, size)
        }
      
        return chunks
    }
};

class Menu2 extends AssignmentsList{
    
    constructor(server, message) {
        super(server, message);
        return;
    }

    async mainMenu() {
        if(this.message.content === undefined) {
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "\u200B",
                embeds: [{
                    color: "0xFFC600",
                    title: "Home/Assignments List/Manage/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Choose one of the menus by sending a message according to the menu numbers below",
                    fields: [
                        { name: "\u200B", value: "Choose Class:" },
                        { name: "〔１〕Add Course Subject", value: "────────────────────" },
                        { name: "〔２〕Delete Course Subject", value: "────────────────────" },
                        {  name: "〔３〕Add Assignment",  value: "────────────────────" },
                        { name: "〔４〕Delete Assignment", value: "────────────────────" },
                        { name: "〔５〕Announce Assignments",  value: "────────────────────" }
                    ],
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    },
                }],
                components: [this.formMsg.row] 
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));

            this.session.data.timeout = setTimeout(async () => {
                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                delete this.messageSession[this.channel.id][this.user.id];
            }, this.server.configs.formTimeout * 1000);

            this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                filter: async interaction => {
                    if(interaction.user.id === this.user.id) {
                        switch(interaction.customId) {
                            case "1-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
        
                            case "2-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                delete this.messageSession[this.channel.id][this.user.id];
                                return true;
                            }
        
                            case "3-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                new MainMenu(this.server, this.message);
                                return true;
                            }
                        }
                    } else {
                        interaction.reply({
                            content: "This button isn't for you",
                            ephemeral: true
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                },
                max: 1,
                time: (this.server.configs.formTimeout * 1000)
            });
        } else {
            switch(this.message.content) {
                case "1": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu2_1";
                        this.menu2_1("");
                        return;
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "2": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu2_2";
                        this.menu2_2("");
                        return;
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }
                
                case "3": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "menu2_3";
                        this.menu2_3();
                        return;
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "4": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu2_4";
                        this.Menu2_4();
                        return;
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "5": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu2_5";
                        this.menu2_5();
                        return;
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                default: {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }
            }
        }
        return;
    }

    async menu2_1(info) {
        let assignmentsData = await this.server.getDatabaseData("AssignmentsData");
        if(this.message.content === undefined) {
            let courseList = "";

            for(let courseIndex in assignmentsData.A) {
                for(let courseSubject in assignmentsData.A[courseIndex]) {
                    courseList += courseSubject + " (Id: " + courseIndex + ")\n";
                }
            }

            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "Course List:\n```" + courseList + "```",
                embeds: [{
                    color: "0xFFC600",
                    title: "../Manage/Add Course Subject/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "The Course Subject List is above this menu",
                    fields: [
                        {
                            name: "\u200B" + info,
                            value: "Add Course by sending a message containing the course subject"
                        }
                    ],
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    },
                }],
                components: [this.formMsg.row] 
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));

            this.session.data.timeout = setTimeout(async () => {
                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                delete this.messageSession[this.channel.id][this.user.id];
            }, this.server.configs.formTimeout * 1000);

            this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                filter: async interaction => {
                    if(interaction.user.id === this.user.id) {
                        switch(interaction.customId) {
                            case "1-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
        
                            case "2-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                delete this.messageSession[this.channel.id][this.user.id];
                                return true;
                            }
        
                            case "3-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "Menu2";
                                new Menu2(this.server, this.message).mainMenu();
                                return true;
                            }
                        }
                    } else {
                        interaction.reply({
                            content: "This button isn't for you",
                            ephemeral: true
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                },
                max: 1,
                time: (this.server.configs.formTimeout * 1000)
            });
        } else {
            let messageContent = this.message.content;
            
            if(!/^[A-Za-z\s]*$/.test(messageContent)) {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Courses can only contain letters and spaces!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return
            }
            
            for(let classes in assignmentsData) {
                let obj = {};
                obj[this.message.content] = [];
                if(classes !== "_id") {
                    assignmentsData[classes].push(obj);
                }
            }
            
            await this.server.saveDatabaseData("AssignmentsData", assignmentsData);

            await this.formMsg.properties.edit({
                content: "Loading...",
                embeds: []
            }).then(() => {
                clearTimeout(this.session.data.timeout);
                this.message.content = undefined;
                this.session.data.collector.stop();
                this.session.data["AssignmentsList"].menu = "Menu2_1";
                this.menu2_1("\n:information_source: Successfully added course " + messageContent + "\n\u200B");
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
            return;
        }
        return;
    }

    async menu2_2(info) {
        let assignmentsData = await this.server.getDatabaseData("AssignmentsData");;
        if(this.message.content === undefined) {
            let courseList = "";
            
            for(let courseIndex in assignmentsData.A) {
                for(let courseSubject in assignmentsData.A[courseIndex]) {
                    courseList += courseSubject + " (Id: " + courseIndex + ")\n";
                }
            }
            if(courseList === "") courseList = "Course List is Empty";
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "Course List:\n```" + courseList + "```",
                embeds: [{
                    color: "0xFFC600",
                    title: "../Manage/Delete Course Subject/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "The Course Subject List is above this menu",
                    fields: [
                        {
                            name: "\u200B" + info,
                            value: "Delete Course by sending a message containing the course Id"
                        }
                    ],
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    },
                }],
                components: [this.formMsg.row] 
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));

            this.session.data.timeout = setTimeout(async () => {
                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                delete this.messageSession[this.channel.id][this.user.id];
            }, this.server.configs.formTimeout * 1000);

            this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                filter: async interaction => {
                    if(interaction.user.id === this.user.id) {
                        switch(interaction.customId) {
                            case "1-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
        
                            case "2-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                delete this.messageSession[this.channel.id][this.user.id];
                                return true;
                            }
        
                            case "3-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "Menu2";
                                new Menu2(this.server, this.message).mainMenu();
                                return true;
                            }
                        }
                    } else {
                        interaction.reply({
                            content: "This button isn't for you",
                            ephemeral: true
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                },
                max: 1,
                time: (this.server.configs.formTimeout * 1000)
            });
        } else {
            let messageContent = this.message.content;

            if(isNaN(messageContent)) {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            } else if(assignmentsData.A[messageContent] === undefined) {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Course id " + messageContent + " is not exist!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            }
            let courseSubject = Object.keys(assignmentsData.A[messageContent]);
            for(let classes in assignmentsData) {
                if(classes !== "_id") {
                    assignmentsData[classes].splice(messageContent, 1);
                }
            }
            await this.server.saveDatabaseData("AssignmentsData", assignmentsData);

            await this.formMsg.properties.edit({
                content: "Loading...",
                embeds: []
            }).then(() => {
                clearTimeout(this.session.data.timeout);
                this.message.content = undefined;
                this.session.data.collector.stop();
                this.session.data["AssignmentsList"].menu = "Menu2_2";
                this.menu2_2("\n:information_source: Successfully delete course " + courseSubject + "\n\u200B");
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
            return;
        }
        return;
    }

    async menu2_3() {
        if(this.message.content === undefined) {
            this.session.data["AssignmentsList"].data["Menu2_3_addAssign"] = {
                className: undefined,
                courseId: undefined,
                assignment: undefined,
                deadline: undefined
            };
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "\u200B",
                embeds: [{
                    color: "0xFFC600",
                    title: "../Assignment List/Manage/Add Assignment/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Choose one of the menus by sending a message according to the menu numbers below",
                    fields: [
                        { name: "\u200B", value: "Choose Class:" },
                        { name: "〔１〕Class A", value: "────────────────────" },
                        { name: "〔２〕Class B", value: "────────────────────" }
                    ],
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    },
                }],
                components: [this.formMsg.row] 
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));

            this.session.data.timeout = setTimeout(async () => {
                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                delete this.messageSession[this.channel.id][this.user.id];
            }, this.server.configs.formTimeout * 1000);

            this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                filter: async interaction => {
                    if(interaction.user.id === this.user.id) {
                        switch(interaction.customId) {
                            case "1-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
        
                            case "2-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                delete this.messageSession[this.channel.id][this.user.id];
                                return true;
                            }
        
                            case "3-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "Menu2";
                                this.mainMenu();
                                return true;
                            }
                        }
                    } else {
                        interaction.reply({
                            content: "This button isn't for you",
                            ephemeral: true
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                },
                max: 1,
                time: (this.server.configs.formTimeout * 1000)
            });
        } else {
            switch(this.message.content) {
                case "1": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu2_3_addAssign";
                        this.session.data["AssignmentsList"].data["Menu2_3_addAssign"].className = "A";
                        this.menu2_3_addAssign("");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "2": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu2_3_addAssign";
                        this.session.data["AssignmentsList"].data["Menu2_3_addAssign"].className = "B";
                        this.menu2_3_addAssign("");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                default: {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }
            }
        }
        return;
    }

    async menu2_3_addAssign(info) {
        let assignmentsData = await this.server.getDatabaseData("AssignmentsData");
        let dataAssign = this.session.data["AssignmentsList"].data["Menu2_3_addAssign"];
        let className = dataAssign.className;
        let courseId = dataAssign.courseId;
        if(this.message.content === undefined) {
            if(courseId === undefined) {
                let courseList = "";
                assignmentsData[className].forEach((value, index, arr) => {
                    courseList += Object.keys(value) + " (Id: " + index + ")\n"
                });

                this.formMsg.row.components[0].setDisabled(false);
                this.formMsg.row.components[1].setDisabled(false);
                this.formMsg.row.components[2].setDisabled(false);
                await this.formMsg.properties.edit({
                    content: "Course List:\n```" + courseList + "```",
                    embeds: [{
                        color: "0xFFC600",
                        title: "../Manage/Add Assignment/" + className + "/",
                        author: {
                            name: this.user.username + "#" + this.user.discriminator,
                            icon_url: this.message.author.avatarURL()
                        },
                        description: "The Course Subject List is above this menu",
                        fields: [
                            {
                                name: "\u200B" + info,
                                value: "Choose one of the courses to add assignments by sending a message containing the course Id"
                            }
                        ],
                        footer: {
                            text: "© RPL Muda 2021 | All rights reserved",
                        },
                    }],
                    components: [this.formMsg.row] 
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                this.session.data.timeout = setTimeout(async () => {
                    await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    delete this.messageSession[this.channel.id][this.user.id];
                }, this.server.configs.formTimeout * 1000);
    
                this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                    filter: async interaction => {
                        if(interaction.user.id === this.user.id) {
                            switch(interaction.customId) {
                                case "1-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    this.session.data["AssignmentsList"].menu = "MainMenu";
                                    require("./Home.js")(this.server, this.message);
                                    return true;
                                }
            
                                case "2-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    delete this.messageSession[this.channel.id][this.user.id];
                                    return true;
                                }
            
                                case "3-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    this.session.data["AssignmentsList"].menu = "menu2_3";
                                    this.menu2_3();
                                    return true;
                                }
                            }
                        } else {
                            interaction.reply({
                                content: "This button isn't for you",
                                ephemeral: true
                            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                            return;
                        }
                    },
                    max: 1,
                    time: (this.server.configs.formTimeout * 1000)
                });
                return;
            } else {
                let assignmentsList = Object.keys(assignmentsData[className][courseId]) + ":";
                assignmentsData[className][courseId][Object.keys(assignmentsData[className][courseId])].forEach((value, index, arr) => {
                    assignmentsList += "\n    =- Assignment: " + value.assignment;
                    assignmentsList += "\n       Deadline: " + value.deadline;
                    assignmentsList += "\n       (Id: " + index + ")\n";
                });

                this.formMsg.row.components[0].setDisabled(false);
                this.formMsg.row.components[1].setDisabled(false);
                this.formMsg.row.components[2].setDisabled(false);
                await this.formMsg.properties.edit({
                    content: "Assignments List:\n```" + assignmentsList + "```",
                    embeds: [{
                        color: "0xFFC600",
                        title: "../Manage/Add Assignment/" + className + "/",
                        author: {
                            name: this.user.username + "#" + this.user.discriminator,
                            icon_url: this.message.author.avatarURL()
                        },
                        description: "The Assignments List is above this menu",
                        fields: [
                            {
                                name: "\u200B",
                                value: "Enter the assignment description by sending a message"
                            }
                        ],
                        footer: {
                            text: "© RPL Muda 2021 | All rights reserved",
                        },
                    }],
                    components: [this.formMsg.row] 
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                this.session.data.timeout = setTimeout(async () => {
                    await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    delete this.messageSession[this.channel.id][this.user.id];
                }, this.server.configs.formTimeout * 1000);
    
                this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                    filter: async interaction => {
                        if(interaction.user.id === this.user.id) {
                            switch(interaction.customId) {
                                case "1-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    this.session.data["AssignmentsList"].menu = "MainMenu";
                                    require("./Home.js")(this.server, this.message);
                                    return true;
                                }
            
                                case "2-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    delete this.messageSession[this.channel.id][this.user.id];
                                    return true;
                                }
            
                                case "3-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    this.session.data["AssignmentsList"].menu = "menu2_3";
                                    dataAssign.courseId = undefined;
                                    dataAssign.assignment = undefined;
                                    dataAssign.deadline = undefined;
                                    this.menu2_3();
                                    return true;
                                }
                            }
                        } else {
                            interaction.reply({
                                content: "This button isn't for you",
                                ephemeral: true
                            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                            return;
                        }
                    },
                    max: 1,
                    time: (this.server.configs.formTimeout * 1000)
                });
                return;
            }
        } else {
            if(courseId === undefined) {
                let messageContent = this.message.content;

                if(isNaN(messageContent)) {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                } else if(assignmentsData.A[messageContent] === undefined) {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Course id " + messageContent + " is not exist!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                await this.formMsg.properties.edit({
                    content: "Loading...",
                    embeds: []
                }).then(() => {
                    clearTimeout(this.session.data.timeout);
                    this.message.content = undefined;
                    this.session.data.collector.stop();
                    this.session.data["AssignmentsList"].menu = "Menu2_3_addAssign";
                    dataAssign.courseId = messageContent;
                    this.menu2_3_addAssign("");
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            } else {
                if(dataAssign.assignment === undefined) {
                    dataAssign.assignment = this.message.content;

                    this.formMsg.properties.embeds[0].fields[0].value = "Enter the assignment deadline by sending a message";
                    await this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                } else if(dataAssign.deadline === undefined) {
                    dataAssign.deadline = this.message.content;
                    let courseSubject = Object.keys(assignmentsData[className][courseId]);
                    let obj = {
                        assignment: dataAssign.assignment,
                        deadline: dataAssign.deadline
                    }

                    assignmentsData[className][courseId][courseSubject].push(obj);
                    await this.server.saveDatabaseData("AssignmentsData", assignmentsData);
                    
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu2_3_addAssign";
                        dataAssign.courseId = undefined;
                        dataAssign.assignment = undefined;
                        dataAssign.deadline = undefined;
                        this.menu2_3_addAssign("\n:information_source: Successfully added assignment for course " + courseSubject + "\n\u200B");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }
            }
        }
        return;
    }

    async Menu2_4() {
        if(this.message.content === undefined) {
            this.session.data["AssignmentsList"].data["Menu2_4_delAssign"] = {
                className: undefined,
                courseId: undefined
            };
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "\u200B",
                embeds: [{
                    color: "0xFFC600",
                    title: "../Assignment List/Manage/Delete Assignment/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Choose one of the menus by sending a message according to the menu numbers below",
                    fields: [
                        { name: "\u200B", value: "Choose Class:" },
                        { name: "〔１〕Class A", value: "────────────────────" },
                        { name: "〔２〕Class B", value: "────────────────────" }
                    ],
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    },
                }],
                components: [this.formMsg.row]
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));

            this.session.data.timeout = setTimeout(async () => {
                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                delete this.messageSession[this.channel.id][this.user.id];
            }, this.server.configs.formTimeout * 1000);

            this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                filter: async interaction => {
                    if(interaction.user.id === this.user.id) {
                        switch(interaction.customId) {
                            case "1-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
        
                            case "2-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                delete this.messageSession[this.channel.id][this.user.id];
                                return true;
                            }
        
                            case "3-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "Menu2";
                                this.mainMenu();
                                return true;
                            }
                        }
                    } else {
                        interaction.reply({
                            content: "This button isn't for you",
                            ephemeral: true
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                },
                max: 1,
                time: (this.server.configs.formTimeout * 1000)
            });
        } else {
            switch(this.message.content) {
                case "1": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu2_4_delAssign";
                        this.session.data["AssignmentsList"].data["Menu2_4_delAssign"].className = "A";
                        this.menu2_4_delAssign("");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "2": {
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.message.content = undefined;
                        this.session.data.collector.stop();
                        this.session.data["AssignmentsList"].menu = "Menu2_4_delAssign";
                        this.session.data["AssignmentsList"].data["Menu2_4_delAssign"].className = "B";
                        this.menu2_4_delAssign("");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                default: {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }
            }
        }
        return;
    }

    async menu2_4_delAssign(info) {
        let assignmentsData = await this.server.getDatabaseData("AssignmentsData");
        let dataAssign = this.session.data["AssignmentsList"].data["Menu2_4_delAssign"];
        let className = dataAssign.className;
        let courseId = dataAssign.courseId;
        if(this.message.content === undefined) {
            if(courseId === undefined) {
                let courseList = "";
                assignmentsData[className].forEach((value, index, arr) => {
                    courseList += Object.keys(value) + " (Id: " + index + ")\n"
                });

                this.formMsg.row.components[0].setDisabled(false);
                this.formMsg.row.components[1].setDisabled(false);
                this.formMsg.row.components[2].setDisabled(false);
                await this.formMsg.properties.edit({
                    content: "Course List:\n```" + courseList + "```",
                    embeds: [{
                        color: "0xFFC600",
                        title: "../Manage/Delete Assignment/" + className + "/",
                        author: {
                            name: this.user.username + "#" + this.user.discriminator,
                            icon_url: this.message.author.avatarURL()
                        },
                        description: "The Course Subject List is above this menu",
                        fields: [
                            {
                                name: "\u200B" + info,
                                value: "Choose one of the courses to delete assignments by sending a message containing the course Id"
                            }
                        ],
                        footer: {
                            text: "© RPL Muda 2021 | All rights reserved",
                        },
                    }],
                    components: [this.formMsg.row] 
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                this.session.data.timeout = setTimeout(async () => {
                    await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    delete this.messageSession[this.channel.id][this.user.id];
                }, this.server.configs.formTimeout * 1000);
    
                this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                    filter: async interaction => {
                        if(interaction.user.id === this.user.id) {
                            switch(interaction.customId) {
                                case "1-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    this.session.data["AssignmentsList"].menu = "MainMenu";
                                    require("./Home.js")(this.server, this.message);
                                    return true;
                                }
            
                                case "2-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    delete this.messageSession[this.channel.id][this.user.id];
                                    return true;
                                }
            
                                case "3-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    this.session.data["AssignmentsList"].menu = "Menu2_4";
                                    this.Menu2_4();
                                    return true;
                                }
                            }
                        } else {
                            interaction.reply({
                                content: "This button isn't for you",
                                ephemeral: true
                            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                            return;
                        }
                    },
                    max: 1,
                    time: (this.server.configs.formTimeout * 1000)
                });
                return;
            } else {
                let assignmentsList = Object.keys(assignmentsData[className][courseId]) + ":";
                assignmentsData[className][courseId][Object.keys(assignmentsData[className][courseId])].forEach((value, index, arr) => {
                    assignmentsList += "\n    =- Assignment: " + value.assignment;
                    assignmentsList += "\n       Deadline: " + value.deadline;
                    assignmentsList += "\n       (Id: " + index + ")\n";
                });

                this.formMsg.row.components[0].setDisabled(false);
                this.formMsg.row.components[1].setDisabled(false);
                this.formMsg.row.components[2].setDisabled(false);
                await this.formMsg.properties.edit({
                    content: "Assignments List:\n```" + assignmentsList + "```",
                    embeds: [{
                        color: "0xFFC600",
                        title: "../Manage/Delete Assignment/" + className + "/",
                        author: {
                            name: this.user.username + "#" + this.user.discriminator,
                            icon_url: this.message.author.avatarURL()
                        },
                        description: "The Assignments List is above this menu",
                        fields: [
                            {
                                name: "\u200B",
                                value: "Enter the assignment id to delete assignment by sending a message"
                            }
                        ],
                        footer: {
                            text: "© RPL Muda 2021 | All rights reserved",
                        },
                    }],
                    components: [this.formMsg.row] 
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                this.session.data.timeout = setTimeout(async () => {
                    await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    delete this.messageSession[this.channel.id][this.user.id];
                }, this.server.configs.formTimeout * 1000);
    
                this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                    filter: async interaction => {
                        if(interaction.user.id === this.user.id) {
                            switch(interaction.customId) {
                                case "1-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    this.session.data["AssignmentsList"].menu = "MainMenu";
                                    require("./Home.js")(this.server, this.message);
                                    return true;
                                }
            
                                case "2-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    delete this.messageSession[this.channel.id][this.user.id];
                                    return true;
                                }
            
                                case "3-" + this.session.id: {
                                    interaction.deferUpdate();
                                    clearTimeout(this.session.data.timeout);
                                    await this.formMsg.properties.edit({
                                        content: "Loading...",
                                        embeds: [],
                                        components: []
                                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                    this.session.data["AssignmentsList"].menu = "Menu2_4";
                                    dataAssign.courseId = undefined;
                                    this.Menu2_4();
                                    return true;
                                }
                            }
                        } else {
                            interaction.reply({
                                content: "This button isn't for you",
                                ephemeral: true
                            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                            return;
                        }
                    },
                    max: 1,
                    time: (this.server.configs.formTimeout * 1000)
                });
                return;
            }
        } else {
            let messageContent = this.message.content;
            if(courseId === undefined) {
                if(isNaN(messageContent)) {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                } else if(assignmentsData.A[messageContent] === undefined) {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Course id " + messageContent + " is not exist!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                await this.formMsg.properties.edit({
                    content: "Loading...",
                    embeds: []
                }).then(() => {
                    clearTimeout(this.session.data.timeout);
                    this.message.content = undefined;
                    this.session.data.collector.stop();
                    this.session.data["AssignmentsList"].menu = "Menu2_4_delAssign";
                    dataAssign.courseId = messageContent;
                    this.menu2_4_delAssign("");
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            } else {
                let courseSubject = Object.keys(assignmentsData.A[courseId])
                
                if(isNaN(messageContent)) {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                } else if(assignmentsData.A[courseId][courseSubject][messageContent] === undefined) {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Assignment id " + messageContent + " is not exist!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                assignmentsData.A[courseId][courseSubject].splice(messageContent, 1);
                await this.server.saveDatabaseData("AssignmentsData", assignmentsData);
                
                await this.formMsg.properties.edit({
                    content: "Loading...",
                    embeds: []
                }).then(() => {
                    clearTimeout(this.session.data.timeout);
                    this.message.content = undefined;
                    this.session.data.collector.stop();
                    this.session.data["AssignmentsList"].menu = "Menu2_4_delAssign";
                    dataAssign.courseId = undefined;
                    this.menu2_4_delAssign("\n:information_source: Successfully delete assignment with id " + messageContent + " for course " + courseSubject + "\n\u200B");
                    return;
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            }
        }
        return;
    }

    async menu2_5() {
        let assignmentsData = await this.server.getDatabaseData("AssignmentsData");
        if(this.message.content === undefined) {
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "\u200B",
                embeds: [{
                    color: "0xFFC600",
                    title: "../Assignment List/Manage/Announce Assignments/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Choose one of the menus by sending a message according to the menu numbers below",
                    fields: [
                        { name: "\u200B", value: "Choose Class:" },
                        { name: "〔１〕Class A", value: "────────────────────" },
                        { name: "〔２〕Class B", value: "────────────────────" }
                    ],
                    footer: {
                        text: "© RPL Muda 2021 | All rights reserved",
                    },
                }],
                components: [this.formMsg.row] 
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));

            this.session.data.timeout = setTimeout(async () => {
                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                delete this.messageSession[this.channel.id][this.user.id];
            }, this.server.configs.formTimeout * 1000);

            this.session.data.collector = this.formMsg.properties.createMessageComponentCollector({
                filter: async interaction => {
                    if(interaction.user.id === this.user.id) {
                        switch(interaction.customId) {
                            case "1-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "MainMenu";
                                require("./Home.js")(this.server, this.message);
                                return true;
                            }
        
                            case "2-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                delete this.messageSession[this.channel.id][this.user.id];
                                return true;
                            }
        
                            case "3-" + this.session.id: {
                                interaction.deferUpdate();
                                clearTimeout(this.session.data.timeout);
                                await this.formMsg.properties.edit({
                                    content: "Loading...",
                                    embeds: [],
                                    components: []
                                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                                this.session.data["AssignmentsList"].menu = "Menu2";
                                new Menu2(this.server, this.message).mainMenu();
                                return true;
                            }
                        }
                    } else {
                        interaction.reply({
                            content: "This button isn't for you",
                            ephemeral: true
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                },
                max: 1,
                time: (this.server.configs.formTimeout * 1000)
            });
        } else {
            let messageContent = this.message.content;
            if(messageContent === "1" || messageContent === "2") {
                let className = "";
                if(messageContent === "1") className = "A";
                if(messageContent === "2") className = "B";
                
                var assignmentsList = "";

                for (var indexCourse in assignmentsData[className]) {
                    for (var courseSubject in assignmentsData[className][indexCourse]) {
                        assignmentsList += courseSubject + ":";
                        for (var indexAssignments in assignmentsData[className][indexCourse][courseSubject]) {
                            assignmentsList += "\n    =- Assignment: " + assignmentsData.A[indexCourse][courseSubject][indexAssignments].assignment;
                            assignmentsList += "\n       Deadline: " + assignmentsData.A[indexCourse][courseSubject][indexAssignments].deadline;
                        }
                        assignmentsList += "\n\n";
                    }
                }

                let assignmentsListChunk = this.chunkSubstr(assignmentsList, 1950);

                for(let index in assignmentsListChunk) {
                    if(index == 0) {
                        await this.message.channel.send(":information_source: Assignments List for Class " + className + ":\n```\n" + assignmentsListChunk[index] + "\n```");
                    } else {
                        await this.message.channel.send("\u200B\n```\n" + assignmentsListChunk[index] + "\n```");
                    }
                }
                this.formMsg.row.components[0].setDisabled(false);
                this.formMsg.row.components[1].setDisabled(false);
                this.formMsg.row.components[2].setDisabled(false);
                this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
                this.formMsg.properties = await this.message.channel.send({
                    content: "Loading...",
                    embeds: [],
                    components: [this.formMsg.row]
                })
                clearTimeout(this.session.data.timeout);
                this.message.content = undefined;
                this.session.data.collector.stop();
                this.session.data["AssignmentsList"].menu = "Menu2";
                this.mainMenu();
                return;
            } else {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            }
        }
        return;
    }

    chunkSubstr(str, size) {
        const numChunks = Math.ceil(str.length / size)
        const chunks = new Array(numChunks)
      
        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
          chunks[i] = str.substr(o, size)
        }
      
        return chunks
    }
};

module.exports = function(server, message) {
    let channelId = message.channel.id;
    let userId = message.author.id;
    let messageSession = server.user.messageSession;
    let session = messageSession[channelId][userId].session;
    
    if(messageSession[channelId][userId] === undefined) return;

    session.menu = "AssignmentsList";

    if(session.data[session.menu] === undefined) {
        session.data[session.menu] = {
            menu: "MainMenu",
            data: {}
        };
    }
    switch(session.data[session.menu].menu) {
        case "MainMenu": {
            new MainMenu(server, message);
            return;
        }

        case "Menu1": {
            new Menu1(server, message).menu1();
            return;
        }

        case "Menu1_1": {
            new Menu1(server, message).menu1_class("A");
            return;
        }

        case "Menu1_2": {
            new Menu1(server, message).menu1_class("B");
            return;
        }

        case "Menu2": {
            new Menu2(server, message).mainMenu();
            return;
        }

        case "Menu2_1": {
            new Menu2(server, message).menu2_1("");
            return;
        }

        case "Menu2_2": {
            new Menu2(server, message).menu2_2("");
            return;
        }

        case "menu2_3": {
            new Menu2(server, message).menu2_3();
            return;
        }

        case "Menu2_3_addAssign": {
            new Menu2(server, message).menu2_3_addAssign("");
            return;
        }

        case "Menu2_4": {
            new Menu2(server, message).Menu2_4();
            return;
        }

        case "Menu2_4_delAssign": {
            new Menu2(server, message).menu2_4_delAssign("");
            return;
        }

        case "Menu2_5": {
            new Menu2(server, message).menu2_5();
            return;
        }
    }
};