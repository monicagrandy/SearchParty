'use strict'

const neo = require('../db/neo.js');

module.exports = {

  databaseQueryPromise: query => {
    return neo.runCypherStatementPromise(query)
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
