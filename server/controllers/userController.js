'use strict'
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const neo = require('../db/neo.js');
const secret = require('../db/config/config.js')

module.export = {
  signin: (req, res) => {
    //parse through the request
    //extract user information
    //

    return neo.runCypherStatementPromise(query);
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

        let token = jwt.encode({username: username}, secret);
        res.send(token);
      })
    })
    //use the props create syntax to pass information to db
    let query = `CREATE (${user.userID}:User { ${user} })`
    //construct cypher query
    //send jwt token back

    res.send(neo.runCypherStatementPromise(query));
  },
  signout: (req, res) => {

  }
}
