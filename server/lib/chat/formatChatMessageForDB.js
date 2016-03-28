'use strict'
const shortid = require('shortid');

module.exports = {
  let chatMessageID = "m" + shortid();
  formatChatMessageWithProps: messageObject => {
    return {
      "props": {
        "text": messageObject.text,
        "username": messageObject.username,
        "messageID": chatMessageID,
        "datetime": messageObject.datetime
      }
    }
  }
 }
