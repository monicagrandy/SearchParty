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
    MATCH (h)-[:HAS_CHAT*]->(chatInfo)
    OPTIONAL MATCH (chatInfo)-[*]->(message)
    OPTIONAL MATCH (hunt)-[:HAS_PIC*]->(picurl)
    WITH COLLECT(DISTINCT task) AS tasks, COLLECT(DISTINCT place) AS places, COLLECT(DISTINCT message) AS messages, COLLECT(DISTINCT picurl) AS urls, h, chatInfo
    RETURN {places: places, tasks: tasks, urls: urls, messages: messages, huntData: h, chatData: chatInfo}`;

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
