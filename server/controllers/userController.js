'use strict'
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const neo = require('../db/neo.js');
const config = require('../db/config/config.js');
const shortid = require('shortid');

module.exports = {
  signup: (req, res) => {
    let password = req.body.password;
    //extract user info from request and assign to some object
    let generatedUserID = "u" + shortid.generate();

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, null, (err, hash) => {
        //extract user info from request and assign to some object
        let userProperties = {
          username: req.body.username,
          password: hash,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          userID: generatedUserID
        };
        //adding to the db happens here
        //below is the actual query that I want to run
        // let createUserQuery = `CREATE (${userProperties.userID}:User ${userProperties})`

        //this is the query I am using for testing, not working
        let createUserQuery = 'CREATE (user:User {firstname:"Ellie"})'
        neo.runCypherStatementPromise(createUserQuery);

        let token = jwt.encode({username: userProperties.username}, config.secret);
        res.send({token: token});
      })
    })
    //use the props create syntax to pass information to db
  },
  signin: (req, res) => {
    //parse through the request
    //extract user information
    let username = req.body.username;
    let password = req.body.password;
    // let checkUsernameQuery = `MATCH (n {username:${username}}) RETURN n`;
    let checkUsernameQuery = `MATCH (user:User{username:'${username}'}) RETURN user`;
    ​
    //checking the database to see if the user exists PROMISE CHAIN -- EVERY FUNCTION NEEDS TO BE A PROMISE
    // ALWAYS INCLUDE CATCH FUNCTION
    neo.runCypherStatementPromise(checkUsernameQuery)
    .then(return new Promise((resolve,reject) => {
      let userObject = data[0];
      //if the user exists
      if(userObject.username) {
        //then compare the password
        bcrypt.compare(password, userObject.password, (err, result) => {
          //if it is the correct password
          if(result) {
            //assign a token and send back that token
            let token = jwt.encode({username: userObject.username}, config.secret);
            return resolve({token:token});
            //if it is not the correct password
          }
          //send back a string that says "incorrect password"
          return reject({error:"password_incorrect"});
        })
      }
      //if the user does not exist
      //send something that tells front end to redirect to sign up
      return reject({error:"username_does_not_exist"})
    }))
    .then(sendData)
    .catch(error)
    ​
    function sendData(data) {
      return res.json(data);
    }
    ​
    function error(error) {
      res.status(400).send(data);
    }
  }
};
