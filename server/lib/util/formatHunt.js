'use strict'

module.exports = {
  createPrettyHuntObject: huntArray => {
    let prettyHunt = {stats: {}, tasks: [], chatroom: {}};
    console.log('this is the huntArray ', huntArray);
    huntArray = huntArray[0];

    for(let j = 0; j < huntArray.places.length; j++) {
      let currObj = huntArray.places[j];
      currObj.location = {};
      currObj.location.coordinate = {};
      currObj.location.coordinate.latitude = currObj.lat;
      currObj.location.coordinate.longitude = currObj.lng;
    }

    prettyHunt.chatroom.messages = huntArray.messages;
    prettyHunt.chatroom.chatID = huntArray.chatData.chatID;
    prettyHunt.stats = huntArray.huntData;
    
    let taskAndImageMatchUp = {};
    
    for (let i = 0; i < huntArray.tasks.length; i++) {
      taskAndImageMatchUp[i] = [huntArray.tasks[i], null];
    }
    
    // match up tasks and images using an object   
    for (let k = 0; k < huntArray.urls.length; k++) {
      let grabLastNumberFromImageUrlString = huntArray.urls[k].url.charAt(huntArray.urls[k].url.length - 1);
      taskAndImageMatchUp[grabLastNumberFromImageUrlString][1] = huntArray.urls[k];
    }
    
    for (let i = 0; i < huntArray.tasks.length; i++) {
      prettyHunt.tasks.push({task: taskAndImageMatchUp[i][0], place: huntArray.places[i], image: taskAndImageMatchUp[i][1]});
    }
    
    return prettyHunt;
  }
}
