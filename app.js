const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({ disableMentions: 'everyone' });
require('dotenv').config()


const { Player } = require("discord-player");
client.player = new Player(client);


client.config = require('./config/config');
client.emotes = client.config.emojis;
client.filters = client.config.filters;
client.commands = new Discord.Collection();

fs.readdirSync('./commands').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));
    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`Loading command ${file}`);
        if(command.name){
            client.commands.set(command.name.toLowerCase(), command);
        }
    };
});

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const player = fs.readdirSync('./player').filter(file => file.endsWith('.js'));

for (const file of events) {
    console.log(`Loading discord.js event ${file}`);
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
};

for (const file of player) {
    console.log(`Loading discord-player event ${file}`);
    const event = require(`./player/${file}`);
    client.player.on(file.split(".")[0], event.bind(null, client));
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
 

client.login(process.env.token);
