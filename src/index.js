process.env["NTBA_FIX_319"] = 1; // fix for the node-telegram-bot-api module's issue

const TelegramBot = require('node-telegram-bot-api');
const helpers = require('./helpers');
const config = require('../config');

helpers.logStart();

const bot = new TelegramBot(config.TOKEN, {
    polling: true
});

bot.on('message', msg => {
    console.log('Working, ', msg.from.first_name);
});