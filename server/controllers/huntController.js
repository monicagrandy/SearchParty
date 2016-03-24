'use strict'

const neo = require('../db/neo.js');
const shortid = require('shortid');
const jwt = require('jwt-simple');
const config = require('../config/config.js');
const makeHunt = require('../lib/hunt/createEntireHunt.js');
const createNewHunt = require('../lib/hunt/createNewHuntID.js');

module.exports = {
  huntMaker: (req, res) => {
    let keyword = req.body.keyword;
    let geolocation = req.body.geolocation;
    let username = jwt.decode(req.body.token, config.secret).username;
    let huntID = req.body.huntID || null;
    let previousPlaces = req.body.previousPlaces;
    let previousTasks = req.body.previousTasks;
    let huntData;

    if(!huntID) {
      createNewHunt.initializeHunt(username)
      .then(hunt => {
        console.log("inside initalieHunt", hunt);
        makeHunt.createHunt(keyword, previousPlaces, previousTasks, hunt[0].huntID, geolocation)
        .then(resultsObj => {
          console.log("end of making hunt");
          console.log("create hunt done promising", resultsObj);
          res.json(resultsObj);
        })
      })
        .catch(error => console.error(error));
    } else {
      console.log('this is the huntID in the else statement ', huntID);
      makeHunt.createHunt(keyword, previousPlaces, previousTasks, huntID, geolocation)
        .then(resultsObj => {
          res.json(resultsObj);
        })
          .catch(error => console.error(error));
    }
  }
}