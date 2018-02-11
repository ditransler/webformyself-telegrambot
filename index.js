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

    bot.sendMessage(chatId, 'Inline keyboard', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Google',
                        url: 'https://google.com'
                    }
                ],
                [
                    {
                        text: 'Reply',
                        callback_data: 'Reply'
                    },
                    {
                        text: 'Forward',
                        callback_data: 'Forward'
                    }
                ]
            ]
        }
    });
});

bot.on('callback_query', query => {
    bot.answerCallbackQuery(query.id, `${query.data}`);
});