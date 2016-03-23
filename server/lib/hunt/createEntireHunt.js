'use strict'

const createNewHunt = require('./createNewHuntID.js');
const addHuntData = require('./addTasksAndLocationsToHunt.js');
const taskLookup = require('./getKeyWordTasksFromDB.js');
const yelpAPICall = require('../yelp/yelpAPICall.js');
const filter = require('../util/filterResults.js');
const random = require('../util/randomSelect.js');

module.exports = {
  createHunt: (keyword, previousPlaces, previousTasks, huntID) => {

    let randomTask;
    let randomPlace;

    return yelpAPICall.yelpPlacesBasedOnKeyword(keyword)
    .then(places => {
      let filteredPlaces = filter.filterResults(previousPlaces, places);
      randomPlace = filteredPlaces[random.randomNumberGen(filteredPlaces.length)];
      taskLookup.getTask(tasks => {
        let filteredTasks = filter.filterResults(previousTasks, tasks);
        randomTask = filteredTasks[random.randomNumberGen(filteredTasks.length)];
        addHuntData.addTaskAndLocationToHunt(randomTask, randomPlace, huntID);

        return new Promise((resolve, reject) => {
          if(tasks) {
            resolve({
              buisnesses: randomPlace,
              tasks: randomTask,
              huntID: huntID
            });
          } else {
            reject({error: "could not create hunt"});
          }
        })
      })
    })
    .catch(error => {
      console.error(error);
    })
  }

}
