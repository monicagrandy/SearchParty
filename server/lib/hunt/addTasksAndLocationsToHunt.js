'use strict'

const neo = require('../../db/neo.js');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
const placeUtil = require('../util/buildPlaceInformation.js');

module.exports = {

  addTaskAndLocationToHunt: (task, location, huntID) => {
    console.log("inside add tasks and location to hunt");
    let taskID = task.id;
    // console.log(task.id);
    // console.log(placeUtil);
    // console.log("location Object", location);
    let smallerLocation = placeUtil.createSmallerPlaceObject(location);
    console.log("this is the smaller location", smallerLocation);

    // console.log("this is the location data", location);

    const insertTaskAndLocationToHuntQuery =
    `MATCH (hunt:Hunt{id:"${huntID}"}), (task:Task{id:${taskID}})
    CREATE (location:Place{name:"${smallerLocation.name}", id:"${smallerLocation.id}", lat:"${smallerLocation.lat}", lng:"${smallerLocation.lng}", address:"${smallerLocation.address}"})
    CREATE (hunt)-[:INCLUDES]->(task)-[:OCCURRED_AT]->(location)
    RETURN hunt`;

    return neo4jPromise.databaseQueryPromise(insertTaskAndLocationToHuntQuery);
  }
}
