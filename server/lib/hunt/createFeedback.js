'use strict'

const neo = require('../../db/neo.js');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
   initializeFeedback: (username, feedback, huntID, endtime, distance) => {

      const initializeFeedbackQuery =
      `MATCH (user:User{username:"${username}"}), (hunt:Hunt{id:"${huntID}")
       SET hunt.endtime = {"${endtime}"},
           hunt.distance = {"${distance}"}
       CREATE (user)-[:FELT]->(value:Feedback{value:"${feedback}"})-[:ABOUT]->(hunt)`;

      return neo4jPromise.databaseQueryPromise(initializeFeedbackQuery);
   }
}
