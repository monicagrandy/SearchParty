'use strict'

const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
  retrieveTemplates: () => {
    let retrieveHuntTemplatesQuery = `MATCH (template:Template)-[:HAS_KEYWORD]->(word)
    WITH COLLECT (word) AS keywords, template
    RETURN {keywords: keywords, template: template}`;

    return neo4jPromise.databaseQueryPromise(retrieveHuntTemplatesQuery);
  },
  
  retrieveSingleTemplate: templateTitle => {
    let retrieveSingleTemplateQuery = `MATCH (template:Template{huntname:"${templateTitle}"})-[:HAS_KEYWORD]->(word)
    WITH COLLECT (word) AS keywords, template
    RETURN {keywords: keywords, template: template}`;

    return neo4jPromise.databaseQueryPromise(retrieveSingleTemplateQuery);
  }
}
