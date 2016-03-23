'use strict'

const neo = require('../db/neo.js');
const shortid = require('shortid');
const jwt = require('jwt-simple');
const config = require('../config/config.js');
const createNewHunt = require('../lib/hunt/createNewHuntID.js');
const addHuntData = require('../lib/hunt/addTaskAndLocationToHunt.js');
const taskLookup = require('../lib/hunt/getKeyWordTasksFromDB.js');
const yelpAPICall = require('../lib/yelp/yelpAPICall.js');
const filter = require('../lib/util/filterResults.js');
const random = require('../lib/util/randomSelect.js');

module.exports = {
  huntMaker: (req, res) => {
    let keyword = req.body.keyword;
    let geolocation = req.body.geolocation;
    let username = jwt.decode({username: req.body.token}, config.secret);
    let huntID = req.body.huntID || null;
    let previousPlaces = req.body.previousPlaces;
    let previousTasks = req.body.previousTasks;
    let randomTask;
    let randomPlace;

    if(!huntID) {
      createNewHunt.initializeHunt(username)
      .then(hunt => {
        huntID = hunt.id;
        yelpAPICall.yelpPlacesBasedOnKeyword(keyword)
        .then(places => {
          let filteredPlaces = filter.filterResults(previousPlaces, places);
          randomPlace = filteredPlaces[random.randomNumberGen(filteredPlaces.length)];
          taskLookup.getTask(tasks => {
            let filteredTasks = filter.filterResults(previousTasks, tasks);
            randomTask = filteredTasks[random.randomNumberGen(filteredTasks.length)];
            addHuntData.addTaskAndLocationToHunt(randomTask, randomPlace, huntID);
            res.json({
              buisnesses: randomPlace,
              tasks: randomTask,
              huntID: huntID
            })
          })
        })
      })
    } else {
      yelpAPICall.yelpPlacesBasedOnKeyword(keyword)
      .then(places => {
        let filteredPlaces = filter.filterResults(previousPlaces, places);
        randomPlace = filteredPlaces[random.randomNumberGen(filteredPlaces.length)];
        taskLookup.getTask(tasks => {
          let filteredTasks = filter.filterResults(previousTasks, tasks);
          randomTask = filteredTasks[random.randomNumberGen(filteredTasks.length)];
          addHuntData.addTaskAndLocationToHunt(randomTask, randomPlace, huntID);
          res.json({
            buisnesses: randomPlace,
            tasks: randomTask,
            huntID: huntID
          })
        })
      })
    }
  }
}
