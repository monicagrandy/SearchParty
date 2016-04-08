'use strict'


const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
const encryption = require('./encryption.js');
const userVerify = require('./checkUserPromise.js');
const userFormatter = require('./formatUserDataForDB.js');

module.exports = {
  registerAndVerifyUser: userData => {
    let userWithProperties = userFormatter.formatUser(userData);

    console.log("user props, formatted for neo4j", userWithProperties);

    let createUserQuery = `CREATE (user:User{props}) RETURN user`;

    return userVerify.userExists(userWithProperties)
    .then(newUser => {
      console.log("This user does not exist ", newUser);
      return encryption.passwordEncrypt(newUser)
      .then(userEncryptedProperties => {
        console.log("these are the userprops going into the db: ", userEncryptedProperties);
        return neo4jPromise.databaseQueryPromise(createUserQuery, userEncryptedProperties)
        .then(userData => {
          console.log("this was just put into the db: ", userData);
          return new Promise((resolve, reject) => {
            resolve(userData[0]);
            reject({error: "cannot create user"});
          })
        })
      })
    })
  },

  verifyExistingUserCreds: (username, passwordFromRequest) => {
    //query database for user info based on username
    //return the user information
    //use bcrypt compare to check password
    let checkUsernameQuery = `MATCH (user:User{username:"${username}"}) RETURN user`;
    return neo4jPromise.databaseQueryPromise(checkUsernameQuery)
    .then(userData => {
      console.log("entire user object in verify", userData);
      console.log("user password", userData[0].password);
      let passwordFromDB = userData[0].password
      return encryption.passwordDecrypt(passwordFromRequest, passwordFromDB)
      .then(match => {
        return new Promise((resolve, reject) => {
          console.log(match);
          if(match) {
            resolve(userData[0]);
          } else {
            reject({error: "password_incorrect"});
          }
        })
      })
    })
  }
}
