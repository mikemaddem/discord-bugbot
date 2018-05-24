/**
 * Send me all of  the shitty bugs
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// import config
const config = require("./config.json");

const sqlite3 = require('sqlite3').verbose();
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    let db = new sqlite3.Database('./db/main.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to main database.');
      });
    db.run("CREATE TABLE IF NOT EXISTS `bug_reports` (`id`	INTEGER PRIMARY KEY AUTOINCREMENT, `reported`	timestamp, `description`	BLOB, `approved`	INTEGER DEFAULT 0, `denied`	INTEGER DEFAULT 0, `reporter`	text DEFAULT 'Unknown', `open`	text DEFAULT 'Unknown')");
    console.log("DB Setup properly");
    console.log('Hit me with your worst bugs!');
    console.log('No. Actually, dont hit me with bugs, thats gross');
});

// Create an event listener for messages
client.on('message', message => {

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // check to see if the message is actually made for the bot

    if (command == 'ping') {
        var number = parseInt(args);

        for(var i=0; i<number; i++){
            message.channel.send('pong');
        }
        
    }

    if (command == 'src' || command == 'source') {
        // Send "pong" to the same channel
        message.channel.send('https://github.com/mikemaddem/discord-bugjs'+" "+ args);
    }
    if(comamnd == 'createissue'){

    }
    if(command == 'commands'){
        message.channel.send('All of my commands are...');
        message.channel.send('about, src, meme,');
    }
    if (command == 'about'){
        message.channel.send('A wise handsome young man by the name of Michael Madden is my creator, he created me' +
            'to help other developers organize the bugs in their awful code.');
        message.channel.send('Check him out @ mikemadden.me')
    }
    if (command == 'meme' || command == 'memes'){
        message.channel.send('no');
        message.channel.send('memes');
        message.channel.send('for');
        message.channel.send('you');
        message.channel.send(':rofl:')
    }

});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(config.token);