var irc = require('irc');
var options = require('../../config.json').connectors.irc.irchighway;
var dcc = require('./lib/dcc.js');

module.exports = {

  run: function() {

    var nick = "loa-user-34"// + Math.floor(Math.random() * 100);
    console.log("Using nick " + nick);
    var bot = new irc.Client("irc.irchighway.net", nick, options);

    bot.addListener('error', function(error) {
      console.log(error);
    });

    bot.addListener('message', function(from, to, text, message) {
      if (from == 'BradPitt') {
        var parts = text.split(' ');
        bot.say(parts[0], parts.slice(1).join(' '));
      }
    });

    bot.addListener('join', function(channel, nickname, message) {
      if (nickname == nick) {
        console.log("Joined " + channel);
      }
    });

    bot.addListener('ctcp-privmsg', function(from, to, text, message) {

      // Only accept DCC requests from nicks we trust (defined in config.json)
      if (options.dccAutoAccept.indexOf(from) < 0) {
        return;
      } else {
        console.log(">>> DCC accepted from " + from);
        dcc.get(from, to, text, function(){});
      }
    });
  },

  search: function(query) {
    bot.say('@search ' + query);
  }

}
