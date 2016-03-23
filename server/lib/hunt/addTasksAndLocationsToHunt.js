'use strict'

const neo = require('../db/neo.js');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {

  addTaskAndLocationToHunt: (task, location, huntID) => {
    let taskID = task.id;
    let locationProps = {
      "props": location
    };

    const insertTaskAndLocationToHuntQuery =
    `MATCH (hunt:Hunt{id:${huntID}}), (task:Task{id:${taskID}})
    CREATE (location:Place{props})
    CREATE (hunt)-[:INCLUDES]->(task)-[:OCCURRED_AT]->(location)`;

    return neo4jPromise.databaseQueryPromise(insertTaskAndLocationToHuntQuery, locationProps);
  }
}
