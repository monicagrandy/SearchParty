'use strict'
const app = require('./server/server.js');
// const port = 80;
const https = require('https');
const http = require('http');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('server.crt')
};

// app.listen(port, () => {
//   console.log(`Listening to ${port}`);
// });

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443, () => console.log('Https server listening on port 443') );