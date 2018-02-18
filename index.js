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

bot.onText(/\/pic$/, msg => {
    bot.sendPhoto(msg.chat.id, fs.readFileSync(path.resolve(__dirname, 'images/cat.jpg')));
});

bot.onText(/\/pic2$/, msg => {
    bot.sendPhoto(msg.chat.id, './images/cat.jpg', {
        caption: 'This is a cat'
    });
});