'use strict'

const neo = require('../db/neo.js');
const shortid = require('shortid');

module.exports = {
  initializeHunt: username => {
    //create a chat node also
    let huntID = "h" + shortid();
    let chatID = "c" + shortid();
    let huntStartTime = new Date();
    
    let initializeHuntQuery = `CREATE (hunt:Hunt{id:"${huntID}", starttime:"${huntStartTime}"}),
    CREATE(chat:Chatroom{id:"${chatID}"})
    MATCH (user:User{username:"${username}"})
    CREATE (user)-[:PARTICIPATED_IN]->(hunt)-[:HAS_CHAT]->(chat)`;

    return neo.runCypherStatementPromise(initializeHuntQuery)
    .then(data => {
      return new Promise((resolve, reject) => {
        if(data) {
          return resolve(data);
        } else {
          return reject({error: "creation of hunt failed"});
        }
      });
    })
    .catch(error => {
      console.error('cypher Query Error', JSON.stringify(error,null,2));
    });
  }
}
