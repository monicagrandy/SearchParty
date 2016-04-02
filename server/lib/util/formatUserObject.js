'use strict'

const shortid = require('shortid');

module.exports = {
  createPrettyUserObject: huntArray => {
    let prettyUser = {hunts: []};
    
    for (let j = 0; j < huntArray.length; j++) {

      let individualHunt = huntArray[j];
      let prettyHunt = {stats: {}, tasks: [], chatroom: {}, feedback:{}};
      
      for (let i = 0; i < individualHunt.places.length; i++) {
        let currObj = individualHunt.places[i];
        // console.log('each place is being put into currentObj ', currObj);
        // console.log('logging i in formatUserObj ', i);
        currObj.location = {};
        currObj.location.coordinate = {};
        currObj.location.coordinate.latitude = currObj.lat;
        currObj.location.coordinate.longitude = currObj.lng;
      }      
      
      // console.log('this is the individualhunt.place ', individualHunt.places[0]);
      prettyHunt.chatroom.messages = individualHunt.messages;
      prettyHunt.chatroom.chatID = individualHunt.chatData.chatID;
      prettyHunt.stats = individualHunt.huntData;      
      
      if (!individualHunt.feedback) {
        prettyHunt.feedback.value = 'nada';
      } else {
        prettyHunt.feedback.value = individualHunt.feedback.value;
      }
      
      prettyHunt.stats = individualHunt.huntData;

      for (let z = 0; z < individualHunt.tasks.length; z++) {
        if (individualHunt.urls[z]) {
          prettyHunt.tasks.push({task: individualHunt.tasks[z], place: individualHunt.places[z], image:individualHunt.urls[z]})
        } else {
          prettyHunt.tasks.push({task: individualHunt.tasks[z], place: individualHunt.places[z]});
        }

      }
      
      // console.log('this is the prettyHunt ', prettyHunt);

      prettyUser.hunts.push(prettyHunt);
      
      // console.log('this is prettyUser after prettyHunt has been added ', prettyUser);

    }
    
    // console.log('this is the prettyUser ', prettyUser);

    return prettyUser;
  }
}
