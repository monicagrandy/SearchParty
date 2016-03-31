'use strict'

const shortid = require('shortid');

module.exports = {
  createPrettyUserObject: huntArray => {

        let prettyUser = {hunts: []};

        for(let j = 0; j < huntArray.length; j++) {
            let individualHunt = huntArray[j];

        let prettyHunt = {stats: {}, tasks: [], chatroom: {}, feedback:{}};

            for(let i = 0; i < individualHunt.places.length; i++) {
              let currObj = individualHunt.places[i];

              currObj.location = {};
              currObj.location.coordinate = {};
              currObj.location.coordinate.latitude = currObj.lat;
              currObj.location.coordinate.longitude = currObj.lng;
            }

             prettyHunt.chatroom.messages = individualHunt.messages;
             prettyHunt.chatroom.chatID = individualHunt.chatData.chatID;

            prettyHunt.stats = individualHunt.huntData;
            if(individualHunt.feedback){
              prettyHunt.feedback.value = individualHunt.feedback.value;
            }

            for(let z = 0; z < individualHunt.tasks.length; z++) {
              if(individualHunt.urls[z]){
                prettyHunt.tasks.push({task: individualHunt.tasks[z], place: individualHunt.places[z], image:individualHunt.urls[i]})

              }
            }

            prettyUser.hunts.push(prettyHunt);

        }

        return prettyUser;
  }
}
