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

const inline_keyboard = [
    [
        {
            text: 'Forward',
            callback_data: 'forward'
        },
        {
            text: 'Reply',
            callback_data: 'reply'
        }
    ],
    [
        {
            text: 'Edit',
            callback_data: 'edit'
        },
        {
            text: 'Delete',
            callback_data: 'delete'
        }
    ]
];

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
          timeout: 10
        }
    }
});

bot.on('callback_query', query => {
    const { chat, message_id, text } = query.message;

    switch (query.data) {
        case 'forward':
            // to, from, what
            bot.forwardMessage(chat.id, chat.id, message_id);
            break;
    }

    bot.answerCallbackQuery(query.id);
});

bot.onText(/\/start/, (msg, [source, match]) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Keyboard', {
        reply_markup: {
            inline_keyboard
        }
    })
});