'use strict'

const shortid = require('shortid');

module.exports = {
  createPrettyUserObject: huntArray => {
    
        let prettyUser = {};

        for(let j = 0; j < huntArray.length; j++) {
            let individualHunt = huntArray[j];

        let prettyHunt = {stats: {}, tasks: [], chatroom: {}};

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

            for(let z = 0; z < individualHunt.tasks.length; z++) {
              prettyHunt.tasks.push({task: individualHunt.tasks[z], place: individualHunt.places[z]})
            }

            prettyUser[individualHunt.huntData.huntID] = prettyHunt;

        }

        return prettyUser;
  }
}
