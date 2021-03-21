module.exports = (client, message, queue, track) => {
    // message.channel.send(`${client.emotes.music} - ${track.title} has been added to the queue !`);
    // const track = client.player.nowPlaying(playlist.title);
    const filters = [];

    // Object.keys(client.player.getQueue(playlist.title).filters).forEach((filterName) => client.player.getQueue(message).filters[filterName]) ? filters.push(filterName) : false;
    // console.log(track);
    // console.log(queue);
    let trackList = queue.tracks.length
    message.channel.send({
        embed: {
            color: 'BLUE',
            author: { name: track.title },
            footer: { text: 'Saini Live' },
            fields: [
                { name: 'Channel', value: track.author, inline: true },
                { name: 'Requested by', value: track.requestedBy.username, inline: true },
                { name: 'From playlist', value: track.fromPlaylist ? 'Yes' : 'No', inline: true },

                { name: 'Views', value: track.views, inline: true },
                { name: 'Duration', value: track.duration, inline: true },
                { name: 'Queue Size', value: trackList, inline: true },
            ],
            thumbnail: { url: track.thumbnail },
            timestamp: new Date(),
        },
    });
};