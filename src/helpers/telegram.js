import config from "../config/config";

const { telegramBotToken } = config;
const telegramInstance = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const telegramBot = new telegramInstance(telegramBotToken, { polling: true });

export default class telegram {

    static sendMessage(chatId, msg) {
        telegramBot.sendMessage(chatId, msg);
    }
}

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message

//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"

//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, resp);
// });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     console.log("msg", msg)
//     // send a message to the chat ackclfnowledging receipt of their message
//     bot.sendMessage(chatId, 'Received your message');
// });