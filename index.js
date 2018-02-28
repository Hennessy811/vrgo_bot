const TeleBot = require('telebot');
const bot = new TeleBot('480404707:AAESFqe-I2zCXQmrRVUpxc_-PtozRgO7QGE');

var res;
function attent() {
    var res = 500;
    //console.log(res);
}
attent();

bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome!'));

bot.on(/^\/spent (\d+)$/, (msg, props) => {
    const text = props.match[1];
    bot.sendMessage(msg.from.id, "На что?", { replyToMessage: msg.message_id });
    return bot.on('text', (msg) => msg.reply.text(msg.text));
});

bot.start();