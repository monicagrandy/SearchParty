'use strict'

const neo = require('../db/neo.js');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {

  addTaskAndLocationToHunt: (task, location, huntID) => {

    let insertTaskAndLocationToHuntQuery = ``;
    return neo4jPromise.databaseQueryPromise(insertTaskAndLocationToHuntQuery);
  }

}
