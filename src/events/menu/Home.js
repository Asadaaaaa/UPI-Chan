const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = async (server, message) => {
    let channel = message.channel;
    let user = message.author;
    let messageSession = server.user.messageSession;
    let session = messageSession[channel.id][user.id].session;
    let formMsg = messageSession[channel.id][user.id].formMsg;

    session.menu = "Home";

    if (message.content === undefined) {
        formMsg.row.components[0].setDisabled(true);
        formMsg.row.components[1].setDisabled(false);
        formMsg.row.components[2].setDisabled(true);
        await formMsg.properties.edit({
            content: "\u200B",
            embeds: [{
                color: "0xFFC600",
                title: "Home/",
                author: {
                    name: user.username + "#" + user.discriminator,
                    icon_url: message.author.avatarURL()
                },
                description: "Choose one of the menus by sending a message according to the menu numbers below",
                fields: [
                    {
                        name: "\u200B",
                        value: "Choose:"
                    },
                    {
                        name: "〔１〕Assignments List",
                        value: "────────────────────"
                    },
                    {
                        name: "〔２〕Announcement",
                        value: "────────────────────"
                    },
                    {
                        name: "〔３〕Random Picker",
                        value: "────────────────────"
                    },
                    {
                        name: "〔４〕Clear Chat",
                        value: "────────────────────",
                    },
                    {
                        name: "〔５〕Games",
                        value: "────────────────────",
                    }
                ],
                footer: {
                    text: "© RPL Muda 2021 | All rights reserved",
                }
            }],
            components: [formMsg.row]
        }).catch(err => server.errMsgHandler(server, message, err));

        session.data.timeout = setTimeout(async () => {
            await formMsg.properties.delete().catch(err => server.errMsgHandler(server, message, err));
            delete messageSession[channel.id][user.id];
        }, server.configs.formTimeout * 1000);

        session.data.collector = formMsg.properties.createMessageComponentCollector({
            filter: async interaction => {
                if (interaction.user.id === user.id) {
                    clearTimeout(session.data.timeout);
                    await formMsg.properties.edit({
                        content: "Loading...",
                        embeds: [],
                        components: []
                    }).catch(err => server.errMsgHandler(server, message, err));;
                    await formMsg.properties.delete().catch(err => server.errMsgHandler(server, message, err));
                    delete messageSession[channel.id][user.id];
                    return true;
                } else {
                    interaction.reply({
                        content: "This button isn't for you",
                        ephemeral: true
                    }).catch(err => server.errMsgHandler(server, message, err));
                    return;
                }
            },
            max: 1,
            time: (server.configs.formTimeout * 1000)
        });
    } else {
        switch (message.content) {
            case "1": {
                message.content = undefined;
                await formMsg.properties.edit({
                    content: "Loading...",
                    embeds: []
                }).then(() => {
                    clearTimeout(session.data.timeout);
                    session.data.collector.stop();
                    require("./AssignmentsList.js")(server, message);
                }).catch(err => server.errMsgHandler(server, message, err));
                return;
            }

            case "2": {
                message.content = undefined;
                await formMsg.properties.edit({
                    content: "Loading...",
                    embeds: []
                }).then(() => {
                    clearTimeout(session.data.timeout);
                    session.data.collector.stop();
                    require("./Announcement.js")(server, message);
                }).catch(err => server.errMsgHandler(server, message, err));
                return;
            }

            case "3": {
                message.content = undefined;
                await formMsg.properties.edit({
                    content: "Loading...",
                    embeds: []
                }).then(() => {
                    clearTimeout(session.data.timeout);
                    session.data.collector.stop();
                    require("./RandomPicker.js")(server, message);
                }).catch(err => server.errMsgHandler(server, message, err));
                return;
            }

            case "4":
            case "5": {
                formMsg.properties.embeds[0].color = "0xD0342C";
                formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: This features is under development!\n\u200B";
                formMsg.properties.edit({
                    embeds: formMsg.properties.embeds
                }).catch(err => server.errMsgHandler(server, message, err));
                return;
            }
            
            default: {
                formMsg.properties.embeds[0].color = "0xD0342C";
                formMsg.properties.embeds[0].fields[0].name = "\u200B\n:warning: You can't send messages other than require, because you are in session!\n\u200B";
                formMsg.properties.edit({
                    embeds: formMsg.properties.embeds
                }).catch(err => server.errMsgHandler(server, message, err));
                return;
            }
        }
    }
};