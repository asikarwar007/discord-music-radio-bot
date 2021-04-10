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
        // console.log(args);

        const { name: guildName, voice } = message.guild;
        const connection = voice ? voice.connection : null;



        // request(options, function (error, response, body) {
        //     if (error) throw new Error(error);

        //     console.log(body);
        // });
        // message.member.voice.channel.leave();
        let joinArg = args.join("%20")
        let url = 'http://radio.garden/api/search?q=' + joinArg

        // console.log(client.radioChannelList);
        // let responseRaw = await axios.get(url)
        axios.get(url)
            .then(function (response) {
                // handle success
                let searchResult = response.data
                if (searchResult) {
                    let hitsList = searchResult.hits.hits
                    let channelIdNew
                    let placeId
                    let channel
                    for (let i = 0; i < hitsList.length; i++) {
                        if (hitsList[i]._source.channelId && !channelIdNew) {
                            channelIdNew = hitsList[i]._source.channelId
                            placeId = hitsList[i]._source.placeId
                            channel = hitsList[i]._source
                        }
                    }
                    if (channelIdNew) {
                        let channelUrl = "http://radio.garden/api/ara/content/listen/" + channelIdNew + "/channel.mp3"
                        
                        message.channel.send({
                            embed: {
                                color: 'BLACK',
                                author: { name: channel.title },
                                footer: { text: 'Saini Live' },
                           
                                description: channel.subtitle,
                               
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

                        let placeURL = "http://radio.garden/api/ara/content/page/" + placeId
                        axios.get(placeURL)
                            .then(async function (placeResponse) {
                                let placeRes = placeResponse.data
                                if (placeRes) {
                                    let placeContentRaw = placeRes.data.content
                                    let placeContent = placeContentRaw
                                    for (let plaChannel = 0; plaChannel < placeContent.length; plaChannel++) {
                                        if (placeContent[plaChannel].title == "Picks from the area") {
                                            let channelList = []
                                            for (let z = 0; z < placeContent[plaChannel].items.length; z++) {
                                                let channelUrlRaw = placeContent[plaChannel].items[z].href.split('/')
                                                let objStr = {
                                                    name: (z + 1) + " : " + placeContent[plaChannel].items[z].title,
                                                    value: channelUrlRaw.pop()
                                                }
                                                channelList.push(objStr)
                                            }
                                            client.radioChannelList = channelList
                                            message.channel.send({
                                                embed: {
                                                    color: 'PINK',
                                                    author: { name: placeContent[plaChannel].title },
                                                    footer: { text: 'Saini Live' },
                                                    // description: channel.subtitle,
                                                    timestamp: new Date(),
                                                    fields: channelList
                                                },
                                            });
                                        }
                                    }
                                }
                            })
                        // let placeURL = "http://radio.garden/api/ara/content/page/" + placeId + "/channels"
                        // axios.get(placeURL)
                        //     .then(async function (placeResponse) {
                        //         let placeRes = placeResponse.data
                        //         if (placeRes) {
                        //             let placeContentRaw = placeRes.data.content
                        //             let placeContent = placeContentRaw[0].items
                        //             let channelList = []
                        //             for (let plaChannel = 0; plaChannel < placeContent.length; plaChannel++) {
                        //                 let channelUrlRaw = placeContent[plaChannel].href.split('/')
                        //                 let objStr = {
                        //                     name: (plaChannel + 1) + " : " + placeContent[plaChannel].title,
                        //                     value: channelUrlRaw.pop()
                        //                 }
                        //                 channelList.push(objStr)
                        //             }
                        //             message.channel.send({
                        //                 embed: {
                        //                     color: 'PINK',
                        //                     author: { name: placeRes.data.count + " Channels From " + placeRes.data.title + ", " + placeRes.data.subtitle },
                        //                     footer: { text: 'Saini Live' },
                        //                     // description: channel.subtitle,
                        //                     timestamp: new Date(),
                        //                     fields: channelList
                        //                 },
                        //             });
                        //         }
                        //     })

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