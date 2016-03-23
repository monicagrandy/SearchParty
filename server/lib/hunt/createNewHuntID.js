'use strict'

const neo = require('../../db/neo.js');
const shortid = require('shortid');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
  initializeHunt: username => {
    //creates a new hunt tied to the current username which is taken from the jwt
    //adds a chat module to be associated with the hunt
    let huntID = "h" + shortid();
    let chatID = "c" + shortid();
    let huntStartTime = new Date();

    const initializeHuntQuery =
    `MATCH (user:User{username:"${username}"})
CREATE (user)-[:PARTICIPATED_IN]->(hunt:Hunt{id:"FUCK"})-[:HAS_CHAT]->(:Chatroom{id:"chatFUCK"})`;

    return neo4jPromise.databaseQueryPromise(initializeHuntQuery);
  }
}
