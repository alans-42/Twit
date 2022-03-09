const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const Twit = require('twit');
const tokens = require('./tokens.js');

const T = new Twit(tokens);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function ( evt) {
    console.log("Logged in as " + bot.username + " Id: "+ bot.id)
});

bot.on('message', function (user, userID, channelID, message, evt) {
if (message.substring(0, 5) == '~twit') {
    var args = message.substring(1).split(' ');
    var cmd = args[1];

    switch(cmd) {
        //~twit help
        case 'help':
            bot.sendMessage({
                to: channelID,
                message:"**Here's what I can do:**\n" +
                        "*help* - Say this again\n" +
                        "*sup* - Respond to you\n" +
                        "*Make sure to use* '~twit [Command]'"
            });
            break;
        //~twit sup
        case 'sup':
            bot.sendMessage({
                to: channelID,
                message: "How's it going " + user + "?"
            });
            break;
        //~twit get
        case 'get':
            T.get('search/tweets', {q: args[2], count: 1}, returnMessage);
            function returnMessage(err, data, response){
                var tweets = data.statuses;
                var finalTweets = ""
                for(var i = 0; i < tweets.length; i++){
                    finalTweets += tweets[i].text
                }
                bot.sendMessage({
                    to: channelID,
                    message: finalTweets
                });
                finalTweets = ""
                tweets = ""
            }
            break;
     }
 }
});