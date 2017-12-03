let google = require('googleapis');
let authentication = require("./authentication");
const TeleBot = require('telebot');
const bot = new TeleBot('480404707:AAESFqe-I2zCXQmrRVUpxc_-PtozRgO7QGE');

var res;
var text;
var usr;
var time;



bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome!'));




var datum = [[text]];


function appendCost(auth) {
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: '19RmsOkGC6m7gq-Ti-2uXS4WPbCIWdmwIPXJVKLFZW80',
        range: 'TelegaAPI!A2:C', //Change Sheet1 if your worksheet's name is something else
        valueInputOption: "USER_ENTERED",
        resource: {
            values: datum
        }
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        } else {
            console.log("Costs Appended");
}
});
}


bot.on(/^(-\d+)$/, (msg, props) => {
    usr = msg.from.username;
    time = new Date();
    time = time.toUTCString();
    datum = [[props.match[1], usr, time]];
    authentication.authenticate().then((auth)=>{
    appendCost(auth);
    bot.sendMessage(msg.from.id, "На что?")
    // return bot.on('text', (msg) => msg.reply.text(msg.text));
});
})

bot.on(/^(\d+)$/, (msg, props) => {
    usr = msg.from.username;
    time = new Date();
    //time = time.getMonth()+1;
    time = time.toUTCString();
    datum = [[props.match[1], usr, time]];
    authentication.authenticate().then((auth)=>{
    appendCost(auth);
    bot.sendMessage(msg.from.id, "Хорошо");
    // return bot.on('text', (msg) => msg.reply.text(msg.text));
});
})
bot.start();