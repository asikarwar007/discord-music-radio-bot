const axios = require('axios');
// const options = {
//     method: 'GET',
//     url: 'https://radio-world-50-000-radios-stations.p.rapidapi.com/v1/genres/getAll',
//     headers: {
//         'x-rapidapi-key': '6bbbefb69emshad2e0c7a4879b73p10e411jsn27c6685cfae0',
//         'x-rapidapi-host': 'radio-world-50-000-radios-stations.p.rapidapi.com',
//         useQueryString: true
//     }
// };

module.exports = {
    name: 'radio',
    aliases: ['fm'],
    category: 'Music',
    utilisation: '{prefix}radio [name/URL]',

    execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        if (!args[0]) return message.channel.send(`${client.emotes.error} - Please indicate the title of a song !`);
        // console.log(message);
        console.log(args);

        const { name: guildName, voice } = message.guild;
        const connection = voice ? voice.connection : null;



        // request(options, function (error, response, body) {
        //     if (error) throw new Error(error);

        //     console.log(body);
        // });
        // message.member.voice.channel.leave();
        let joinArg = args.join("%20")
        let url = 'http://radio.garden/api/search?q=' + joinArg
        // let responseRaw = await axios.get(url)
        axios.get(url)
            .then(function (response) {
                // handle success
                let searchResult = response.data
                if (searchResult) {
                    let hitsList = searchResult.hits.hits
                    let channelIdNew
                    for (let i = 0; i < hitsList.length; i++) {
                        if (hitsList[i]._source.channelId && !channelIdNew) {
                            channelIdNew = hitsList[i]._source.channelId
                        }
                    }
                    if (channelIdNew) {
                        console.log(channelIdNew);
                        let channelUrl = "http://radio.garden/api/ara/content/listen/" + channelIdNew + "/channel.mp3"
                        console.log(channelUrl);
                        // client.player.play(message, channelUrl, { firstResult: true });

                        message.member.voice.channel.join()
                            .then(connection => {
                                const dispatcher = connection.play(channelUrl);
                                dispatcher.on("end", end => {
                                    message.member.voice.channel.leave();
                                    console.log('Playing is finished!');
                                });
                            })
                    }
                    // if (hitsList[0]) {
                    //     if (hitsList[0]._score > 50) {

                    //         if (hitsList[0]._source.channelId) {

                    //         } else {
                    //             let placeId = hitsList[0]._source.placeId
                    //             let placeURL = "http://radio.garden/api/ara/content/page/" + placeId
                    //             axios.get(placeURL)
                    //                 .then(async function (placeResponse) {
                    //                     let placeRes = placeResponse.data
                    //                     if (placeRes) {
                    //                         let placeContent = placeRes.data.content
                    //                         // console.log(placeContent);
                    //                         let stations = placeContent[0]
                    //                         if (stations) {
                    //                             let firstChannel = stations.items[0]
                    //                             if (firstChannel) {
                    //                                 let channelUrlRaw = firstChannel.href.split('/')
                    //                                 let channelId = channelUrlRaw.pop()
                    //                                 console.log(channelId);
                    //                                 let channelUrl = "http://radio.garden/api/ara/content/listen/" + channelId + "/channel.mp3"
                    //                                 console.log(channelUrl);
                    //                                 // client.player.play(message, channelUrl, { firstResult: true });

                    //                                 message.member.voice.channel.join()
                    //                                     .then(connection => {
                    //                                         const dispatcher = connection.play(channelUrl);
                    //                                         dispatcher.on("end", end => {
                    //                                             message.member.voice.channel.leave();
                    //                                             console.log('Playing is finished!');
                    //                                         });
                    //                                     })
                    //                                 // if (!connection) {
                    //                                 //    await channel.join()
                    //                                 // }
                    //                                 // const dispatcher = await connection.play(channelUrl);

                    //                                 // axios.get(channelUrl)
                    //                                 // .then(function (channelResponse) {
                    //                                 //     console.log(channelResponse);
                    //                                 // })
                    //                                 // .catch(function (error) {
                    //                                 //     // handle error
                    //                                 //     console.log(error);
                    //                                 // })
                    //                             }
                    //                         }
                    //                     }
                    //                 })
                    //                 .catch(function (error) {
                    //                     // handle error
                    //                     // console.log(error);
                    //                 })
                    //         }

                    //     }
                    // }
                }
                // console.log(searchResult);
            })
            .catch(function (error) {
                // handle error
                // console.log(error);
            })



        // client.player.play(message, args.join(" "), { firstResult: true });
    },
};