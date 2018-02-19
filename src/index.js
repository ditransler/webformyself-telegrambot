process.env["NTBA_FIX_319"] = 1; // fix for the node-telegram-bot-api module's issue

const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const helpers = require('./helpers');
const config = require('../config');
const keyboard = require('./keyboard');
const keyboardButtons = require('./keyboard-buttons');

helpers.logStart();

mongoose.connect(config.DB_URL)
.then(() => console.log('MongoDB connected.'))
.catch((err) => console.log('MongoDB connection failed', err));

const bot = new TelegramBot(config.TOKEN, {
    polling: true
});

bot.on('message', msg => {
    const chatId = helpers.getChatId(msg);

    switch(msg.text) {
        case keyboardButtons.home.favourite:
            break;
        case keyboardButtons.home.films:
            bot.sendMessage(chatId, `Выберите жанр:`, {
                reply_markup: {
                    keyboard: keyboard.film
                }
            });
            break;
        case keyboardButtons.home.cinemas:
            break;
        case keyboardButtons.back:
            bot.sendMessage(chatId, `Что хотите посмотреть?`, {
                reply_markup: {
                    keyboard: keyboard.home
                }
            });
            break;
    }
});

bot.onText(/\/start/, msg => {
    const text = `Здравствуйте, ${msg.from.first_name}\nВыберите команду для начала работы:`;

    bot.sendMessage(helpers.getChatId(msg), text, {
        reply_markup: {
            keyboard: keyboard.home
        }
    });
});