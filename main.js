/**
 * Send me all of  the shitty bugs
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

var fs = require('fs')

// import config
const config = require("./config.json");

// check if the db file exists
fs.existsSync('db/main.sqlite3', function (err, file) {
    if (err){ 
        console.log('Error locating the db file')
        fs.writeFile('db/main.sqlite3', (err) => {
            if (err) throw err;
        
            console.log("The db file was has been created!");
        }); 
        //throw err
        }
    else {
    console.log('DB File found! Rejoice to all of mankind!');
  }});


var commands = [];

startupsql = `CREATE TABLE IF NOT EXISTS bug_reports (
    bug_id integer PRIMARY KEY AUTOINCREMENT,
    reporter text NOT NULL,
    description text NOT NULL,
    steps text NOT NULL,
    client_info text NOT NULL,
    user_system text NOT NULL,
    approved integer DEFAULT 0,
    votes integer DEFAULT 0,
    date_submitted integer NOT NULL);`;

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


commands.push('src');
commands.push('source');
commands.push('about');
commands.push('meme');
commands.push('report');

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
    const botcommand = args.shift().toLowerCase();

    if (botcommand == 'src' || botcommand == 'source') {
        // Send "pong" to the same channel
        message.channel.send('https://github.com/mikemaddem/discord-bugjs');
    }
    if (botcommand == 'about'){
        message.channel.send('A wise handsome young man by the name of Michael Madden is my creator, he created me' +
            'to help other developers organize the bugs in their awful code.');
        message.channel.send('Check him out @ mikemadden.me')
    }
    if (botcommand == 'meme'){
        message.channel.send(':flag_ru: I have strict orders to stop memes :flag_ru: ');
    }
    if(botcommand == 'report' && message.channel.id != config.report_channel){
        message.channel.send('An error has occured, you are trying to report an issue outside of the specified channel.')
        message.channel.send('Please contact the discord server adminstrators with any questions')
    }
    if (botcommand == 'report' && message.channel.id == config.report_channel){
        // ok shit we have to do some for real shit.
        var reportinfo = reportParser(message.content);
        var reporter = message.author;
        var description = reportinfo.description;
        var steps = reportinfo.step1+reportinfo.step2
        var client = reportinfo.client;
        var system = reportinfo.system;
        var date = new Date();
        var reportid;
        console.log(reporter+" just submitted a report with the following info ");
        console.log(reportinfo);
        var insert = `INSERT INTO bug_reports(reporter, description, steps, client_info, user_system, date_submitted) VALUES("${reporter}", "${description}", "${steps}", "${client}", "${system}", "${date}")`;
        db.run(insert, function(err) {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            reportid = `${this.lastID}`;
            console.log(`A row has been inserted with rowid ${this.lastID}`);
          });
        //var id = db.lastInsertRowId;
        // grab the value of the the report id based on the last one created
        //var bugid = db.run(`SELECT bug_id FROM bug_reports WHERE bug_id = (SELECT MAX(bug_id) FROM bug_reports)`);
        //console.log('bugid = '+bugid)
        message.channel.send({
            "content": "A new Bug Report has been created",
            "embed": {
              "title": "Bug Report #"+reportid,
              "description": description,
              "color": 5124982,
              "timestamp": date,
              "footer": {
                "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
                "text": "Bug Bot"
              },
              "thumbnail": {
                "url": "https://cdn.discordapp.com/embed/avatars/0.png"
              },
              "author": {
                "name": "Bug Bot",
                "url": "https://mikemadden.me",
                "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
              },
              "fields": [
                {
                    "name": "Reporter",
                    "value": reporter.toString()
                },
                {
                  "name": "Steps to reproduce",
                  "value": steps
                },
                {
                  "name": "Client Settings",
                  "value": client
                },
                {
                  "name": "System Settings",
                  "value": system
                }
                
              ]
            }
          });
        //reportid = reportid.parseInt()
        message.delete("30");
        console.log(reportid)
    }
    if(botcommand == 'approve' && message.channel.id == config.approval_channel){
        // we need to add a vote to the report #, they are in the correct channel
    }
    if(botcommand == 'deny' && message.channel.id == config.approval_channel){
        // we need to subtract a vote, they are in the correct channel
    }

});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(config.token);
