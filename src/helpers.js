module.exports = {
    logStart() {
        console.log('The bot has been started...');
    },

    getChatId(msg) {
        return msg.chat.id;
    }
};