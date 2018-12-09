# The future is bright! Rejoice for Discord BugBot has arrived!
What does this amazing piece of software do for the human species you may ask.
Well society is for sure in a better place then they were yesterday thanks to Mike for creating this. Whether the bot may be inserting loads of memes into your server, or doing what it was built to do, which includes organizing bug reports for developers to easily view and manage active and inactive bugs that may exist in their project.
ALL WITHIN A DISCORD SERVER? yEs BoSs 

# Requirements
* Node > v8.0.0
* Discord with Discord server that you have permissions to
* A somewhat functioning computer with access to the internet

# Contributing
I do greatly appreciate any and all help that I can receive on this project, feel free to
fork and help close up some issues or make progress on some roadmap items. When creating pull requests
please give me some time to merge and properly review everything, I am busy in my
life with school, many projects, and work. 

# Roadmap
* Trello integration (NOT STARTED)
* Local DB Storage - Now built on MongoDB (IN PROGRESS)
* Unique Ticket ID & Objects (IN PROGRESS)
* User Suggestions Voting (NOT STARTED)
* Better MongoDB instance handling - allow remote hosts with config (NOT STARTED)

# Setup
To get the bot to join the server you need to go to this link... Be sure to put your bot id in the 
place of ID OF YOUR BOT

```discordapp.com/oauth2/authorize?client_id=ID OF YOUR BOT&scope=bot&permissions=0```


* Clone/checkout from the latest release
* Install requirements with ```npm install```
* Create a bot on discord.com - and create a bot user
* Rename the config.example.json to config.json and paste the bot token into the specified field in the config.
* Setup a private channel with your specified permissions for users to use each specific bot function. See channel functions for more
* Setup a public channel where users will report bugs, copy and paste the channel id into report_channel in your config.json
* Authenticate that bot to join one of your servers, via the discord developer panel.
* Start the bot with a simple ```node main.js```

# Channel Functions
* Approved Channel - This is where the bot posts approved reports.
* Approval Channel - This is where the bot only accept approvals for reports from.
* Report Channel - This is where the bot only accepts reports from, reports from outside this channel will have no effect on the bot.
* Denied Channel - This is where the bot posts denied reports. Nothing too crazy or important, serves more for an archive.