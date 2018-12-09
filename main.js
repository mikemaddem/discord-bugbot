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

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'bugbot';

// Create a new MongoClient
const mongo = new MongoClient(url);

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

// Use connect method to connect to the Server
mongo.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    //mongo.close();
});
const db = mongo.db(dbName);
setup_mongo();

function setup_mongo(){
    // create the required collections
    db.createCollection("bug_reports")
}

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

function insert_bugreport(reporter, description, steps, clientinfo, system, date) {
    try {
        const inserted = db.bug_reports.insertOne(
            {
                reporter: reporter, description: description, steps: steps,
                client_info: clientinfo, system_info: system, date: date
            }
        );
        return inserted[_id];
    }
    catch (e){
        console.log(e);
    }

}


commands.push('src');
commands.push('source');
commands.push('about');
commands.push('meme');
commands.push('report');
commands.push('approve');
commands.push('deny')
commands.push('purge')

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('Hit me with your worst bugs!');
    console.log('No. Actually, dont hit me with bugs, thats gross');
});

// Create an event listener for messages
client.on('message', async message => {


    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const botcommand = args.shift().toLowerCase();

    if (botcommand == 'src' || botcommand == 'source') {
        // Send "pong" to the same channel
        message.channel.send('https://github.com/mikemaddem/discord-bugbot');
    }
    if(botcommand == 'commands' || botcommand == 'command'){
        var comout = ""
        for(var i=0; i<=commands.length; i++){
            comout = comout+" "+commands[i]
        }
        message.channel.send(comout)
    }
    if (botcommand == 'about'){
        message.channel.send('A wise handsome young man by the name of Michael Madden is my creator, he created me' +
            'to help other developers organize the bugs in their awful code.');
        message.channel.send('Check him out @ mikemadden.me or @nfm_mike on twitter')
    }
    if (botcommand == 'meme'){
        message.channel.send(':flag_ru: I have strict orders to stop memes :flag_ru: ');
    }
    if(botcommand == 'report' && message.channel.id != config.report_channel){
        message.channel.send('An error has occured, you are trying to report an issue outside of the specified channel.')
        message.channel.send('Please contact the discord server adminstrators with any questions')
    }
    if (botcommand == 'report' && message.channel.id != config.report_channel){
        message.channel.send('Sorry I have been instructed to not take commands from this channel')
        message.channel.send('Please ensure you are using this command from the correct channel')
    }
    if (botcommand == 'report' && message.channel.id == config.report_channel){
        // ok shit we have to do some for real shit.
        var reportinfo = reportParser(message.content);
        var reporter = message.author;
        var description = reportinfo.description;
        var steps = reportinfo.step1+' '+reportinfo.step2;
        var clientinfo = reportinfo.client;
        var system = reportinfo.system;
        var date = new Date();
        var reportid;
        console.log(reporter+" just submitted a report with the following info ");
        console.log(reportinfo);
        var insert = `INSERT INTO bug_reports(reporter, description, steps, client_info, user_system, date_submitted) VALUES("${reporter}", "${description}", "${steps}", "${client}", "${system}", "${date}")`;
        mikeid = insert_bugreport(reporter, description, steps, clientinfo, system, date);
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        try {
            console.log('---------------')
            console.log(steps)
            console.log('----------------')
            
            if(!steps){
                steps = null;
            }
          client.channels.find('id', config.queue_channel).send({
            "content": "A new Bug Report has been created",
            "embed": {
              "title": "Bug Report #"+`${this.lastID}`,
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
                  "value": clientinfo
                },
                {
                  "name": "System Settings",
                  "value": system
                }

              ]
            }
          })

            } catch (e) {
                console.log(e);
                message.channel.send("An error has occured, and I've notified the humans so they can fix it")
            }
        }
        message.delete("15000");
        message.channel.send('Thank you for reporting this bug');
        message.delete('10000');

    if(botcommand == 'approve' && message.channel.id != config.queue_channel){
        message.channel.send('Sorry I have been instructed to not take commands from this channel')
    }
    if(botcommand == 'approve' && message.channel.id == config.queue_channel){
        // we need to add a vote to the report #, they are in the correct channel
        let bugid = args[0]
        var votes = 0;
        bugid = Number(bugid)
        var getsql = `SELECT votes FROM bug_reports WHERE bug_id = ?`
        
        db.get(getsql, [bugid], (err, row) => {
            
            if(err){
            message.channel.send('An error has occured with approving this bug report, please yell at my human creator to fix me')        
            return console.error(err.message)
            }
            votes = row.votes
            var reporter = row.reporter
            var steps = row.steps
            var clientinfo = row.client_info
            var system = row.user_system
            var date_submitted = row.date_submitted
            var description = row.description
            console.log('Votes'+votes);
            votes = (votes === null) ? 0 : votes;
            var newvotes = votes + 1;
            console.log('new votes', newvotes)
            var updatesql = `UPDATE bug_reports SET votes = ? where bug_id = ${bugid};`
            db.run(updatesql, newvotes, function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);

            if(votes >= 4){
                // the bug can be approved
                // marked the approved field as 1
                console.log('----')
                console.log('bug approved')
                console.log('----')
                approvesql = `UPDATE bug_reports SET approved = 1 where bug_id = ${bugid};`
                db.run(approvesql, function(err){
                    if (err) {
                        message.channel.send('A Database error has occured, this report should be marked as approved, the stupid humans should fix this soon')
                        return console.log(err.message);
                      }
                      client.channels.find('id', config.approved_channel).send({
                        "content": "A Bug Report has been Approved!",
                        "embed": {
                          "title": "Bug Report #"+bugid,
                          "description": description,
                          "color": 5124982,
                          "timestamp": date_submitted,
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
                              "value": clientinfo
                            },
                            {
                              "name": "System Settings",
                              "value": system
                            },
                            {
                                "name": "Approvers",
                                "value": "TBD"
                            }
        
                          ]
                        }
                      })
                })
            }
            else{
                message.channel.send('Not approved yet. Bug Report #'+bugid+' has been updated with a total of '+newvotes+' total votes')

            }
            
            });

            //return row
            //? console.log(row.votes)
            //: console.log('No row was found :( ')
            votes =+ row.votes
            console.log('Votes == ',votes)
        })
    }
    if(botcommand == 'deny' && message.channel.id != config.queue_channel){
        message.channel.send('Sorry I have been instructed to not take commands from this channel')
    }
    if(botcommand == 'deny' && message.channel.id == config.queue_channel){
        // we need to subtract a vote, they are in the correct channel
        let bugid = args[0]
        var votes = 0;
        bugid = Number(bugid)
        var getsql = `SELECT votes FROM bug_reports WHERE bug_id = ?`
        
        db.get(getsql, [bugid], (err, row) => {
            
            if(err){
            message.channel.send('An error has occured with processing your report denial, please yell at my human creator to fix me')        
            return console.error(err.message)
            }
            votes = row.votes
            console.log('Votes'+votes);
            votes = (votes === null) ? 0 : votes;
            var newvotes = votes - 1;
            console.log('new votes', newvotes)
            var updatesql = `UPDATE bug_reports SET votes = ? where bug_id = ${bugid};`
            db.run(updatesql, newvotes, function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);

            });

            //return row
            //? console.log(row.votes)
            //: console.log('No row was found :( ')
            votes =+ row.votes
            console.log('Votes == ',votes)
            message.channel.send('Thank you. I have updated Bug Report #'+bugid+' so that it now has '+newvotes+' total votes')

            
        })

    }
    if(botcommand === "purge") {
        // This command removes all messages from all users in the channel, up to 100.

        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);

        // Ooooh nice, combined conditions. <3
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({limit: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
      }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(config.token);
