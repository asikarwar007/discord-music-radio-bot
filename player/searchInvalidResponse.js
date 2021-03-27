module.exports = (client, message, query, tracks, content, collector) => {
    if (content === 'cancel') {
        collector.stop();
        return message.channel.send(`${client.emotes.success} - The selection has been **cancelled** !`).then(msg => msg.delete({timeout: 10000}));
    } else message.channel.send(`${client.emotes.error} - You must send a valid number between **1** and **${tracks.length}** !`).then(msg => msg.delete({timeout: 10000}));
};