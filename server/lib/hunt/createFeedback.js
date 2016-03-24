'use strict'

const neo = require('../../db/neo.js');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
   initializeFeedback: (username, feedback, huntID) => {

      const initializeFeedbackQuery =
      `MATCH (user:User{username:"${username}"})
      CREATE (user)-[:FELT]->(value:Feedback{value:"${feedback}"})-[:ABOUT]->(hunt:Hunt{id:"${huntID}", endtime:"${endtime}", distance:"${distance}"}) RETURN hunt`;

      return neo4jPromise.databaseQueryPromise(initializeHuntQuery);
   }
}
