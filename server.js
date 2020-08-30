const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { getAudioDurationInSeconds } = require('get-audio-duration');

const app = express();
const port = process.env.PORT || 3015;
let allData = {
  allIds: [],
  byId: {},
};

// set public folder as root
app.use(express.static('public'));
app.use(bodyParser.json());

// listen for HTTP requests on port 3007
app.listen(port, () => {
  console.log('listening on %d', port);
});

// serve file location data as JSON
app.get('/json', function (req, res) {
  const { amount, type, hat, kick, snare } = req.query;
  switch (type) {
    case 'sound':
      serveSoundData(res, amount, hat, kick, snare);
      break;
  }
});

// serve audio file
app.get('/sound', (req, res) => {
  const { dir, file } = req.query;
  const url = `${decodeURIComponent(dir)}/${decodeURIComponent(file)}`;
  console.log('path', url);
  res.sendFile(path.resolve(url));
});

// receive an array of directory path strings
app.post('/paths', (req, res) => {
  console.log(req.body);
  getAllDirectories(req.body);
  res.send(req.body);
});

/**
 *
 *
 * @param {*} response
 * @param {Number} amount Amount of general samples
 * @param {Boolean} hat
 * @param {Boolean} kick
 * @param {Boolean} snare
 */
function serveSoundData(response, amount, hat, kick, snare) {
  const data = [];

  // the general sounds
  if (allData.byId.general) {
    const { dirData, numFiles } = allData.byId.general;
    for (let i = 0; i < amount; i++) {
      const fileIndex = Math.floor(Math.random() * numFiles);
      dirData.forEach(directory => {
        const { audioFiles, path, startIndex } = directory;
        if (fileIndex >= startIndex && fileIndex < startIndex + audioFiles.length) {
          data.push({
            dir: path,
            file: audioFiles[fileIndex - startIndex],
            sound: 'general',
          });
        }
      });
    }
  }

  // the drum sounds
  [
    { soundTypeId: 'hat', isRequested: hat },
    { soundTypeId: 'kick', isRequested: kick },
    { soundTypeId: 'snare', isRequested: snare },
  ].forEach(sound => {
    const { soundTypeId, isRequested } = sound;
    if (isRequested && allData.byId[soundTypeId]) {
      const { dirData, numFiles } =  allData.byId[soundTypeId];
      const fileIndex = Math.floor(Math.random() * numFiles);
      dirData.forEach(directory => {
        const { audioFiles, path, startIndex } = directory;
        if (fileIndex >= startIndex && fileIndex < startIndex + audioFiles.length) {
          data.push({
            dir: path,
            file: audioFiles[fileIndex - startIndex],
            sound: soundTypeId,
          });
        }
      });
    }
  });

  // get the audio duration of each file
  Promise.allSettled(data.map(getAudioDuration)).then(results => {
    response.json(data);
  });
}

/**
 * Get the duration in seconds of an audio file.
 * @param {Object} data Directory path and filename.
 * @returns {Object} Promise.
 */
function getAudioDuration(data) {
  return new Promise((resolve, reject) => {
    const { dir, file } = data;
    const url = `${dir}/${file}`;
    getAudioDurationInSeconds(url)
    .then(duration => {
      data.duration = duration;
      resolve(duration);
    })
    .catch((error) => {
      reject('Error:', error);
    });
  });
}

/**
 * Iterate all directories.
 * @param {Array} dirs 
 */
function getAllDirectories(dirs) {
  allData = {
    allIds: [],
    byId: {},
  };

  Promise.allSettled(dirs.map(getAllFiles)).then(() => {
    allData.allIds.forEach(soundCategoryId => {
      const soundCategory = allData.byId[soundCategoryId];
      soundCategory.numFiles = 0;
      soundCategory.dirData.forEach(dirData => {
        dirData.startIndex = soundCategory.numFiles;
        soundCategory.numFiles += dirData.audioFiles.length;
      });
    });
  });
}

/**
 * Iterate all files in a directory.
 * @param {String} dir Path to a directory.
 * @returns {Object} Promise.
 */
function getAllFiles(dir) {
  const { path, sound } = dir;
  return new Promise((resolve, reject) => {
    let audioFiles = [];
    fs.readdir(path, (err, files) => {
      if (err) {
        console.log('err', err);
        reject();
      } else {
        files.forEach(filename => {
          if ((/[^\s]+(\.(mp3|wav|aif))$/i).test(filename)) {
            audioFiles.push(filename);
          }
        });

        if (!allData.allIds.includes(sound)) {
          allData.allIds.push(sound);
          allData.byId[sound] = {
            dirData: [],
            numFiles: 0,
          };
        }

        allData.byId[sound].dirData.push({ path, audioFiles, });
        resolve();
      }
    });
  });
}
