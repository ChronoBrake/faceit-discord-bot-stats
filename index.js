const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    const prefix = config.prefix;
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    //COMMAND HANDLER

    try {
        let comandos = require(`./comando/${command}.js`);
        comandos.run(client, message, args, config);
        console.log(message.author.tag + " Usó el comando: " + message.content + " en: " + message.guild.name);
    } catch (e) {
        console.log(e.stack);
    } finally {
    }
});

client.login(config.token);