'use strict'

const neo = require('../db/neo.js');

module.exports = {
  getTask: (keyword) => {
    let checkKeywordQuery = `MATCH (t:Task)
    MATCH (c:Category{title:"${keyword}"})
    WHERE (c)-[:CONTAINS]->(t)
    RETURN t ORDER BY rand() LIMIT 10`;
    console.log('CYPHER QUERY >>> ', checkKeywordQuery);

    let getTaskPromise = new Promise((resolve, reject) => {
      neo.runCypherStatementPromise(checkKeywordQuery)
      .then((data) => {
         if(data) {
            return resolve(data);
         } else {
            return reject({error: 'keyword doesnt exist'});
         }
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
