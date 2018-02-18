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

// Stickers should be in the WEBP format
// https://developers.google.com/speed/webp/gallery1

bot.onText(/\/sticker1$/, msg => {
    bot.sendSticker(msg.chat.id, './images/sticker.webp');
});

bot.onText(/\/sticker2$/, msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Sending a sticker...');

    fs.readFile(path.resolve(__dirname, 'images/sticker.webp'), (err, sticker) => {
        bot.sendSticker(chatId, sticker)
        .then(() => {
            bot.sendMessage(chatId, 'The sticker has been sent.');
        });
    });
});