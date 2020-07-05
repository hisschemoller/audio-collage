const express = require('express');

const app = express();
const port = process.env.PORT || 3015;

// set public folder as root
app.use(express.static('public'));

// Listen for HTTP requests on port 3007
app.listen(port, () => {
  console.log('listening on %d', port);
});
