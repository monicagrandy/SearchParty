'use strict'

const chatPromises = ('../lib/chat/chatPromises.js');

module.exports = {
  insertChatMessage: (req, res) => {
    let messageBody = req.body.message;
    let chatID = req.body.chatID;
    
    chatPromises.addChatMessageToDB(messageBody, chatID)
    .then(messageAdded => {
      console.log('message added in chat controller', messageAdded);
      res.json({"messageAdded": messageAdded});
    })
    .catch(error => console.error(error););
  },
  retrieveChatMessages: (req, res) => {
    let huntID = req.body.huntID;

    chatPromises.retrieveChatMessages(huntID)
    .then(chatMessageArray => {
      console.log("10 latest messages from db ", chatMessageArray);
      res.json({"chatMessages": chatMessageArray})
    })
    .catch(error => console.error(error););
  }
}
