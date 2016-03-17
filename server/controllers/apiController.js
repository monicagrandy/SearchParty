'use strict'

const oauth = require('oauth');
const oauthSig = require('oauth-signature');
const apiConfig = require('../db/config/config.js');
const request = require('request');
const qs = require('querystring');
const taskCtrl = require('./taskController.js');
//Other users will have to go into the config/config.js and insert their own
//credentials to access the Yelp API.

module.exports = {
   yelpAPI: (req, res) => {
      let keyword = req.body.keyword;
      let geolocation = req.body.geolocation;
      let method = 'GET';
      let url = 'http://api.yelp.com/v2/search';
      let consumerSecret = "Z1qCGN-gHzLjwkcSYfwlYJG1t_E";
      let tokenSecret = "oaGzxknyDi80Cu_rSJlDWR1BwSs";

      const randomString = (length, chars) => {
         let randStr = '';
         for(var i = length; i > 0; --i) {
            randStr += chars[Math.round(Math.random() * (chars.length - 1))];
         }
         return randStr;
      };

      let oauth = {
         term: keyword,
         limit: 10,
         ll: `${geolocation.latitude},${geolocation.longitude}`,
         oauth_consumer_key: "AgSeqsEmmShlC46CY65RrA",
         oauth_token: "AnJaHtuYvW22lW_u-K_fMx666UzBO_FF",
         oauth_signature_method: "HMAC-SHA1",
         oauth_timestamp: new Date().getTime(),
         oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
         oauth_version: "1.0"
      };
      let signature = oauthSig.generate(method, url, oauth, consumerSecret, tokenSecret, { encodeSignature: false});
      oauth.oauth_signature = signature;
      let paramURL = qs.stringify(oauth);
      paramURL = paramURL.replace('%2C', ',');
      let apiURL = url + '?' + paramURL;
      request({url:apiURL, json:true}, (error, response, body) => {
         if(!error && response.statusCode === 200) {
            let names = (body.businesses).map((business) => business.name);
            console.log('Names: ', names);
            taskCtrl.getTask(keyword)
              .then(tasks => {
                 let yelpList = body.businesses;
                 let taskList = tasks;
                 let prevPlaces = req.body.previousPlaces;
                 let prevTasks = req.body.previousTasks;



               res.json({businesses: body.businesses,
                        tasks: tasks})
              })
               .catch(error => {
                  console.log(error);
               });

         } else {
            console.log('error', error);
            res.status(400).json(error);
         }
      });
   }
};
