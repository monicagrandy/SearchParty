'use strict'

const config = require('../../config/config.js');
const oAuth = require('./yelpOauthGenerator.js');
const request = require('request');

module.exports = {
  yelpPlacesBasedOnKeyword: (keyword, geolocation) => {
    let apiURL = oAuth.generateOauthCredentials(keyword, geolocation);


    return new Promise((resolve, reject) => {
      request({url:apiURL, json:true}, (error, response) => {
        // console.log('error: ', error);
        if(!error && response.statusCode === 200){
          return resolve(response.body);
        } else {
          return reject({error: error});
        }
      })
    })
  }
}
