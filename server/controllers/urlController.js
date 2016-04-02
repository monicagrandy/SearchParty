'use strict'

const urlStorage = require('../lib/url/urlStorage.js');
const config = require('../config/config.js');
const url = config.url;

module.exports = {
  urlChecker: (req, res) => {
    console.log('inside the url checker');
    if (url) {
      console.log(req.body);
      res.json(url);
    } else {
      console.log('sending localhostUrls ', urlStorage.localhostUrls());
      res.json(urlStorage.localhostUrls());
    }
  }
}
