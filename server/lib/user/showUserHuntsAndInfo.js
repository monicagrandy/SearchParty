'use strict'
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
  giveAllUserHuntData: username => {
    console.log("inside of give all user hunt data function");
    const returnAllUserInfoQuery = `MATCH (user:User{username:"${username}"})-[*]->(node) RETURN user, node`;

    return neo4jPromise.databaseQueryPromise(returnAllUserInfoQuery)
    .then(allUserData => {
      console.log(allUserData);
      return new Promise((resolve, reject) => {
        resolve(formattedUserObject);
        reject({error: "cannot return user"});
      })
    })
    .catch(error => {
      console.error(error);
    })
  }
}
