'use strict'
const express = require('express');
const app = express();
const db = require('./db/backup.cypher');

require('./routes/routes.js')(app, express);
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('http://localhost:' + port);
});

module.exports = app;
