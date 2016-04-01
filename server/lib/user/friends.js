'use strict'
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
const userFormat = require('../util/formatUserObject.js');

module.exports = {
  addFriendToDBPromise: (mainFriendUsername, friendToBeAddedUsername) => {
    let addFriendQuery =
    `MATCH (mainF:User{username:"${mainFriendUsername}"})
    WITH mainF
    MATCH (addF:User{username:"${friendToBeAddedUsername}"})
    CREATE (mainF)-[:FRIENDS_WITH]->(addF)
    RETURN addF`;

    return neo4jPromise.databaseQueryPromise(addFriendQuery)
    .then(friendAdded => {
      console.log("this is the friend added to the user's list: ", friendAdded);
      return new Promise((resolve, reject) => {
        if(friendAdded.length > 0) {
          resolve(friendAdded);
        } else {
          reject({error: "could not add friend"});
        }
      })
    }).catch(error => console.error(error));
  },

  retrieveFriendsPromise: (username) => {
    let retrieveFriendsQuery = `MATCH (user:User{username:"${username}"})-[:FRIENDS_WITH]-(n) RETURN n`;

    return neo4jPromise.databaseQueryPromise(retrieveFriendsQuery)
    .then(friendsArray => {
      console.log("these are the friends of the user ", friendsArray);
      return new Promise((resolve, reject) => {
        if(friendsArray) {
          resolve(friendsArray);
        } else {
          reject({error: "could not retrieve friends"});
        }
      })
    }).catch(error => console.error(error));
  },

  addFriendToHuntPromise: (username, huntID) => {

    let addFriendToHuntQuery =
    `MATCH (hunt:Hunt{huntID:"${huntID}"}), (friend:User{username:"${username}"})
    CREATE (friend)-[:PARTICIPATED_IN]->(hunt)
    CREATE (friend)-[:ADDED_TO]->(hunt)
    RETURN friend`;

    return neo4jPromise.databaseQueryPromise(addFriendToHuntQuery)
    .then(friendAdded => {
      return new Promise((resolve, reject) => {
        if(friendAdded.length > 0) {
          resolve(friendAdded);
        } else {
          reject({"error": "could not add friend to hunt"});
        }
      })
    }).catch(error => console.error(error));
  }, 

  // retrieveAddedHuntsPromise: (username) => {
  //   let addedHuntsQuery =
  //   `MATCH (user:User{username:"${username}"})-[:ADDED_TO]->(hunt)
  //   WITH COLLECT (distinct hunt) as hunts
  //   RETURN hunts`;
  //   return neo4jPromise.databaseQueryPromise(addedHuntsQuery)
  //   .then(huntArray => {
  //     return new Promise((resolve, reject) => {
  //       if(huntArray !== null) {
  //         console.log('+++71 this is the retrieveAddedHuntsPromise data ', huntArray);
  //         resolve(huntArray);
  //       } else {
  //         reject({"error": "error finding hunts"});
  //       }
  //     })
  //   }).catch(error => console.error(error));
  // }
  
  retrieveAddedHuntsPromise: username => {
    let addedHuntsQuery = 
    `MATCH (user:User{username:"${username}"})-[:ADDED_TO]->(hunt)
    WITH COLLECT (distinct hunt) as hunts
    UNWIND hunts AS h
    WITH h
    MATCH (h)-[:OCCURRED_AT*]->(place)-[:INCLUDES*]->(task)
    MATCH (h)-[:HAS_CHAT*]->(chatInfo)
    OPTIONAL MATCH (chatInfo)-[*]->(message)
    OPTIONAL MATCH (h)-[:HAS_PIC*]->(picurl)
    OPTIONAL MATCH (h)<-[:ABOUT]-(feedback)
    WITH COLLECT(DISTINCT task) AS tasks, COLLECT(DISTINCT place) AS places, COLLECT(DISTINCT message) AS messages, COLLECT(DISTINCT picurl) AS urls, h, chatInfo, feedback
    RETURN {places: places, tasks: tasks, urls: urls, messages: messages, huntData: h, chatData: chatInfo, feedback: feedback}
    `;
    return neo4jPromise.databaseQueryPromise(addedHuntsQuery)
      .then(huntArray => {
        return new Promise((resolve, reject) => {
          if (huntArray !== null) {
            var prettyUserObject = userFormat.createPrettyUserObject(huntArray);
            console.log('+++line100 this is the retrieveAddedHuntsPromise data ', prettyUserObject);
            resolve(prettyUserObject);
          } else {
            reject({"error": "error finding hunts"});
          }
        })
      })
        .catch(error => console.error(error));
  }
}
