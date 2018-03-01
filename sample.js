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
        range: 'TBot!A2:B', //Change Sheet1 if your worksheet's name is something else
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
        spreadsheetId: '1dpG3kWhjxTCoDtJ6kQ5C9ESPpCA_kyYfzWq_u6Xq7u0',
        range: 'TBot!A2:E',
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var rows = response.values;
        if (rows.length == 0) {
            console.log('No data found.');
        } else {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                // Print columns A and E, which correspond to indices 0 and 4.
                console.log('%s', row[0]);
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
// bot.use((ctx, next) => {
// ctx.state.role = 'guest';
//     return next()
// });


function checkState(req) {
    console.log(this.ctx.state.role)
}

// bot.on('text', (ctx) => {
//     switch (ctx.state.role){
//         case 'guest':
//             ctx.reply('Gimme comand, guest!');
//             break;
//         case 'booking':
//             break;
//         // case 'guest':
//         //     break;
//         // case 'guest':
//         //     break;
//         // case default:
//         //     break;
//     }
//     // console.log(ctx.state.role);
//     // checkState();
//     // return ctx.reply(`Hello ${ctx.state.role}`)
//     });
bot.command('start', (ctx) => {
    ctx.state.role = 'guest';
    ctx.reply('Hello, my new best friend!')
});

bot.command('ty', (ctx) => {
    console.log(ctx.state.role);

    if (ctx.state.role == 'guest'){
        console.log(ctx.state.role);

        ctx.state.role = 'friend';
        console.log(ctx.state.role);

        return ctx.reply('NP')
    } else {
        return false;
    }
});
bot.command('gg', (ctx) => {
    if (ctx.state.role == 'friend'){
        ctx.state.role = 'admin';
        return ctx.reply('WP')
    } else {
        return false;
    }
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