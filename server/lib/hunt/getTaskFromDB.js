'use strict'

const neo = require('../db/neo.js');

module.exports = {
  getTask: keyword => {
    //returns an array of 10 tasks based on the input keyword
    let checkKeywordQuery =
    `MATCH (:Category{title:"${keyword}"})-[:CONTAINS]->(t:Task)
    RETURN t ORDER BY rand() LIMIT 10`;

    return neo.runCypherStatementPromise(checkKeywordQuery)
    .then(data => {
      return new Promise((resolve, reject) => {
        if(data) {
          return resolve(data);
        } else {
          return reject({error: 'keyword doesnt exist'});
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
  }
}
