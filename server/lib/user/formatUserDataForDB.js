'use strict'
const shortid = require('shortid');

module.exports = {
  formatUser: userObject => {
    //assuming that req.body will be passed in as the userObject
    let generatedUserID = "u" + shortid();
    return {
      "props": {
        "username": userObject.username,
        "password": userObject.password,
        "firstname": userObject.firstname,
        "lastname": userObject.lastname,
        "email": userObject.email,
        "userID": generatedUserID
      }
    }
  }
}
