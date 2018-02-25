module.exports = {
    logStart() {
        console.log('The bot has been started...');
    },

    getChatId(msg) {
        return msg.chat.id;
    },

    getItemUuid(source) {
        return source.substring(2, source.length);
    }
};