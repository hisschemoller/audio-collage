const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { getAudioDurationInSeconds } = require('get-audio-duration');

const app = express();
const port = process.env.PORT || 3015;
const allData = [];
let numFiles = 0;

// set public folder as root
app.use(express.static('public'));
app.use(bodyParser.json());

// listen for HTTP requests on port 3007
app.listen(port, () => {
  console.log('listening on %d', port);
});

// serve file location data as JSON
app.get('/json', function (req, res) {
  const { amount, type } = req.query;
  switch (type) {
    case 'sound':
      serveSoundData(res, amount);
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
 * @param {*} amount
 */
function serveSoundData(response, amount) {
  const data = [];
  for (let i = 0, n = amount; i < n; i++) {
    const fileIndex = Math.floor(Math.random() * numFiles);
    allData.forEach(dirData => {
      if (fileIndex >= dirData.startIndex && fileIndex < dirData.startIndex + dirData.audioFiles.length) {
        data.push({
          dir: dirData.dir,
          file: dirData.audioFiles[fileIndex - dirData.startIndex]
        });
      }
    });
  }

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
  allData.length = 0;
  Promise.allSettled(dirs.map(getAllFiles)).then(() => {
    numFiles = 0;
    allData.forEach(dirData => {
      dirData.startIndex = numFiles;
      numFiles += dirData.audioFiles.length;
      console.log(`dir data: ${dirData.startIndex} - ${dirData.audioFiles.length} - ${numFiles}`);
    });
    console.log('num files', numFiles);
  });
}

/**
 * Iterate all files in a directory.
 * @param {String} dir Path to a directory.
 * @returns {Object} Promise.
 */
function getAllFiles(dir) {
  return new Promise((resolve, reject) => {
    let audioFiles = [];
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log('err', err);
        reject();
      } else {
        files.forEach(filename => {
          if ((/[^\s]+(\.(mp3|wav|aif))$/i).test(filename)) {
            audioFiles.push(filename);
          }
        });
        allData.push({
          dir: dir,
          audioFiles: audioFiles
        });
        resolve();
      }
    });
  });
}
