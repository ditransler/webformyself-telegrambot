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

bot.on('inline_query', query => {
    const results = [];

    for (let i = 0; i < 5; i++) {
        results.push({
            type: 'article',
            id: i.toString(),
            title: `Title ${i}`,
            input_message_content: {
                message_text: `Article #${i + 1}`
            }
        })
    }

    bot.answerInlineQuery(query.id, results, {
        cache_time: 0
    });
});