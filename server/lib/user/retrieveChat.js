'use strict'

const neo = require('../../db/neo.js');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
   chatQuery: (huntID) => {

      const retrieveChatQuery =
      `MATCH (hunt:Hunt{huntID:"h4J3JLp0pg"})-[:HAS_CHAT]->(chat)
       RETURN chat`;

      return neo4jPromise.databaseQueryPromise(retrieveChatQuery);
   }
}
