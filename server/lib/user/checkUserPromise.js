'use strict'

const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');

module.exports = {
  userExists: userData => {
    let checkIfUsernameExistsQuery = `MATCH (user:User{username:"${userData.props.username}"}) RETURN user`;
    return neo4jPromise.databaseQueryPromise(checkIfUsernameExistsQuery)
    .then(existingUserObject => {
      console.log("does the user exist? If so then here they are: ", existingUserObject);
      return new Promise((resolve, reject) => {
        if(existingUserObject.length > 0) {
          reject({error: "username already exists, be more original"});
        } else {
          resolve(userData);
        }
      })
    })
    .catch(error => {
      console.error(error);
    })
  }
}
