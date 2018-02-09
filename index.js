process.env["NTBA_FIX_319"] = 1; // fix fot the node-telegram-bot-api module's issue

const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const toketPath = path.resolve(__dirname, 'token.txt');
const TOKEN = fs.readFileSync(toketPath, 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    return data;
});

const bot = new TelegramBot(TOKEN, {
    polling: true
});

bot.on('message', (msg) => {
    console.log(msg);
    bot.sendMessage(msg.chat.id, `Hello, ${msg.from.first_name}!`);
});
