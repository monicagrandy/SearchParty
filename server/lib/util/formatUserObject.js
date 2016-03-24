'use strict'

const shortid = require('shortid');

module.exports = {
  createPrettyUserObject: huntArray => {
    let prettyObj = {"hunts": {}};
    prettyObj.hunts[huntArray[0].huntID] = {"stats": {}, "chat":{}, "tasks": []};
    prettyObj.hunts[huntArray[0].huntID].stats = {"id": huntArray[0].huntID, "starttime": huntArray[0].starttime};
    prettyObj.hunts[huntArray[0].huntID].chat = {"id": huntArray[1].chatID};
    for(let i = 2; i < huntArray.length; i+=2) {
      prettyObj.hunts[huntArray[0].huntID].tasks.push({"place": huntArray[i], "task": huntArray[i+1]})
    }
    return prettyObj;
  }


}
