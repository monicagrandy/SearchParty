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
    })
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
    })
  }
}
