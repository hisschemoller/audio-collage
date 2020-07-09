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
  res.send(req.body);
});
