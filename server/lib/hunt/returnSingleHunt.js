'use strict'

const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
const huntFormatter = require('../util/formatHunt.js');

module.exports = {
  retrieveHunt: huntID => {
    const retrieveEntireHuntQuery =
    `MATCH (hunt:Hunt{huntID:"${huntID}"})-[:OCCURRED_AT*]->(place)-[:INCLUDES*]->(task)
    MATCH (hunt)-[:HAS_CHAT*]->(chatInfo)
    OPTIONAL MATCH (hunt)-[:HAS_PIC*]->(picurl)
    OPTIONAL MATCH (chatInfo)-[*]->(message)
    WITH COLLECT(DISTINCT task) AS tasks, COLLECT(DISTINCT picurl) AS urls, COLLECT(DISTINCT place) AS places, COLLECT(DISTINCT message) AS messages, hunt, chatInfo 
    RETURN {places: places, tasks: tasks, urls: urls, messages: messages, huntData: hunt, chatData: chatInfo}
    `;

    return neo4jPromise.databaseQueryPromise(retrieveEntireHuntQuery)
    .then(huntData => {
      return new Promise((resolve, reject) => {
        if(huntData.length > 0) {
          let prettyHuntData = huntFormatter.createPrettyHuntObject(huntData);
          resolve(prettyHuntData);
        } else {
          reject({"error": "could not retrieve hunt"})
        }
      })
    }).catch(error => console.error(error))
  }
}
