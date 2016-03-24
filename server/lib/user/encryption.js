'use strict'
const bcrypt = require('bcrypt-nodejs');


module.exports = {
  passwordEncrypt: userData => {
    //assuming that the properly formatted for neo4j object is being sent in
    let password = userData.props.password;
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, null, (err, hash) => {
          userData.props.password = hash;
          console.log("hashed password?: ", userData.props.password);
        });
        resolve(userProperties);
        reject(err)
      })
    })
  },

  passwordDecrypt: userData => {
    return new Promise((resolve, reject) => {})
  }
}
