'use strict'
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
const messageFormatter = require('./formatChatMessageForDB.js');
module.exports = {
  addChatMessageToDB: (messageBody, chatID) => {

    let formattedMessageObject = messageFormatter.formatChatMessageWithProps(messageBody);

    const addChatMessageQuery = `MATCH (root:Chatroom{id:"${chatID}"})
    OPTIONAL MATCH (root)-[r:CURRENT]-(secondlatestmessage)
    DELETE r
    CREATE (root)-[:CURRENT]->(latest_message :Message{props})
    CREATE (latest_message)-[:NEXT]->(secondlatestmessage)
    RETURN latest_message.text`;

    return neo4jPromise.databaseQueryPromise(addChatMessageQuery, formattedMessageObject);
  },
  retrieveChatMessages: huntID => {
    const retrieveChatQuery =
    `MATCH (hunt:Hunt{huntID:"${huntID}"})-[:HAS_CHAT]->(chat)
     RETURN chat`;

    return neo4jPromise.databaseQueryPromise(retrieveChatQuery);
  }
}
