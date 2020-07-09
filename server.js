const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3015;

// set public folder as root
app.use(express.static('public'));
app.use(bodyParser.json());

// Listen for HTTP requests on port 3007
app.listen(port, () => {
  console.log('listening on %d', port);
});

app.post('/paths', (req, res) => {
  console.log(req.body);
  getAllDirectories(req.body);
  res.send(req.body);
});

const allData = [];
let numImages = 0;

/**
 * 
 * @param {*} dirs 
 */
function getAllDirectories(dirs) {
  Promise.all(dirs.map(getAllFiles)).then(() => {
    numImages = 0;
    allData.forEach(dirData => {
      dirData.startIndex = numImages;
      numImages += dirData.images.length;
      console.log(`dir data: ${dirData.startIndex} - ${dirData.images.length} - ${numImages}`);
    });
    console.log('num files', numImages);
  });
}

/**
 * 
 * @param {*} dir 
 */
function getAllFiles(dir) {
  return new Promise((resolve, reject) => {
    let images = [];
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log('err', err);
        reject();
      } else {
        files.forEach(filename => {
          if ((/[^\s]+(\.(mp3|wav|aif))$/i).test(filename)) {
            images.push(filename);
          }
        });
        allData.push({
          dir: dir,
          images: images
        });
        resolve();
      }
    });
  });
}
