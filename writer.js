let google = require('googleapis');
let authentication = require("./authentication");
const TeleBot = require('telebot');
const bot = new TeleBot('534687045:AAHH2pPr2tYPDMiyRTlv83QmmTAbIAChUjs');

var res;
var text;
var usr;
var time;

var id = [264414372, 255240607] //Дмитрий, Павел


bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome!'));

var datum = [[text]];

function appendCost(auth) {
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: '1dpG3kWhjxTCoDtJ6kQ5C9ESPpCA_kyYfzWq_u6Xq7u0',
        range: 'ТБот!A2:C', //Change Sheet1 if your worksheet's name is something else
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

    // authentication.authenticate().then((auth)=>{
    // appendCost(auth)});

bot.on(/^(-\d+)$/, (msg, props) => {
    usr = msg.from.last_name + " " + msg.from.first_name;
    time = new Date();
    if (msg.from.last_name == undefined) {
        msg.from.last_name = "";
    } else if (msg.from.first_name == undefined) {
        msg.from.first_name = "";
    }
    time = time.toUTCString();
    datum = [[props.match[1], usr, time]];
    authentication.authenticate().then((auth)=>{
    appendCost(auth);
    bot.sendMessage(msg.from.id, "На что?")
    bot.sendMessage(id[1], props.match[1] + " " + usr)
    bot.sendMessage(id[0], props.match[1] + " " + usr)

    // return bot.on('text', (msg) => msg.reply.text(msg.text));
    });
})

bot.on(/^(\d+)$/, (msg, props) => {
    usr = msg.from.last_name + " " + msg.from.first_name;
    time = new Date();
    if (msg.from.last_name == undefined) {
        msg.from.last_name = "";
    } else if (msg.from.first_name == undefined) {
        msg.from.first_name = "";
    }
    //time = time.getMonth()+1;
    time = time.toUTCString();
    datum = [[props.match[1], usr, time]];
    authentication.authenticate().then((auth)=>{
    appendCost(auth);
    bot.sendMessage(msg.from.id, "Хорошо");
    bot.sendMessage(id[1], props.match[1] + " " + usr)
    bot.sendMessage(id[0], props.match[1] + " " + usr);
    console.log("Success")
    // return bot.on('text', (msg) => msg.reply.text(msg.text));
});
})
bot.start();