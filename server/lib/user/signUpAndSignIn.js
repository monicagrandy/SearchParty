'use strict'


const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
const encryption = require('./encryption.js');
const userVerify = require('./checkIfUserExistsPromise.js');
const userFormatter = require('./formatUserDataForDB.js');

module.exports = {
  registerAndVerifyUser: userData => {
    let userProperties = userFormatter.formatUser(userData);

    console.log("user props, formatted for neo4j", userProperties);

    let createUserQuery = `CREATE (user:User{props}) RETURN user`;


    return userVerify.userExists(userProperties)
    .then()


    return encryption.passwordEncrypt(userData)
    .then(userProperties => {
      console.log("these are the userprops going into the db: ", userProperties);
      return neo4jPromise.databaseQueryPromise(createUserQuery, userProperties)
      .then(userData => {
        console.log("this was just put into the db: ", userData);
        resolve(userData);
      })
    })


},

signin: (username, password) => {

}
}
