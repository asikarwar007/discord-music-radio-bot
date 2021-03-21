module.exports = {
    name: 'jump',
    aliases: ['jfm'],
    category: 'Music',
    utilisation: '{prefix}jump [channelNumber]',

    execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        if (!client.radioChannelList) return message.channel.send(`${client.emotes.error} - No radio list!`);

        if (!args[0]) return message.channel.send(`${client.emotes.error} - Please indicate the channel number !`);
        // console.log(message);
        // console.log(args);
        let jumpNUmber = parseInt(args[0] - 1)
        let currentRadioList = client.radioChannelList[jumpNUmber]
        if (currentRadioList) {
            let channelUrl = "http://radio.garden/api/ara/content/listen/" + currentRadioList.value + "/channel.mp3"

            message.channel.send({
                embed: {
                    color: 'BLACK',
                    author: { name: currentRadioList.name },
                    footer: { text: 'Saini Live' },
                    // url: channelUrl,

                    // description: channel.subtitle,

                    timestamp: new Date(),

                },
            });
            message.member.voice.channel.join()
                .then(connection => {
                    const dispatcher = connection.play(channelUrl);

                    dispatcher.on("end", end => {
                        message.member.voice.channel.leave();
                        console.log('Playing is finished!');
                    });
                })
        }
    },
};