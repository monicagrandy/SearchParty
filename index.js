'use strict'
const app = require('./server/server.js');
const port = 80;

app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
