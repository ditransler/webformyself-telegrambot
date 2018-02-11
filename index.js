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

bot.on('message', msg => {
    const html = `
        <strong>Hello, ${msg.from.first_name}</strong>
        <i>Test Message</i>
        <pre>
            ${debug(msg)}
        </pre>
    `;

    bot.sendMessage(msg.chat.id, html, {
        parse_mode: 'HTML'
    });
});
