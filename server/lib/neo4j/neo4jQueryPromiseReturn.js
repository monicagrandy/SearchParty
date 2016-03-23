'use strict'

const neo = require('../db/neo.js');

module.exports = {

  databaseQueryPromise: (query, properties) => {
    return neo.runCypherStatementPromise(query, properties)
    .then(data => {
      return new Promise((resolve, reject) => {
        if(data) {
          return resolve(data[0]);
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
