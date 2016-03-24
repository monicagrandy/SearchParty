'use strict'
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
const userFormat = require('../util/formatUserObject.js');

module.exports = {
  giveAllUserHuntData: username => {
    console.log("inside of give all user hunt data function");
    const returnAllUserInfoQuery = `MATCH (user:User{username:"${username}"})-[*]->(node) RETURN node`;

    return neo4jPromise.databaseQueryPromise(returnAllUserInfoQuery)
    .then(allUserData => {
      console.log("++All userData", allUserData);
      var prettyUserObject = userFormat.createPrettyUserObject(allUserData);
      return new Promise((resolve, reject) => {
        resolve(prettyUserObject);
        reject({error: "cannot return user"});
      })
    })
    .catch(error => {
      console.error(error);
    })
  }
}
