'use strict'

const chatPromises = require('../lib/chat/chatPromises.js');
// const jwt = require('jwt-simple');
const config = require('../config/config.js');

module.exports = {
  insertChatMessage: (req, res) => {
    //expecting req to have a chatID, text, username, and datetime property
    let huntID = req.body.huntID;

    let messageBody = {
      text: req.body.message,
      huntID: req.body.huntID,
      username: req.body.username,
      datetime: Date.now()
    };

    chatPromises.addChatMessageToDB(messageBody, huntID)
    .then(messageAdded => {
      console.log('message added in chat controller', messageAdded);
      res.json({"messageAdded": messageAdded});
    })
    .catch(error => console.error(error));
  },
  retrieveChatMessages: (req, res) => {
    let chatID = req.body.chatID;

    chatPromises.retrieveChatMessages(chatID)
    .then(chatMessageArray => {
      console.log("10 latest messages from db ", chatMessageArray);
      res.json({"chatMessages": chatMessageArray})
    })
    .catch(error => console.error(error));
  }
}
