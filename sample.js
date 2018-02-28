const Telegraf = require('telegraf');
let google = require('googleapis');
let authentication = require("./authentication");
const Telegram = require('telegraf/telegram');
const fs       = require('fs');
const Extra    = require('telegraf/extra');

let datum    = [['test', '1', '1']];

const bot = new Telegraf('534687045:AAHH2pPr2tYPDMiyRTlv83QmmTAbIAChUjs');
// const telegram = new Telegram('534687045:AAHH2pPr2tYPDMiyRTlv83QmmTAbIAChUj');
bot.webhookReply = true;

function appendCost(auth) {
    let sheets = google.sheets('v4');
    sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: '1dpG3kWhjxTCoDtJ6kQ5C9ESPpCA_kyYfzWq_u6Xq7u0',
        range: 'ТБот!A2', //Change Sheet1 if your worksheet's name is something else
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

function getData(auth) {
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1dpG3kWhjxTCoDtJ6kQ5C9ESPpCA_kyYfzWq_u6Xq7u0',
        range: 'ТБот!A2:B', //Change Sheet1 if your worksheet's name is something else
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var rows = response.values;
        if (rows.length === 0) {
            console.log('No data found.');
        } else {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                console.log(row.join(", "));
            }
        }
    });
}

function listMajors(auth) {
    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Class Data!A2:E',
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var rows = response.values;
        if (rows.length == 0) {
            console.log('No data found.');
        } else {
            console.log('Name, Major:');
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                // Print columns A and E, which correspond to indices 0 and 4.
                console.log('%s, %s', row[0], row[4]);
            }
        }
    });
}

bot.command('book', (ctx) => {
    // Some logic goes here
    datum = [[ctx.from.id, ctx.from.first_name + ' ' + ctx.from.last_name, ctx.from.username]];

    // Append data and send response to the user
    authentication.authenticate().then((auth)=>{
        // appendCost(auth);
        listMajors(auth);
        ctx.reply("Goods")
    })
});

// Naive authorization middleware
bot.use((ctx, next) => {
    if (!ctx.state.role) {
        ctx.state.role = 'Гость';
    } else if (true) {

    }


    return next()
});

bot.on('text', (ctx) => {
    return ctx.reply(`Hello ${ctx.state.role}`)
    });

// bot.hears(/ВС .+/i, (ctx) => {
//     // Some logic goes here
//
//
//     // Append data and send response to the user
//     authentication.authenticate().then((auth)=>{
//     appendCost(auth);
//     // console.log(ctx);
//     ctx.reply("Goods")
//     })
// });

bot.startPolling();

require('http')
    .createServer(bot.webhookCallback('/secret-path'))
    .listen(3000);