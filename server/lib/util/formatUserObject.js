'use strict'

const shortid = require('shortid');

module.exports = {
  createPrettyUserObject: huntArray => {
    var newHuntIndexes = [];
    var prettyObj = {"hunts": {}};

    for(var i = 0; i < huntArray.length; i++) {
      var currObject = huntArray[i];
      for(var key in currObject) {
        if(key === "huntID"){
          newHuntIndexes.push(i);
          if(!prettyObj.hunts[huntArray[i][key]]) {
            prettyObj.hunts[huntArray[i][key]] = {"stats": huntArray[i], "chat":{"id": huntArray[i+1].chatID}, "tasks": []};
          }
        }
      }
    }

    for(var j = 0; j < newHuntIndexes.length; j++) {
      var huntIndex = newHuntIndexes[j];
      var huntIDFromArray = huntArray[huntIndex].huntID;
      var huntObject = prettyObj.hunts[huntIDFromArray];
      var nextHunt = newHuntIndexes[j+1] || huntArray.length;
      for(var k = huntIndex + 2; k < nextHunt; k+=2) {
        huntObject.tasks.push({"place": huntArray[k], "task": huntArray[k+1]})
      }
    }
    return prettyObj;
  }
}
