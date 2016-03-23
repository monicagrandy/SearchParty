'use strict'

const neo = require('../db/neo.js');
const shortid = require('shortid');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

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

    return neo4jPromise.databaseQueryPromise(initializeHuntQuery);
  }
}
