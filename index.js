process.env["NTBA_FIX_319"] = 1; // fix for the node-telegram-bot-api module's issue

const fs = require('fs');
const path = require('path');
const debug = require('./helpers');
const TelegramBot = require('node-telegram-bot-api');
const toketPath = path.resolve(__dirname, 'token.txt');
const paymentToketPath = path.resolve(__dirname, 'payment-token.txt');
const TOKEN = fs.readFileSync(toketPath, 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    return data;
});
const PAYMENT_TOKEN = fs.readFileSync(paymentToketPath, 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    return data;
});

console.log('Bot has been started ...');

// https://core.telegram.org/bots/payments
// https://core.telegram.org/bots/api#sendinvoice
// https://kassa.yandex.ru/blog/telegram

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
          timeout: 10
        }
    }
});

bot.onText(/\/pay/, msg => {
    const chatId = msg.chat.id;

    bot.sendInvoice(
        chatId,
        'Audi A4',
        'Best car ever in telegram bot',
        'payload',
        PAYMENT_TOKEN,
        'SOME_RANDOM_STRING_KEY',
        'RUB',
        [
          {
            label: 'audi_a4',
            amount: 30000 // minimal units i.e. kopecks
          }
        ],
        {
          photo_url: 'https://a.d-cd.net/566858as-480.jpg',
          need_name: true,
          is_flexible: true
        }
      );
});