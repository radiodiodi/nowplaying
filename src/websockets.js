const WebSocket = require('ws');
const utils = require('./utils');

let wss;

const start = (host, port) => {
  utils.info(`Listening for Websockets on ${host} on port ${port}.`);

  wss = new WebSocket.Server({
      host: host,
      port: port
  });
  wss.on('connection', async (ws, req) => {
    ws.on('error', error => utils.error(`Websocket error. ${error}`));
  });
};

const sendData = data => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = {
  start,
  sendData
}
