'use strict'

const shortid = require('shortid');

module.exports = {
  createPrettyUserObject: huntArray => {
    let newHuntIndexes = [];
    let prettyObj = {"hunts": []};

    for(let z = 0; z < huntArray.length; z++) {
      let currObj = huntArray[z];
      for(let key in currObj) {
        if(key === "address") {
          currObj.location = {};
          currObj.location.coordinate = {};
          currObj.location.coordinate.latitude = currObj.lat;
          currObj.location.coordinate.longitude = currObj.lng;
        }
      }
    }

    for(let i = 0; i < huntArray.length; i++) {
        let currObject = huntArray[i];
        for(let key in currObject) {
            if(key === "huntID"){
                newHuntIndexes.push(i);
                prettyObj.hunts.push({"stats": huntArray[i], "chat":{"id": huntArray[i+1].id}, "tasks": []});
            }
        }
    }

    for(let j = 0; j < newHuntIndexes.length; j++) {
        let huntIndex = newHuntIndexes[j];
        let huntObject = prettyObj.hunts[j];
        let nextHunt = newHuntIndexes[j+1] || huntArray.length;
        for(let k = huntIndex + 2; k < nextHunt; k+=2) {
            huntObject.tasks.push({"place": huntArray[k], "task": huntArray[k+1]})
        }
    }
    return prettyObj;
  }
}
