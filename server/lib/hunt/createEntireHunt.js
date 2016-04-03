'use strict'

const createNewHunt = require('./createNewHuntID.js');
const addHuntData = require('./addTasksAndLocationsToHunt.js');
const taskLookup = require('./getKeywordTasksFromDB.js');
const yelpAPICall = require('../yelp/yelpAPICall.js');
const filter = require('../util/filterResults.js');
const random = require('../util/randomSelect.js');

module.exports = {
  createHunt: (keyword, previousPlaces, previousTasks, huntID, geolocation, huntName) => {

    let randomTask;
    let randomPlace;
    // let huntID = hunt[0].id
    console.log("this is the huntid from hunt controller", huntID);
    // console.log("this is the hunt inside create entire hunt", hunt[0]);

    return yelpAPICall.yelpPlacesBasedOnKeyword(keyword, geolocation)
    .then(places => {
      // console.log("inside yelp promise", places)
      let filteredPlaces = filter.filterExisitingResults(previousPlaces, places.businesses);
      // console.log("filtered Places from YELP", filteredPlaces);
      randomPlace = filteredPlaces[random.randomNumberGen(filteredPlaces.length)];
      console.log("random place object", randomPlace);
      return taskLookup.getTask(keyword)
      .then(tasks => {
        console.log("inside create entire hunt", tasks);
        let filteredTasks = filter.filterExisitingResults(previousTasks, tasks);
        console.log("filtered Tasks", filteredTasks);
        randomTask = filteredTasks[random.randomNumberGen(filteredTasks.length)];
        return addHuntData.addTaskAndLocationToHunt(randomTask, randomPlace, huntID)

        .then(data => {
          console.log("data at the end of the promised land", data);
          return new Promise((resolve, reject) => {
            if(data) {
              let objectToSend = {
                businesses: randomPlace,
                tasks: randomTask,
                huntID: huntID,
                huntName: huntName
              };
              console.log("object to send", objectToSend);
              resolve(objectToSend);
            } else {
              reject({error: "could not create hunt"});
            }
          })
        })

      })
    })
    .catch(error => {
      console.error(error);
    })
  }

}
