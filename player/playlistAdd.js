module.exports = (client, message, queue, playlist) => {
    message.channel.send(`${client.emotes.music} - ${playlist.title} has been added to the queue (**${playlist.tracks.length}** songs) !`);

    const track = client.player.nowPlaying(playlist.title);
    const filters = [];

    // Object.keys(client.player.getQueue(playlist.title).filters).forEach((filterName) => client.player.getQueue(message).filters[filterName]) ? filters.push(filterName) : false;
    message.channel.send({
        embed: {
            color: 'RED',
            author: { name: track.title },
            footer: { text: 'This Saini Bhai Gulaam' },
            fields: [
                { name: 'Channel', value: track.author, inline: true },
                { name: 'Requested by', value: track.requestedBy.username, inline: true },
                { name: 'From playlist', value: track.fromPlaylist ? 'Yes' : 'No', inline: true },

                { name: 'Views', value: track.views, inline: true },
                { name: 'Duration', value: track.duration, inline: true },
                { name: 'Filters activated', value: filters.length + '/' + client.filters.length, inline: true },

                { name: 'Volume', value: client.player.getQueue(message).volume, inline: true },
                { name: 'Repeat mode', value: client.player.getQueue(message).repeatMode ? 'Yes' : 'No', inline: true },
                { name: 'Currently paused', value: client.player.getQueue(message).paused ? 'Yes' : 'No', inline: true },

                { name: 'Progress bar', value: client.player.createProgressBar(message, { timecodes: true }), inline: true }
            ],
            thumbnail: { url: track.thumbnail },
            timestamp: new Date(),
        },
    });
};