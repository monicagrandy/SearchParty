'use strict'

const neo = require('../db/neo.js');
const shortid = require('shortid');
const jwt = require('jwt-simple');
const config = require('../config/config.js');
const makeHunt = require('../lib/hunt/createEntireHunt.js');

module.exports = {
  huntMaker: (req, res) => {
    let keyword = req.body.keyword;
    let geolocation = req.body.geolocation;
    let username = jwt.decode({username: req.body.token}, config.secret);
    let huntID = req.body.huntID || null;
    let previousPlaces = req.body.previousPlaces;
    let previousTasks = req.body.previousTasks;
    let huntData;

    if(!huntID) {
      createNewHunt.initializeHunt(username)
      .then(hunt => {
        makeHunt.createHunt(keyword, previousPlaces, previousTasks, hunt.id)
        .then(resultsObj => {
          res.json(resultsObj);
        })
      })
        .catch(error => console.error(error));
    } else {
      makeHunt.createHunt(keyword, previousPlaces, previousTasks, hunt.id)
        .then(resultsObj => {
          res.json(resultsObj);
        })
          .catch(error => console.error(error));
    }
  }
}
