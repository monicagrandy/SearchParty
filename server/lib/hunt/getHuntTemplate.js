'use strict'

const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
  retrieveTemplate: templateName => {
    let retrieveHuntTemplateQuery = `MATCH (template:Template{name:"${templateName}"})-[:HAS_KEYWORD]->(word)
    WITH COLLECT (word) AS keywords, template
    RETURN {keywords: keywords, template: template}`;

    return neo4jPromise.databaseQueryPromise(retrieveHuntTemplateQuery)
  }
}
