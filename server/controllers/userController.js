'use strict'
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const neo = require('../db/neo.js');
const secret = require('../db/config/config.js')

module.export = {
  signin: (req, res) => {
    //parse through the request
    //extract user information
    let username = req.body.username;
    let password = req.body.password;

    //check the database to see if the user exists
      //if they do, then we check the password, using bcrypt compare
        //if it is the correct password
          //assign a token and send back that token
        //if it is not the correct password
          //send back a string that says "incorrect password"
      //if the user does not exist
        //send something that tells front end to redirect to sign up

    neo.runCypherStatementPromise(query);
  },
  signup: (req, res) => {
    let password = req.body.password;
    //extract user info from request and assign to some object
    let genUserID = 'n5';
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, null, (err, hash) => {
        let user = {
          username: req.body.username,
          password: hash,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          userID: genUserID
        };
        //adding to the db happens here
        //TODO: Add cypher query syntax
        let query = `CREATE (${user.userID}:User { ${user} })`
        neo.runCypherStatementPromise(query);

        let token = jwt.encode({username: username}, secret);
        res.send(token);
      })
    })
    //use the props create syntax to pass information to db
  },
  signout: (req, res) => {

  }
}
