class Announcement {

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
        if(this.session.data["Announcement"] === undefined) {
            this.session.data["Announcement"] = {
                menu: "TypeContent",
                data: {}
            };
        }
        
        switch(this.session.data["Announcement"].menu) {
            case "TypeContent": {
                this.typeContent();
                return;
            }

            case "PreviewContent": {
                this.previewContent();
                return;
            }

            case "Announce": {
                this.announce();
                return;
            }
        }
        return;
    }

    async typeContent() {
        if(this.message.content === undefined) {
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "\u200B",
                embeds: [{
                    color: "0xFFC600",
                    title: "Home/Announcement/Type/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "Enter the message that will be announced by sending a message containing the announcement",
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
            this.session.data["Announcement"].data.content = this.message.content;
            
            await this.formMsg.properties.edit({
                content: "Loading...",
                embeds: []
            }).then(() => {
                this.message.content = undefined;
                clearTimeout(this.session.data.timeout);
                this.session.data.collector.stop();
                this.session.data["Announcement"].menu = "PreviewContent"
                this.previewContent();
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
            return;
        }
        return;
    }

    async previewContent() {
        let sessionData = this.session.data["Announcement"].data;
        if(this.message.content === undefined) {
            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.edit({
                content: "[Preview <@" + this.user.id +">]:\n" + sessionData.content,
                embeds: [{
                    color: "0xFFC600",
                    title: "Home/Announcement/Preview/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "The preview of announcement is above this menu\nChoose one of the menus by sending a message according to the menu numbers below",
                    fields: [
                        { name: "\u200B", value: "Choose" },
                        { name: "〔１〕Done & Announce", value: "────────────────────" },
                        { name: "〔２〕Re-Type", value: "────────────────────" },
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
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        this.message.content = undefined;
                        clearTimeout(this.session.data.timeout);
                        this.session.data.collector.stop();
                        this.session.data["Announcement"].menu = "Announce";
                        this.announce();
                    }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
                    return;
                }

                case "2": {
                    await this.formMsg.properties.edit({
                        content: "Loading...",
                        embeds: []
                    }).then(() => {
                        this.message.content = undefined;
                        clearTimeout(this.session.data.timeout);
                        this.session.data.collector.stop();
                        this.session.data["Announcement"].menu = "TypeContent";
                        this.typeContent();
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

    async announce() {
        if(this.message.content === undefined) {
            this.message.channel.send(this.session.data["Announcement"].data.content);

            this.formMsg.row.components[0].setDisabled(false);
            this.formMsg.row.components[1].setDisabled(false);
            this.formMsg.row.components[2].setDisabled(false);
            await this.formMsg.properties.delete().catch(err => this.server.errMsgHandler(this.server, this.message, err));
            this.formMsg.properties = await this.message.channel.send({
                content: "\u200B",
                embeds: [{
                    color: "0xFFC600",
                    title: "Home/Announcement/Type/",
                    author: {
                        name: this.user.username + "#" + this.user.discriminator,
                        icon_url: this.message.author.avatarURL()
                    },
                    description: "The Announcement is above this menu",
                    fields: [
                        { name: "\u200B\n:information_source: Successfully announced\n\u200B", value: "Use the button below to go to the previous page" }
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
            this.formMsg.properties.embeds[0].color = "0xD0342C";
            this.formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
            this.formMsg.properties.edit({
                embeds: this.formMsg.properties.embeds
            }).catch(err => this.server.errMsgHandler(this.server, this.message, err));
            return;
            return;
        }
        return;
    }
}

module.exports = function(server, message) {
    let channelId = message.channel.id;
    let userId = message.author.id;
    let messageSession = server.user.messageSession;
    let session = messageSession[channelId][userId].session;
    
    if(messageSession[channelId][userId] === undefined) return;

    session.menu = "Announcement";
    new Announcement(server, message).menuHandler();
}