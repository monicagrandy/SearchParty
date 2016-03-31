'use strict'
const shortid = require('shortid');

module.exports = {

  formatChatMessageWithProps: messageObject => {
    let chatMessageID = "m" + shortid();
    return {
      "props": {
        "text": messageObject.text,
        "username": messageObject.username,
        "messageID": chatMessageID,
        "datetime": Date.now() / 1000
      }
    }
  }
}
