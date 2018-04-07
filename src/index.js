require('dotenv').config()
const watcher = require('./watcher');
const websockets = require('./websockets');

wa = watcher.watch(process.env.FILEPATH);
websockets.start(process.env.HOST, process.env.PORT);

wa.on('newTrack', (trackData) => websockets.sendData(trackData))
