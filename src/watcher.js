const fs = require('fs');
const utils = require('./utils');
const escape = require('validator/lib/escape');
const EventEmitter = require('events');


const createFile = (path) => {
  fs.writeFileSync(path, "{}");
  fs.chmodSync(path, 0o666); //rw-rw-rw
  utils.info(`Created file ${path}`);
}


// calculate end timestamp and escape string inputs
const formatData = data => {
  const duration = (!isNaN(data.durationMs)) ? parseInt(data.durationMs): null;
  const end = (duration) ? (Date.now() + duration).toString() : null;
  const title = (data.title) ? escape(data.title) : null;
  const artist = (data.artist) ? escape(data.artist) : null;
  const result = {artist, title, end};
  utils.info(`Processed following now playing info: ${JSON.stringify(result)}`);
  return result;
};

// Try parsing json object from string
const processFileContent = rawContent => {
  var json;
  try {
    json = JSON.parse(rawContent);
  } catch (e) {
    utils.error(`JSON parse error. ${e}`);
    return null;
  }
  return formatData(json);
};

let watcher;

const watch = filepath => {

  // Create EventEmiter for updates
  class WatcherEmitter extends EventEmitter {};
  const emitter = new WatcherEmitter();


  // Create file if it does not exist
  if (!fs.existsSync(filepath)) createFile(filepath);
  
  watcher = fs.watch(filepath);
  utils.info(`Watching file ${filepath}`) 

  watcher.on('change', () => {
    fs.readFile(filepath, (err, data) => {
      // TODO: Handling, if feasible. watch API is unstable
      if (err) throw err;
      const result = processFileContent(data);
      if (result) emitter.emit('newTrack', result);
    });
  });

  watcher.on('error', error => utils.error(`FileWatcher error. ${error}`));

  return emitter;
};

module.exports = {
  watch
}

