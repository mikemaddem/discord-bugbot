# The future is bright! Rejoice for Discord BugJS has arrived!
What does this amazing piece of software do for the human species you may ask.
Well society is for sure in a better place then they were yesterday thanks to Mike for creating this. Whether the bot may be inserting loads of memes into your server, or doing what it was built to do, which includes organizing bug reports for developers to easily view and manage active and inactive bugs that may exist in their project.
ALL WITHIN A DISCORD SERVER? yEs BoSs 

# Requirements
* Node > v6.0.0
* Discord
* A somewhat functioning computer with access to the internet

# Contributing
Someone remind me to fill this out later. But I'd appreciate any help.

# Roadmap
* Trello integration
* Local DB Storage (SQLITE)
* Unique Ticket ID & Objects

# Setup
To get the bot to join the server you need to go to this link... Be sure to put your bot id in the 
place of ID OF YOUR BOT
discordapp.com/oauth2/authorize?client_id=ID OF YOUR BOT&scope=bot&permissions=0

* Clone/checkout from the latest release
* Install requirements with ```npm install```
* Create a bot on discord.com - and create a bot user
* Rename the config.example.json to config.json and paste the bot token into the specified field in the config.
* Setup a private channel with your specified permissions for users to approve bug reports, copy and paste the channel id into approval_channel in your config.json
* Setup a public channel where users will report bugs, copy and paste the channel id into report_channel in your config.json
* Authenticate that bot to join one of your servers, via the discord developer panel.
* Start the bot with a simple ```node main.js```
