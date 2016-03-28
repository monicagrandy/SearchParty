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
    RETURN latest_message`;

    return neo4jPromise.databaseQueryPromise(addChatMessageQuery, formattedMessageObject)
    .then(latestMessage => {
      return new Promise((resolve, reject) => {
        if(latestMessage.length > 0) {
          resolve(latestMessage);
        } else {
          reject({"error": "could not add message to db"});
        }
      })
    }).catch(error => console.error(error));
  },
  retrieveChatMessages: huntID => {
    const retrieveChatQuery =
    `MATCH (hunt:Hunt{huntID:"${huntID}"})-[:HAS_CHAT]->(chat)
    WITH chat
    MATCH (chat)-[:CURRENT]-(latestmessage)-[:NEXT*0..10]-(oldermessages)
    RETURN oldermessages ORDER BY oldermessages.datetime`;

    return neo4jPromise.databaseQueryPromise(retrieveChatQuery)
    .then(chatMessageArray => {
      return new Promise((resolve, reject) => {
        if(chatMessageArray.length > 0) {
          resolve(chatMessageArray);
        } else {
          reject({"error": "could not retrieve chat messages"});
        }
      })
    }).catch(error => console.error(error));
  }
}
