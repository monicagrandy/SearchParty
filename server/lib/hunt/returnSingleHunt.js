'use strict'

const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');


module.exports = {
  retrieveHunt: huntID => {
    const retrieveEntireHuntQuery =
    `MATCH (hunt:Hunt{huntID:"${huntID}"})-[:OCCURRED_AT*]->(place)-[:INCLUDES*]->(task)
    MATCH (hunt)-[:HAS_CHAT*]->(chatInfo)-[*]->(message)
    WITH COLLECT(DISTINCT task) AS tasks, COLLECT(DISTINCT place) AS places, COLLECT(DISTINCT message) AS messages, hunt, chatInfo
    RETURN {places: places, tasks: tasks, messages: messages, huntData: hunt, chatData: chatInfo}
    `;

    return neo4jPromise.databaseQueryPromise(retrieveEntireHuntQuery)
    .then(huntData => {
      return new Promise((resolve, reject) => {
        if(huntData.length > 0) {
          // let prettyHuntData = userFormat.createPrettyUserObject(huntData);
          resolve(huntData);
        } else {
          reject({"error": "could not retrieve hunt"})
        }
      })
    }).catch(error => console.error(error))
  }
}
