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
    const { id:chatId } = msg.chat;

    if (msg.text === 'Close') {
        bot.sendMessage(chatId, 'Closing keyboard...', {
            reply_markup: {
                remove_keyboard: true
            }
        });
    } else if (msg.text === 'Answer') {
        bot.sendMessage(chatId, 'Answering...', {
            reply_markup: {
                force_reply: true
            }
        });
    } else {
        bot.sendMessage(chatId, 'Keyboard', {
            reply_markup: {
                keyboard: [
                    [{
                        text: 'Send geolocation',
                        request_location: true
                    }],
                    ['Answer', 'Close'],
                    [{
                        text: 'Send contact',
                        request_contact: true
                    }]
                ],
                one_time_keyboard: true
            }
        });
    }
});
