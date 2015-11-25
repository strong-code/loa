// var express = require('express');
var irchighwayBot = require('./connectors/irchighway/bot.js');
// var app = express();

// app.get('/', function(req, res) {
//   res.send('Hello World');
// });
//
// var server = app.listen(3000, function() {
//   var host = server.address().address;
//   var port = server.address().port;
//
//   console.log('Server started at http://%s:%s', host, port);
// });

irchighwayBot.run();
