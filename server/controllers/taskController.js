'use strict'

const neo = require('../db/neo.js');

module.exports = {
  getTask: (keyword) => {

    let checkKeywordQuery =
    `MATCH (c:Category{title:"${keyword}"})-[:CONTAINS]->(t:Task)
    RETURN t ORDER BY rand() LIMIT 10`;


    return neo.runCypherStatementPromise(checkKeywordQuery)
    .then((data) => {
      return new Promise((resolve, reject) => {
        console.log(data);
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

  // CREATE (bar:Keyword {list: ['talk to stranger', 'drink beer in 30 seconds',
  //'take selfie in urinal', 'pick up a guy', 'pick up a girl', 'take a shot',
  //'buy a shot for someone', 'ask a group of strangers to drink beers with you in less than a minute']}) RETURN bar
