const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = async function(server, message) {
    let prefix = server.configs.prefix;
    let session = server.user.messageSession;
    let channelId = message.channel.id;
    let userId = message.author.id;
    
    message.delete().catch(err => server.errMsgHandler(server, message, err));

    if(message.content === prefix) {
        // if(!(server.configs.permissions.developers.includes(userId) || server.configs.permissions.collaborators.includes(userId))) {
        //     message.channel.send({
        //         content: "\u200B",
        //         embeds: [{
        //             color: "0xD0342C",
        //             author: {
        //                 name: message.author.username + "#" + message.author.discriminator,
        //                 icon_url: "https://i.ibb.co/p2c0rLg/Warning.png"
        //             },
        //             description: "Sorry you can't access UPI'Chan for a while because it's under development",
        //             footer: {
        //                 text: "© RPL Muda 2021 | All rights reserved",
        //             }
        //         }]
        //     });
        //     return;
        // }
        if(session[channelId] !== undefined) {
            if(session[channelId][userId] !== undefined) {
                return;
            }
        }

        let formMsg = await message.channel.send("Starting...");

        const formMsgRow = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("1-" + formMsg.id)
                .setLabel("⏏")
                .setStyle("PRIMARY")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("2-" + formMsg.id)
                .setLabel("✖")
                .setStyle("DANGER")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("3-" + formMsg.id)
                .setLabel("➥")
                .setStyle("PRIMARY")
                .setDisabled(true)
        );

        message.content = undefined;
        session[channelId] = {
            [userId]: {
                session: {
                    id: formMsg.id,
                    user: await message.guild.members.fetch(message.author.id),
                    menu: "Home",
                    data: {}
                },
                formMsg: {
                    properties: formMsg,
                    row: formMsgRow
                }
            }
        }

        await formMsg.edit("Loading...").catch(err => server.errMsgHandler(server, message, err));
    }
    
    require("./" + session[channelId][userId].session.menu + ".js")(server, message);
    return;
}