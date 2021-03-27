module.exports = {
    name: 'kick',
    aliases: ['kick','stop'],
    category: 'Music',
    utilisation: '{prefix}kick',

    execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        message.member.voice.channel.leave();
    },
};