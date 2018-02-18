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

// http://techslides.com/demos/sample-videos/small.mp4

bot.onText(/\/video1$/, msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Uploading video...');

    bot.sendVideo(chatId, 'http://techslides.com/demos/sample-videos/small.mp4');
});

bot.onText(/\/video2$/, msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Uploading video...');

    bot.sendVideo(chatId, path.resolve(__dirname, 'video/small.mp4'));
});

bot.onText(/\/video3$/, msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Uploading video...');

    fs.readFile(path.resolve(__dirname, 'video/small.mp4'), (err, video) => {
        bot.sendVideo(chatId, video)
        .then(() => {
            bot.sendMessage(chatId, 'The video has been uploaded.');
        });
    });
});

bot.onText(/\/video4$/, msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Uploading video...');

    fs.readFile(path.resolve(__dirname, 'video/small.mp4'), (err, video) => {
        bot.sendVideoNote(chatId, video)
        .then(() => {
            bot.sendMessage(chatId, 'The video has been uploaded.');
        });
    });
});