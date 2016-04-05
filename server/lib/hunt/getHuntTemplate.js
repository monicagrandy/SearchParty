'use strict'

const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
  retrieveTemplate: templateTitle => {
    let retrieveHuntTemplateQuery = `MATCH (template:Template)-[:HAS_KEYWORD]->(word)
    WITH COLLECT (word) AS keywords, template
    RETURN {keywords: keywords, template: template}`;

    return neo4jPromise.databaseQueryPromise(retrieveHuntTemplateQuery)
  }
}
