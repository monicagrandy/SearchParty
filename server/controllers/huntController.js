'use strict'

const neo = require('../db/neo.js');

module.exports = {
  addTaskToHunt: (req, res) => {
    let taskID = req.task.id;
    let huntID = req.hunt.id;
    let addTaskToHuntQuery = `MATCH (t:Task{id:${taskID}})
    WITH t MATCH(h:Hunt${huntID}) CREATE (h)-[:INCLUDES]->(t)`
  }
  let addTaskToHuntPromise = new Promise((resolve, reject) => {
    neo.runCypherStatementPromise(addTaskToHuntQuery)
    .then((data) => {

    })
  })
}
