'use strict'

const neo = require('../db/neo.js');
const config = require('../db/config/config.js');

module.exports = {
  getTask: (keyword) => {
    console.log('inside getTask controller');
    let checkKeywordQuery = `MATCH (t:Task)
    MATCH (c:Category{title:"${keyword}"})
    WHERE (c)-[:CONTAINS]->(t)
    RETURN t ORDER BY rand() LIMIT 10`;

    let getTaskPromise = new Promise((resolve, reject) => {
      neo.runCypherStatementPromise(checkKeywordQuery)
      .then((data) => {
        console.log(data);
        // return new Promise((resolve, reject) => {
        console.log(data);
        let tasks = data;
        if(tasks) {
          return resolve(tasks);
        } else {
          return reject({error: 'keyword doesnt exist'});
        }

        // })
      })
      .catch(error => {
        console.log(error);
      });
    });

    return getTaskPromise;
  }
}

// CREATE (bar:Keyword {list: ['talk to stranger', 'drink beer in 30 seconds',
//'take selfie in urinal', 'pick up a guy', 'pick up a girl', 'take a shot',
//'buy a shot for someone', 'ask a group of strangers to drink beers with you in less than a minute']}) RETURN bar
