'use strict'

module.exports = {
  createPrettyHuntObject: huntArray => {
    let prettyHunt = {stats: {}, tasks: [], chatroom: {}};
    huntArray = huntArray[0];

    for(let i = 0; i < huntArray.places.length; i++) {
      let currObj = huntArray.places[i];
      currObj.location = {};
      currObj.location.coordinate = {};
      currObj.location.coordinate.latitude = currObj.lat;
      currObj.location.coordinate.longitude = currObj.lng;
    }

    prettyHunt.chatroom.messages = huntArray.messages;
    prettyHunt.chatroom.chatID = huntArray.chatData.chatID;

    prettyHunt.stats = huntArray.huntData;
    for(let i = 0; i < huntArray.tasks.length; i++) {
      if (huntArray.urls[i]) {
        console.log('inside huntArray for loop image url exits');
        if (huntArray.urls[i].url.charAt(huntArray.urls[i].url.length - 1) == i) {
          console.log('url matches task');
          prettyHunt.tasks.push({task: huntArray.tasks[i], place: huntArray.places[i], image: huntArray.urls[i]});
          console.log('pushed image to prettyhunt');
        }
      } else {
        prettyHunt.tasks.push({task: huntArray.tasks[i], place: huntArray.places[i], image: null});
      }
    }
    return prettyHunt;
  }
}
