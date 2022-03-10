import { createRequire } from "module";
const require = createRequire(import.meta.url);
const auth = require('./auth.json');

import Discord from 'discord.io';
import logger from 'winston';
import Twit from 'twit';
import {franc} from 'franc'

const T = new Twit(auth.keys);

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

//Shuffles an array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

bot.on('ready', function () {
    console.log("Logged in as " + bot.username + " Id: "+ bot.id)
    bot.setPresence({game: {name: "~twit"}})
    console.log("Press 'Ctr + C' to end")
});

bot.on('message', function (user, userID, channelID, message) {
if (message.substring(0, 5) === '~twit') {
    const args = message.substring(1).split(' ');
    const cmd = args[1];

    switch(cmd) {
        //~twit help
        case 'help':
            bot.sendMessage({
                to: channelID,
                message:"**Here's What I Can Do:**\n" +
                        "*help* - Say This Again\n" +
                        "*sup* - Respond To You\n" +
                        "*get [Search Word]* - Replies With a Tweet\n" +
                        "*Make sure to use* '~twit [Command]'\n"
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
            T.get('search/tweets', {q: args[2], count: 25}, returnMessage);
            function returnMessage(err, data){
                const tweets = data.statuses;
                let tweetsMap = [];
                for(let i = 0; i < tweets.length; i++){
                    if(franc(tweets[i].text) === "eng"){
                        tweetsMap.push(tweets[i])
                    }
                }
                tweetsMap = shuffle(tweetsMap)
                if(tweetsMap.length !== 0){
                    bot.sendMessage({
                        to: channelID,
                        message: "**" + tweetsMap[0].user.name + " (" + tweetsMap[0].user.screen_name + ") tweeted:**\n" + tweetsMap[0].text
                    });
                }
                else{
                    bot.sendMessage({
                       to: channelID,
                       message: "Sorry no tweets"
                    });
                }
            }
            break;
     }
 }
});