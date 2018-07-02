/**
 * Send me all of  the shitty bugs
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// import config
const config = require("./config.json");

startupsql = `CREATE TABLE IF NOT EXISTS bug_reports (
    bug_id integer PRIMARY KEY AUTOINCREMENT,
    reporter text NOT NULL,
    description text NOT NULL,
    steps text NOT NULL,
    client_info text NOT NULL,
    user_system text NOT NULL,
    approved integer DEFAULT 0,
    votes integer DEFAULT 0);`;

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/main.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    else{
        db.run(startupsql);
    }
    console.log('Connected to the bugs SQlite database.');
});

function reportParser(command) {
    let i, l;
    let output = {};
    let opt = 0;
    let cmdReader = false;
    let stringReader = false;
    let key = '';
    let val = '';

    // trim the command of extra spaces
    command = command.trim();

    // loop through the string once to achieve O(n) avg runtime
    for (i = 0, l = command.length; i < l; i++) {
    
        // if " is met the first time then we read string for value in object
        // when we hit " again or end quote then clear key and flip string reader off or toggle
        if (command[i] === '"') {
            if (stringReader)
                key = '';
            stringReader =! stringReader;
            continue;
        }

        // while string reader on we append to key value pair
        if (stringReader) {
            output[key] += command[i];
            continue;
        }

        // hyphen found prep for reader +1
        if (command[i] === '-') {
            opt++;
            continue;
        }

        // after two hyphen hits and a space we end out key reading
        if (opt === 2 && command[i] === ' ') {
            opt = 0;
            output[key] = '';
            continue;
        }

        // after two hyphen hits we read the characters to build your key
        if (opt === 2) {
            key += command[i];
            continue;
        }
    }

    return output;
}



/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('Hit me with your worst bugs!');
    console.log('No. Actually, dont hit me with bugs, thats gross');
});

// Create an event listener for messages
client.on('message', message => {

    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // check to see if the message is actually made for the bot

    if (command == 'ping') {

        message.channel.send('pong');
    }

    if (command == 'src' || command == 'source') {
        // Send "pong" to the same channel
        message.channel.send('https://github.com/mikemaddem/discord-bugjs');
    }
    if (command == 'about'){
        message.channel.send('A wise handsome young man by the name of Michael Madden is my creator, he created me' +
            'to help other developers organize the bugs in their awful code.');
        message.channel.send('Check him out @ mikemadden.me')
    }
    if (command == 'meme' || command == 'memes'){
        message.channel.send(':flag_ru: I have strict orders to stop memes :flag_ru: ');
    }
    if (command == 'report'){
        // ok shit we have to do some for real shit.
        
        message.channel.send(reportParser(message.content));
    }
    else{
        message.channel.send('Shit Mike didnt teach me this yet. Blame him not me')
    }

});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(config.token);