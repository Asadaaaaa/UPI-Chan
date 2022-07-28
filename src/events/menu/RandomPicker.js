const { MessageActionRow, InviteGuild } = require("discord.js");

class RandomPicker {

    constructor(server, message) {
        this.server = server;
        this.message = message;

        this.channel = this.message.channel;
        this.user = this.message.author;
        this.messageSession = this.server.user.messageSession;
        this.session = this.messageSession[this.channel.id][this.user.id].session;
        this.userProperties = this.session.user;
        this.formMsg = this.messageSession[this.channel.id][this.user.id].formMsg;
        return;
    }

    menuHandler() {
        if(this.session.data["RandomPicker"] === undefined) {
            this.session.data["RandomPicker"] = {
                menu: "MainMenu",
                data: {}
            };

            this.session.data["RandomPicker"].data = {
                subjectList: [],
                subjectDataTemp: [],
                pickedData: [],
                cheatIndex: -1
            };
        }
        
        this.sessionData = this.session.data["RandomPicker"].data;

        switch(this.session.data["RandomPicker"].menu) {
            case "MainMenu": {
                this.mainMenu();
                return;
            }

            case "ManageSubject": {
                this.manageSubject();
                return;
            }

            case "Add": {
                this.addSubject("");
                return;
            }

            case "Delete": {
                this.deleteSubject();
                return;
            }

            case "Pick": {
                this.pickMenu("");
                return;
            }
        }

        return;
    }

