const keyboardButtons = require('./keyboard-buttons');

module.exports = {
    home: [
        [
            keyboardButtons.home.films,
            keyboardButtons.home.cinemas
        ],
        [
            keyboardButtons.home.favourite
        ]
    ],
    film: [
        [
            keyboardButtons.film.random
        ],
        [
            keyboardButtons.film.action,
            keyboardButtons.film.comedy
        ],
        [
            keyboardButtons.back
        ]
    ],
    cinemas: [
        [
            {
                text: 'Отправить местоположение',
                request_location: true
            }
        ],
        [keyboardButtons.back]
    ]
};