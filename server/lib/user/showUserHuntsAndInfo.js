'use strict'
const neo4jPromise = require('../neo4j/neo4jQueryPromiseReturn.js');
const userFormat = require('../util/formatUserObject.js');

module.exports = {
  giveAllUserHuntData: username => {
    console.log("inside of give all user hunt data function");
    const returnAllUserInfoQuery = `MATCH (user:User{username:"${username}"})-[:PARTICIPATED_IN]-(hunt)
    WITH COLLECT(DISTINCT hunt) AS hunts
    UNWIND hunts AS h
    WITH h
    MATCH (h)-[:OCCURRED_AT*]->(place)-[:INCLUDES*]->(task)
    OPTIONAL MATCH (h)-[:HAS_CHAT*]->(chatInfo)-[*]->(message)
    WITH COLLECT(DISTINCT task) AS tasks, COLLECT(DISTINCT place) AS places, COLLECT(DISTINCT message) AS messages, h, chatInfo
    RETURN {places: places, tasks: tasks, messages: messages, huntData: h, chatData: chatInfo}`;

    return neo4jPromise.databaseQueryPromise(returnAllUserInfoQuery)
    .then(allUserData => {
      console.log("++All userData", allUserData);
      // var prettyUserObject = userFormat.createPrettyUserObject(allUserData);
      return new Promise((resolve, reject) => {
        resolve(allUserData);
        reject({error: "cannot return user"});
      })
    })
    .catch(error => {
      console.error(error);
    })
  }
}