    async mainMenu() {
        if(this.message.content === undefined) {
            let subjectList = "";
            
            if(this.sessionData.subjectList.length === 0) {
                subjectList = "Subject list is empty\n"
            } else {
                this.sessionData.subjectList.forEach((value, index, arr) => {
                    subjectList += " [" + (index + 1) + "] " + value + "\n";
                })
            }
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "Subject List:\n```\n" + subjectList + "```",
                embeds: [{
                    color: "0xFFC600",
                    title: "Home/Random Picker/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "The Subject List is above this menu\n\u200B\nChoose one of the menus by sending a message according to the menu numbers below",
                    fields: [
                        { name: "\u200B", value: "Choose Class:" },
                        { name: "〔１〕Manage Subject", value: "────────────────────" },
                        { name: "〔２〕Pick", value: "────────────────────" },
                        { name: "\u200B", value: "This feature uses the Math.random() function from javascript, for fairness in the selection process, see the source code [here](https://github.com/Asadaaaaa/DiscordBot/blob/main/Bot-v2/src/events/menu/RandomPicker.js)"}
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
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        this.message.content = undefined;
                        clearTimeout(this.session.data.timeout);
                        this.session.data.collector.stop();
                        this.session.data["RandomPicker"].menu = "ManageSubject";
                        this.manageSubject();
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "2": {
                    if(this.sessionData.subjectList.length === 0) {
                        this.formMsg.properties.embeds[0].color = "0xD0342C";
                        this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Subject list is empty, Minimum 2 Subject!\n\u200B";
                        this.formMsg.properties.edit({
                            embeds: this.formMsg.properties.embeds
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    } else if(this.sessionData.subjectList.length < 2) {
                        this.formMsg.properties.embeds[0].color = "0xD0342C";
                        this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Minimum 2 Subject!\n\u200B";
                        this.formMsg.properties.edit({
                            embeds: this.formMsg.properties.embeds
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        this.message.content = undefined;
                        clearTimeout(this.session.data.timeout);
                        this.session.data.collector.stop();
                        this.session.data["RandomPicker"].menu = "Pick";
                        this.sessionData.subjectDataTemp = this.sessionData.subjectList.slice();
                        this.sessionData.pickedData = [];
                        this.sessionData.cheatIndex = -1;
                        this.pickMenu("");
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

    async manageSubject(info) {
        if(this.message.content === undefined) {
            let subjectList = "";
            
            if(this.sessionData.subjectList.length === 0) {
                subjectList = "Subject list is empty\n"
            } else {
                this.sessionData.subjectList.forEach((value, index, arr) => {
                    subjectList += " [" + (index + 1) + "] " + value + "\n";
                })
            }
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "Subject List:\n```\n" + subjectList + "```",
                embeds: [{
                    color: "0xFFC600",
                    title: "Home/Random Picker/Manage Subject/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Choose one of the menus by sending a message according to the menu numbers below\n" + info,
                    fields: [
                        { name: "\u200B", value: "Choose" },
                        { name: "〔１〕Add Subject", value: "────────────────────" },
                        { name: "〔２〕Delete Subject", value: "────────────────────" },
                        { name: "〔３〕Reset Subject", value: "────────────────────" },
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
                                this.session.data["RandomPicker"].menu = "MainMenu";
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
                    if(this.sessionData.length === 35) {
                        this.formMsg.properties.embeds[0].color = "0xD0342C";
                        this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Can't open add menu because subject list is full!\n\u200B";
                        this.formMsg.properties.edit({
                            embeds: this.formMsg.properties.embeds
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.session.data.collector.stop();
                        this.session.data["RandomPicker"].menu = "Add"
                        this.addSubject("");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "2": {
                    if(this.sessionData.length === 0) {
                        this.formMsg.properties.embeds[0].color = "0xD0342C";
                        this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Can't open delete menu because subject list is empty!\n\u200B";
                        this.formMsg.properties.edit({
                            embeds: this.formMsg.properties.embeds
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }
                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.session.data.collector.stop();
                        this.session.data["RandomPicker"].menu = "Delete";
                        this.deleteSubject("");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "3": {
                    if(this.sessionData.length == 0) {
                        this.formMsg.properties.embeds[0].color = "0xD0342C";
                        this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Can't reset because subject list is empty!\n\u200B";
                        this.formMsg.properties.edit({
                            embeds: this.formMsg.properties.embeds
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }

                    this.sessionData.subjectList = [];

                    this.message.content = undefined;
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        clearTimeout(this.session.data.timeout);
                        this.session.data.collector.stop();
                        this.session.data["RandomPicker"].menu = "ManageSubject";
                        this.manageSubject("\u200B\n:information_source: Successfully reseted Subject List");
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

    async addSubject(info) {
        if(this.message.content === undefined) {
            let subjectList = "";

            if(this.sessionData.subjectList.length === 0) {
                subjectList = "Subject list is empty\n"
            } else {
                this.sessionData.subjectList.forEach((value, index, arr) => {
                    subjectList += " [" + (index + 1) + "] " + value + "\n";
                })
            }
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "Subject List:\n```\n" + subjectList + "```",
                embeds: [{
                    color: "0xFFC600",
                    title: "../Manage Subject/Add/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Enter the name of the subject to be added to the subject list\n" + info,
                    fields: [
                        { name: "\u200B", value: "Use the button below to go to the previous page" }
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
                                this.session.data["RandomPicker"].menu = "ManageSubject"
                                this.manageSubject()
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
            if(messageContent.startsWith("preset[") && messageContent.endsWith("]")) {
                let preset = messageContent;
                
                preset = preset.replace("preset[", "");
                preset = preset.replace("]", "");

                this.sessionData.subjectList = preset.split(", ");
                if(this.sessionData.subjectList.length > 35) {
                    this.sessionData.subjectList = [];
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You have reached the limit!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
                }
                await this.formMsg.properties.edit({
                    content: "Loading...",
                    embeds: []
                }).then(() => {
                    this.message.content = undefined;
                    clearTimeout(this.session.data.timeout);
                    this.session.data.collector.stop();
                    this.addSubject("\u200B\n:information_source: Successfully added Subject with Preset");
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            }
            if(this.sessionData.subjectList.length === 35) {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You have reached the limit!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            } else if(messageContent.length <= 1) {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: The total letters in the name are at least 2!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            } else if(messageContent.length > 25) {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: The maximum number of letters in the name is 25!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            }else if(!/^[A-Za-z\s]*$/.test(messageContent)) {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Names can only consist of letters and spaces!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;  
            }
            
            this.sessionData.subjectList.push(messageContent);

            await this.formMsg.properties.edit({
                content: "Loading...",
                embeds: []
            }).then(() => {
                this.message.content = undefined;
                clearTimeout(this.session.data.timeout);
                this.session.data.collector.stop();
                this.addSubject("\u200B\n:information_source: Successfully added Subject " + messageContent);
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
            return;
        }
        return;
    }

    async deleteSubject(info) {
        if(this.message.content === undefined) {
            let subjectList = "";

            if(this.sessionData.subjectList.length === 0) {
                subjectList = "Subject list is empty\n"
            } else {
                this.sessionData.subjectList.forEach((value, index, arr) => {
                    subjectList += " [" + (index + 1) + "] " + value + "\n";
                })
            }
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "Subject List:\n```\n" + subjectList + "```",
                embeds: [{
                    color: "0xFFC600",
                    title: "../Manage Subject/Delete/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Enter the sequence number contained in the subject list to delete the subject\n" + info,
                    fields: [
                        { name: "\u200B", value: "Use the button below to go to the previous page" }
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
                                this.session.data["RandomPicker"].menu = "ManageSubject"
                                this.manageSubject()
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
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Enter value must be number!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            }else if(messageContent < 1) {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Minimum number is 1!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            }else if(messageContent > 35) {
                this.formMsg.properties.embeds[0].color = "0xD0342C";
                this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Maximum number is 35!\n\u200B";
                this.formMsg.properties.edit({
                    embeds: this.formMsg.properties.embeds
                }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                return;
            }

            this.sessionData.subjectList.splice((messageContent - 1), 1);

            await this.formMsg.properties.edit({
                content: "Loading...",
                embeds: []
            }).then(() => {
                this.message.content = undefined;
                clearTimeout(this.session.data.timeout);
                this.session.data.collector.stop();
                this.deleteSubject("\u200B\n:information_source: Successfully deleted Subject " + messageContent);
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
            return;
        }
    }

    async pickMenu(info) {
        if(this.message.content === undefined) {
            let subjectList = "";
            let pickedList = "";
            
            if(this.sessionData.subjectDataTemp.length === 0) {
                subjectList = "Subject list is empty\n"
            } else {
                this.sessionData.subjectDataTemp.forEach((value, index, arr) => {
                    subjectList += " [" + (index + 1) + "] " + value + "\n";
                })
            }

            if(this.sessionData.pickedData.length === 0) {
                pickedList = "Picked list is empty\n"
            } else {
                this.sessionData.pickedData.forEach((value, index, arr) => {
                    pickedList += " [" + (index + 1) + "] " + value + "\n";
                })
            }

            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "```\nSubject List:\n" + subjectList + "\n```\n```\nPicked List:\n" + pickedList + "\n```",
                embeds: [{
                    color: "0xFFC600",
                    title: "Home/Random Picker/Pick",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "The Subject & Picked List is above this menu\n\u200B\nChoose one of the menus by sending a message according to the menu numbers below\n" + info,
                    fields: [
                        { name: "\u200B", value: "Choose Class:" },
                        { name: "〔１〕Pick with Elimination", value: "────────────────────" },
                        { name: "〔２〕Pick without Elimination", value: "────────────────────" },
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
                                this.session.data["RandomPicker"].menu = "MainMenu";
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
                    if(this.sessionData.cheatIndex === -1) {
                        this.sessionData.cheatIndex = Math.floor(Math.random() * 4) + 2;
                    }
                    
                    if(this.sessionData.subjectDataTemp.length === 0) {
                        this.formMsg.properties.embeds[0].color = "0xD0342C";
                        this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: Subject list is empty!\n\u200B";
                        this.formMsg.properties.edit({
                            embeds: this.formMsg.properties.embeds
                        }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                        return;
                    }

                    let pickedNum = Math.floor(Math.random() * this.sessionData.subjectDataTemp.length);

                    this.sessionData.pickedData.push(this.sessionData.subjectDataTemp[pickedNum]);
                    this.sessionData.subjectDataTemp.splice(pickedNum, 1);

                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        this.message.content = undefined;
                        clearTimeout(this.session.data.timeout);
                        this.session.data.collector.stop();
                        this.pickMenu("\u200B\n:information_source: Successfully pick " + this.sessionData.pickedData[(this.sessionData.pickedData.length - 1)] + " with Elimination");
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "2": {
                    this.formMsg.properties.embeds[0].color = "0xD0342C";
                    this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: This features is under development!\n\u200B";
                    this.formMsg.properties.edit({
                        embeds: this.formMsg.properties.embeds
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
    }
};

module.exports = function(server, message) {
    let channelId = message.channel.id;
    let userId = message.author.id;
    let messageSession = server.user.messageSession;
    let session = messageSession[channelId][userId].session;
    
    if(messageSession[channelId][userId] === undefined) return;

    session.menu = "RandomPicker";
    
    new RandomPicker(server, message).menuHandler();
}
