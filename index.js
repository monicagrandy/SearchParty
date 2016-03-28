'use strict'
const app = require('./server/server.js');
const config = require('./server/config/config.js');
const httpPort = config.HTTPPORT || 8000;
const httpsPort = config.HTTPSPORT || 8001;
const https = require('https');
const http = require('http');
const fs = require('fs');

const ca = [];
let chain = fs.readFileSync('getsearchparty_com.ca-bundle', 'utf8');
chain = chain.split('\n');
let cert = [];

for (let i = 0; i < chain.length; i++) {
  let line = chain[i];
  if (!(line.length !== 0)) {
    continue;
  }
  cert.push(line);
  if (line.match(/-END CERTIFICATE-/)) {
    ca.push(cert.join('\n'));
    cert = [];
  }
}

const options = {
  ca: ca,
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('server.crt')
};

// Create an HTTP service.
http.createServer(app).listen(httpPort, () => console.log(`express HTTP server listening on port ${httpPort}`));
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(httpsPort, () => console.log(`express HTTPS server listening on port ${httpsPort}`) );