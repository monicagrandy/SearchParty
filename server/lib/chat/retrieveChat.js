'use strict'

const neo = require('../../db/neo.js');
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
  chatQuery: huntID => {

    const retrieveChatQuery =
    `MATCH (hunt:Hunt{huntID:"${huntID}"})-[:HAS_CHAT]->(chat)
    WITH chat
    MATCH (chat)-[:CURRENT]-(latestmessage)-[:NEXT*0..10]-(oldermessages)
    RETURN oldermessages ORDER BY oldermessages.datetime`;

    return neo4jPromise.databaseQueryPromise(retrieveChatQuery);
  }
}
