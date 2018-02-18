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

bot.onText(/\/doc1$/, msg => {
    bot.sendDocument(msg.chat.id, 'docs/wfm.xlsx');
});

bot.onText(/\/doc2$/, msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Upload start...');

    fs.readFile(path.resolve(__dirname, 'docs/wfm.zip'), (err, file) => {
        bot.sendDocument(chatId, file, {
            caption: 'Additional text'
        })
        .then(() => {
            bot.sendMessage(chatId, 'Updload finished.');
        });
    });
});