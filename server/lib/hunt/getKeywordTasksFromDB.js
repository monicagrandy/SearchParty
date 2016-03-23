'use strict'

const neo = require('../../db/neo.js');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
  getTask: keyword => {
    //returns an array of 10 tasks based on the input keyword
    console.log("inside get tasks by keyword");
    const checkKeywordQuery =
    `MATCH (:Category{title:"${keyword}"})-[:CONTAINS]->(t:Task)
    RETURN t ORDER BY rand() LIMIT 10`;

    return neo4jPromise.databaseQueryPromise(checkKeywordQuery);
  }
}
