'use strict'

const neo = require('../db/neo.js');
const shortid = require('shortid');
const config = require('../db/config/config.js');
const jwt = require('jwt-simple');

module.exports = {
  postCompletedTasksToDB: (req, res) => {
    //also being sent the user token
    //create a random hunt id on the backend
    //send back entire hunt with tasks and places
    let userName = jwt.decode({username: username}, config.secret);
    let huntID = "h" + shortid();
    let previousPlaces = req.body.businesses;
    let previousTasks = req.body.previousTasks;

    let createHuntParams = {
      "businessProperties": previousPlaces,
      "taskProperties": previousTasks
    };

    let addTaskToHuntQuery = `MATCH (u:User{userName:"${userName}"}) CREATE (u)-[:PARTICIPATED_IN]->(:Hunt{id:"${huntID}"})-[r:INCLUDES]->(:Task{taskProperties})-[:OCCURRED_AT]->(:Place{businessProperties}) RETURN u`;

    // let addTaskToHuntQuery = `CREATE (:Hunt${huntID})-[r:INCLUDES]->(:Task{id:${taskID}}) RETURN r`;

      neo.runCypherStatementPromise(addTaskToHuntQuery, createHuntParams)
      .then((data) => {
          res.send()
      }).catch((error) => {
        console.log(error);
      })
  }
}
