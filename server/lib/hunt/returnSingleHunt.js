'use strict'

const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
  retrieveHunt: huntID => {
    const retrieveEntireHuntQuery = `MATCH (hunt:Hunt{huntID:"${huntID}"})-[*]->(node) RETURN node, hunt`;

    return neo4jPromise.databaseQueryPromise(retrieveEntireHuntQuery)
    .then(huntData => {
      return new Promise((resolve, reject) => {
        if(huntData.length > 0) {
          resolve(huntData);
        } else {
          reject({"error": "could not retrieve hunt"})
        }
      })
    }).catch(error => console.error(error))
  }
}
