var irc = require('irc');
var options = require('../../config.json').connectors.irc.irchighway;
var net = require('net');

var nick = "loa-user-" + Math.floor(Math.random() * 100);

var bot = new irc.Client("irc.irchighway.net", nick, options);

bot.addListener('error', function(error) {
  console.log(error);
});

bot.add(listener('ctcp-privmsg', function(from, to, text, message) {
  console.log(message);

  if (from != 'Search') {
    return;
  }

  var parts = text.split(' ');
  var port = parts[4];
  var ip = long2ip(parts[3]);

  var client = new net.Socket();

  client.connect(port, '107.170.227.56', function() {
    console.log('Connected to remote server');
  });

  client.on('data', function(data) {
    console.log("data received: " + data);
    fs.writeFile('./dcc', data, function(err) {
      if (err) {
        return console.error(err);
      }
      console.log("Completed file transfer!");
      client.destroy();
    });
  });

});

function search(query) {
  bot.say('@search' + query);
}

function long2ip(ip) {
  if (!isFinite(ip))
    return false;

  return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
}
