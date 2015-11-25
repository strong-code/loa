var fs = require('fs');
var net = require('net');
var unzip = require('unzip');
var streamBuffers = require('stream-buffers');

module.exports = {

  get: function(from, to, text, callback) {

    var opts = createOptions(text.split(' '));
    var client = new net.Socket();
    var buffer = new Buffer(0, 'utf-8');

    client.connect(opts.port, opts.ip, function() {
      console.log('Connected to remote server');
    });

    client.on('error', function(err) {
      console.error(err);
      client.destroy();
    });

    client.on('data', function(data) {
      buffer = Buffer.concat([buffer, new Buffer(data, 'binary')]);
      if (client.bytesRead >= opts.fileSize) {
        console.log("All data received, unzipping and writing to file locally now");
        writeToFile(buffer);
        client.destroy();
      }
    });
  }

};

function writeToFile(buffer) {
  var bufferStream = new streamBuffers.ReadableStreamBuffer({
    frequency: 10,
    chunkSize: 2048
  });

  bufferStream.put(buffer);
  bufferStream.pipe(unzip.Extract({ path: './data.txt' }));
  console.log("Data written!");
}

function createOptions(parts) {
  return {
    port: parts[4],
    ip: long2ip(parts[3]),
    fileSize: parts[5]
  };
}

function long2ip(ip) {
  if (!isFinite(ip)) {
    return false;
  }
  return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
}
