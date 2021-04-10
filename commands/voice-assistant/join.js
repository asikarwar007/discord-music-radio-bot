const fs = require('fs');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const speechConfig = sdk.SpeechConfig.fromSubscription("<paste-your-subscription-key>", "<paste-your-region>");


module.exports = {
    name: 'join',
    aliases: ['j'],
    category: 'Audio',
    utilisation: '{prefix}join',

    execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);


        const { name: guildName, voice } = message.guild;
        message.member.voice.channel.join()
            .then(conn => {
                const dispatcher = conn.play(process.env.PWD + '/sounds/drop.mp3');
                dispatcher.on('finish', () => { console.log(`Joined ${message.member.voice.channel.name}!\n\nREADY TO RECORD\n`); });

                const receiver = conn.receiver;
                conn.on('speaking', (user, speaking) => {
                    if (speaking) {
                        console.log(`${user.username} started speaking`);
                        if (user) {
                            let pathToFile = process.env.PWD + `/recordings/${user.id}_${Date.now()}.pcm`;
                            const audioStream = receiver.createStream(user, { mode: 'pcm' });
                            audioStream.pipe(createNewChunk(pathToFile));
                            audioStream.on('end', () => {
                                console.log(`${user.username} stopped speaking`);
                                getTranscribed(pathToFile)
                            })
                        }
                    }
                });


                // dispatcher.on("end", end => {
                //     message.member.voice.channel.leave();
                //     console.log('Playing is finished!');
                // });
            })
    },
};

const createNewChunk = (pathToFile) => {

    return fs.createWriteStream(pathToFile);
};
async function getTranscribed(file) {
    // console.log(file);
    let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(file));
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(result => {
        console.log(`RECOGNIZED: Text=${result.text}`);
        recognizer.close();
    });

}