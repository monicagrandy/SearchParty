'use strict'
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

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

  retrieveAddedHuntsPromise: (username) => {
    let addedHuntsQuery =
    `MATCH (user:User{username:"${username}"})-[:ADDED_TO]->(hunt)
    WITH COLLECT (distinct hunt) as hunts
    RETURN hunts`;
    return neo4jPromise.databaseQueryPromise(addedHuntsQuery)
    .then(huntArray => {
      return new Promise((resolve, reject) => {
        if(huntArray !== null) {
          console.log('+++71 this is the retrieveAddedHuntsPromise data ', huntArray);
          resolve(huntArray);
        } else {
          reject({"error": "error finding hunts"});
        }
      })
    }).catch(error => console.error(error));
  }
}
