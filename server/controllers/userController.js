'use strict'
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const neo = require('../db/neo.js');

const userInfo = require('../lib/user/showUserHuntsAndInfo.js');
const userAuth = require('../lib/user/signUpAndSignIn.js')
if(!process.env.JWTSECRET) {
  var config = require('../config/config.js');
}

const secret = process.env.JWTSECRET || config.secret;

module.exports = {
  signup: (req, res) => {
    console.log(req.body);
    // console.log("credentials: ", req.body);
    // var reqBody = req.body.credentials;
    let password = req.body.password;
    // console.log(password);
    //extract user info from request and assign to some object
    let generatedUserID = "u" + shortid.generate();
    let bcryptPromise = new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, null, (err, hash) => {

          let userProperties = {
            "props":{
              "username": req.body.username,
              "password": hash,
              "firstname": req.body.firstname,
              "lastname": req.body.lastname,
              "email": req.body.email,
              "userID": generatedUserID
            }
          };
          // console.log("line 30 ", userProperties)
          resolve(userProperties);
          reject(err)
        })
      })
    });
    bcryptPromise.then(userProperties => {

      // console.log("userProps line 36", userProperties);
      let createUserQuery = `CREATE (user:User{props}) RETURN user`;
      neo.runCypherStatementPromise(createUserQuery, userProperties)
      .then((data) => {
        var data = data[0];
        let token = jwt.encode({username: data.username}, secret);
        res.send({token: token});
      })
    }).catch((error) => {
      console.log(error);
    })
  },
  signin: (req, res) => {
    //parse through the request
    //extract user information
    let username = req.body.username;
    let password = req.body.password;
    // let checkUsernameQuery = `MATCH (n {username:${username}}) RETURN n`;
    let checkUsernameQuery = `MATCH (user:User{username:"${username}"}) RETURN user`;

    //checking the database to see if the user exists PROMISE CHAIN -- EVERY FUNCTION NEEDS TO BE A PROMISE
    // ALWAYS INCLUDE CATCH FUNCTION
    neo.runCypherStatementPromise(checkUsernameQuery)
    .then((data) => {
      return new Promise((resolve,reject) => {
        let userObject = data[0];
        //if the user exists
        if(userObject) {
          //then compare the password
          bcrypt.compare(password, userObject.password, (err, result) => {
            //if it is the correct password
            if(result) {
              //assign a token and send back that token
              let token = jwt.encode({username: userObject.username}, secret);
              return resolve({token:token});
              //if it is not the correct password
            } else {
              return reject({error:"password_incorrect"});
            }
            //send back a string that says "incorrect password"
          })
        }
        //if the user does not exist
        //send something that tells front end to redirect to sign up
        else {
          return reject({error:"username_does_not_exist"})
        }
      })
    })
    .then(sendData)
    .catch(error)

    function sendData(data) {
      return res.json(data);
    }

    function error(error) {
      res.status(400).json(error);
    }
  },
  getUserInfo: (req, res) => {
    let username = jwt.decode(req.body.token, config.secret).username;
    userInfo.giveAllUserHuntData(username)
    .then(userObject => {
      res.json(userObject);
    })
  }
};
