process.env["NTBA_FIX_319"] = 1; // fix fot the node-telegram-bot-api module's issue

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

bot.onText(/\/start/, msg => {
    const { id } = msg.chat;

    bot.sendMessage(id, debug(msg));
});

bot.onText(/\/help (.+)/, (msg, [source, match]) => {
    const { id } = msg.chat;

    bot.sendMessage(id, debug(match));
});
