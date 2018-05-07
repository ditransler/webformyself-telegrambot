process.env["NTBA_FIX_319"] = 1; // fix for the node-telegram-bot-api module's issue

const TelegramBot = require('node-telegram-bot-api');
const helpers = require('./helpers');
const config = require('../config');
const keyboard = require('./keyboard');
const keyboardButtons = require('./keyboard-buttons');

helpers.logStart();

const bot = new TelegramBot(config.TOKEN, {
    polling: true
});

bot.on('message', msg => {
    console.log('Working, ', msg.from.first_name);

    switch(msg.text) {
        case keyboardButtons.home.favourite:
            break;
        case keyboardButtons.home.films:
            break;
        case keyboardButtons.home.cinemas:
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