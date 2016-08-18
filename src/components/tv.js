const net = require('net')
const exec = require('child_process').exec;
const base64Encode = require('./utils/base64Encode.js')

const tv = (config) => {

  if (!config.ip) throw new Error("TV IP address is required");

  config.host = config.host || {
      ip: "127.0.0.1",
      mac: "00:00:00:00",
      name: "NodeJS Samsung Remote"
    };

  config.appString = config.appString || "iphone..iapp.samsung";
  config.tvAppString = config.tvAppString || "iphone.UN60D6000.iapp.samsung";
  config.port = config.port || 55000;
  config.timeout = config.timeout || 5000;

  var _socketChunkOne = function () {
      var ipEncoded = base64Encode(config.host.ip),
        macEncoded = base64Encode(config.host.mac);

      var message = String.fromCharCode(0x64) +
        String.fromCharCode(0x00) +
        String.fromCharCode(ipEncoded.length) +
        String.fromCharCode(0x00) +
        ipEncoded +
        String.fromCharCode(macEncoded.length) +
        String.fromCharCode(0x00) +
        macEncoded +
        String.fromCharCode(base64Encode(config.host.name).length) +
        String.fromCharCode(0x00) +
        base64Encode(config.host.name);

      return String.fromCharCode(0x00) +
        String.fromCharCode(config.appString.length) +
        String.fromCharCode(0x00) +
        config.appString +
        String.fromCharCode(message.length) +
        String.fromCharCode(0x00) +
        message;
    },
    _socketChunkTwo = function(command) {
      var message = String.fromCharCode(0x00) +
        String.fromCharCode(0x00) +
        String.fromCharCode(0x00) +
        String.fromCharCode(base64Encode(command).length) +
        String.fromCharCode(0x00) +
        base64Encode(command);

      return String.fromCharCode(0x00) +
        String.fromCharCode(config.tvAppString.length) +
        String.fromCharCode(0x00) +
        config.tvAppString +
        String.fromCharCode(message.length) +
        String.fromCharCode(0x00) +
        message;
    };

  const send = (command, done) => {
    if (!command) throw new Error ('Missing command');

    var socket = net.connect(config.port, config.ip);

    socket.setTimeout(config.timeout);

    socket.on('connect', function() {
      socket.write(_socketChunkOne());
      socket.write(_socketChunkTwo(command));
      socket.end();
      socket.destroy();
      done(false);
    });

    socket.on('close', function () {
      //console.log('Samsung Remote Client: disconnected from ' + config.ip + ':' + config.port);
    });

    socket.on('error', function(error) {
      var errorMsg;

      if (error.code === 'EHOSTUNREACH' || error.code === 'ECONNREFUSED') {
        errorMsg = 'Samsung Remote Client: Device is off or unreachable';
      } else {
        errorMsg = 'Samsung Remote Client: ' + error.code;
      }

      done(errorMsg);
    });

    socket.on('timeout', function() {
      done("Timeout");
    });
  };

  const isAlive = (done) => {
    return exec("ping -c 1 " + config.ip, function (error, stdout, stderr) {
      if (error) {
        done(0);
      } else {
        done(1);
      }
    });
  };

  return {
    isAlive: isAlive,
    send: send
  }
}

module.exports = tv