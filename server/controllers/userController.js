'use strict'
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const neo = require('../db/neo.js');

module.export = {
  signin: (req, res) => {
    //parse through the request
    //extract user information
    //

    return neo.runCypherStatementPromise(query);
  },
  signup: (req, res) => {
    //extract user info from request and assign to some object
    let genUserID = 'n5';
    let user = {
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      userID: genUserID
    };
    //use the props create syntax to pass information to db
    let query = `CREATE (${user.userID}:User { ${user} })`
    //construct cypher query
    //send jwt token back

    res.send(neo.runCypherStatementPromise(query));
  },
  signout: (req, res) => {

  }
}
