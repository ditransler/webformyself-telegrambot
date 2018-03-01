process.env["NTBA_FIX_319"] = 1; // fix for the node-telegram-bot-api module's issue

const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const helpers = require('./helpers');
const config = require('../config');
const keyboard = require('./keyboard');
const keyboardButtons = require('./keyboard-buttons');
const database = require('../database.json');

helpers.logStart();

mongoose.connect(config.DB_URL)
.then(() => console.log('MongoDB connected.'))
.catch((err) => console.log('MongoDB connection failed', err));

// Import models
require('./models/film.model');
require('./models/cinema.model');

const Film = mongoose.model('films');
const Cinema = mongoose.model('cinemas');

// database.films.forEach(f => new Film(f).save().catch(err => console.log(err)));
// database.cinemas.forEach(c => new Cinema(c).save().catch(err => console.log(err)));

// =========================================
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
        case keyboardButtons.film.comedy:
            sendFilmsByQuery(chatId, {type: 'comedy'});
            break;
        case keyboardButtons.film.action:
            sendFilmsByQuery(chatId, {type: 'action'});
            break;
        case keyboardButtons.film.random:
            sendFilmsByQuery(chatId, {});
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

bot.onText(/\/f(.+)/, (msg, [source, match]) => {
    const chatId = helpers.getChatId(msg);
    const filmUuid = helpers.getItemUuid(source);

    Film.findOne({uuid: filmUuid}).then(film => {
        const caption = `
            Название: ${film.name}\n
            Год: ${film.year}\n
            Рейтинг: ${film.rate}\n
            Длительность: ${film.length}\n
            Страна: ${film.country}
        `.replace(/^ +| +$/gm, '');

        bot.sendPhoto(chatId, film.picture, {
            caption,
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Добавить в избранное',
                            callback_data: film.uuid
                        },
                        {
                            text: 'Показать кинотеатры',
                            callback_data: film.uuid
                        }
                    ],
                    [
                        {
                            text: `Кинопоиск ${film.name}`,
                            url: film.link
                        }
                    ]
                ]
            }
        })
    })
});

// =========================================

function sendFilmsByQuery(chatId, query) {
    Film.find(query).then(films => {

        const html = films.map((f, i) => {
            return `<b>${i + 1})</b> ${f.name} - /f${f.uuid}`
        }).join('\n');

        sendHTML(chatId, html, 'films');
    });
}

function sendHTML(chatId, html, kbName = null) {
    const options = {
        parse_mode: 'HTML'
    };

    if (kbName) {
        options['reply_markup'] = {
            keyboard: keyboard[kbName]
        }
    }

    bot.sendMessage(chatId, html, options);
}