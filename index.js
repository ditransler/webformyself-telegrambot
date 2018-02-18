process.env["NTBA_FIX_319"] = 1; // fix for the node-telegram-bot-api module's issue

const fs = require('fs');
const path = require('path');
const debug = require('./helpers');
const TelegramBot = require('node-telegram-bot-api');
const toketPath = path.resolve(__dirname, 'token.txt');
const TOKEN = fs.readFileSync(toketPath, 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    return data;
});

console.log('Bot has been started ...');

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
          timeout: 10
        }
    }
});

bot.onText(/\/audio$/, msg => {
    bot.sendAudio(msg.chat.id, './audio/wind_of_change.mp3');
});

bot.onText(/\/audio2$/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Start audio uploading...');

    fs.readFile(path.resolve(__dirname, 'audio/wind_of_change.mp3'), (err, data) => {
        bot.sendAudio(chatId, data)
        .then(() => {
            bot.sendMessage(chatId, 'Audio uploading is finished.')
        });
    });
});