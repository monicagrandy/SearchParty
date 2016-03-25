'use strict'


const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
const encryption = require('./encryption.js');
const userVerify = require('./checkIfUserExistsPromise.js');
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
            resolve(userData);
            reject({error: "cannot create user"});
          })
        })
      })
    })
  },

  signin: (username, password) => {

  }
}
