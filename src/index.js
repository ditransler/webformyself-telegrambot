process.env["NTBA_FIX_319"] = 1; // fix for the node-telegram-bot-api module's issue

const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const _ = require('lodash');
const geolib = require('geolib');
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
require('./models/user.model');

const Film = mongoose.model('films');
const Cinema = mongoose.model('cinemas');
const User = mongoose.model('users');

// database.films.forEach(f => new Film(f).save().catch(err => console.log(err)));
// database.cinemas.forEach(c => new Cinema(c).save().catch(err => console.log(err)));

// callback_data has limited size that's why we use shortcut values
const ACTION_TYPE = {
    TOGGLE_FAV_FILM: 'tff',
    SHOW_CINEMAS: 'sc',
    SHOW_CINEMAS_MAP: 'scm',
    SHOW_FILMS: 'sf'
};

// =========================================
const bot = new TelegramBot(config.TOKEN, {
    polling: true
});

bot.on('message', msg => {
    const chatId = helpers.getChatId(msg);

    switch(msg.text) {
        case keyboardButtons.home.favourite:
            showFavouriteFilms(chatId, msg.from.id);
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
            bot.sendMessage(chatId, 'Отправить местоположение', {
                reply_markup: {
                    keyboard: keyboard.cinemas
                }
            })
            break;
        case keyboardButtons.back:
            bot.sendMessage(chatId, `Что хотите посмотреть?`, {
                reply_markup: {
                    keyboard: keyboard.home
                }
            });
            break;
    }

    if (msg.location) {
        console.log(msg.location);
        getCinemasInCoords(chatId, msg.location);
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

    Promise.all([
        Film.findOne({uuid: filmUuid}),
        User.findOne({telegramId: msg.from.id})
    ]).then(([film, user]) => {
        let isFav = false;

        if (user) {
            isFav = user.films.includes(film.uuid);
        }

        const favText = isFav ? 'Удалить из избранного' : 'Добавить в избранное';

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
                            text: favText,
                            callback_data: JSON.stringify({
                                type: ACTION_TYPE.TOGGLE_FAV_FILM,
                                filmUuid: film.uuid,
                                isFav
                            })
                        },
                        {
                            text: 'Показать кинотеатры',
                            callback_data: JSON.stringify({
                                type: ACTION_TYPE.SHOW_CINEMAS,
                                cinemasUuids: film.cinemas
                            })
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
    });
});

bot.onText(/\/c(.+)/, (msg, [source, match]) => {
    const cinemaUuid = helpers.getItemUuid(source);
    const chatId = helpers.getChatId(msg);

    Cinema.findOne({uuid: cinemaUuid}).then(cinema => {
        bot.sendMessage(chatId, `Кинотеатр <strong>${cinema.name}</strong>`, {
            parse_mode: 'html',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: cinema.name,
                            url: cinema.url
                        },
                        {
                            text: 'Показать на карте',
                            callback_data: JSON.stringify({
                                type: ACTION_TYPE.SHOW_CINEMAS_MAP,
                                lat: cinema.location.latitude,
                                lon: cinema.location.longitude
                            })
                        }
                    ],
                    [
                        {
                            text: 'Показать фильмы',
                            callback_data: JSON.stringify({
                                type: ACTION_TYPE.SHOW_FILMS,
                                filmUuids: cinema.films
                            })
                        }
                    ]
                ]
            }
        });
    });
});

bot.on('callback_query', query => {
    const userId = query.from.id;
    let data;

    try {
        data = JSON.parse(query.data);
    } catch (err) {
        throw new Error('Data is not an object');
    }

    const { type } = data;

    switch(type) {
        case ACTION_TYPE.TOGGLE_FAV_FILM:
            toggleFavouriteFilm(userId, query.id, data);
            break;
        case ACTION_TYPE.SHOW_CINEMAS:
            break;
        case ACTION_TYPE.SHOW_CINEMAS_MAP:
            break;
        case ACTION_TYPE.SHOW_FILMS:
            break;
        default:
            console.log(`"${type}" doesn't match any action type.`);
    }
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

function getCinemasInCoords(chatId, location) {
    Cinema.find({}).then(cinemas => {

        cinemas.forEach(c => {
            c.distance = geolib.getDistance(location, c.location) / 1000; // m -> km
        });

        cinemas = _.sortBy(cinemas, 'distance');

        const html = cinemas.map((c, i) => {
            return `<b>${i + 1})</b> ${c.name}. <em>Расстояние</em> - <strong>${c.distance}</strong> км. /c${c.uuid}`;
        }).join('\n');

        sendHTML(chatId, html, 'home');
    });
}

function toggleFavouriteFilm(userId, queryId, {filmUuid, isFav}) {
    let userPromise;

    User.findOne({telegramId: userId})
    .then(user => {
        if (user) {
            if (isFav) {
                user.films = user.films.filter(uuid => uuid !== filmUuid);
            } else {
                user.films.push(filmUuid);
            }
            userPromise = user;
        } else {
            userPromise = new User({
                telegramId: userId,
                films: [filmUuid]
            })
        }

        return userPromise.save();
    })
    .then(_ => {
        const answerText = isFav ? 'Удалено' : 'Добавлено';

        bot.answerCallbackQuery({
            callback_query_id: queryId,
            text: answerText
        })
    })
    .catch(err => console.log(err));
}

function showFavouriteFilms(chatId, userId) {
    User.findOne({ telegramId: userId })
    .then(user => {
        if (!user) {
            sendHTML(chatId, 'Вы пока ничего не добавили', 'home');
            return false;
        }

        return Film.find({uuid: {$in: user.films}});
    })
    .then(films => {
        if (!films || !films.length) {
            sendHTML(chatId, 'Вы пока ничего не добавили', 'home');
            return false;
        }

        let html = films.map((f, i) => {
            return `<b>${i + 1})</b> ${f.name} - <b>${f.rate}</b> (/f${f.uuid})`;
        }).join('\n');

        sendHTML(chatId, html, 'home');
    })
    .catch(err => console.log(err));
}