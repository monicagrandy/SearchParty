'use strict'

const neo = require('../../db/neo.js');

module.exports = {

  databaseQueryPromise: (query, properties) => {
    console.log(query);
    return neo.runCypherStatementPromise(query, properties)
    .then(data => {
      console.log("this is the data from neo4j", data, "end of neo4j data");
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
