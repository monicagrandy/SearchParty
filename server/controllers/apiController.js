'use strict'

const oauth = require('oauth');
const oauthSig = require('oauth-signature');
const request = require('request');
const qs = require('querystring');
const taskCtrl = require('./taskController.js');
//Other users will have to go into the config/config.js and insert their own
//credentials to access the Yelp API.
if(!process.env.OAUTHTOKEN) {
  var apiConfig = require('../db/config/config.js');
}

const consumerSecret = process.env.YELPCONSUMERSECRET || apiConfig.yelpConsumerSecret;
const tokenSecret = process.env.YELPTOKENSECRET || apiConfig.yelpTokenSecret;
const oAuthConsumerKey = process.env.OAUTHCONSUMERKEY || apiConfig.oAuthConsumerKey;
const oAuthToken = process.env.OAUTHTOKEN || apiConfig.oAuthToken;

module.exports = {
   yelpAPI: (req, res) => {
      console.log("inside yelpAPIcontroller: ", req.body)
      let keyword = req.body.keyword;
      let geolocation = req.body.geolocation;
      let method = 'GET';
      let url = 'http://api.yelp.com/v2/search';

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
         ll: `${geolocation.lat},${geolocation.lng}`,
         oauth_consumer_key: oAuthConsumerKey,
         oauth_token: oAuthToken,
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
        console.log('response.body from Yelp ', response.body);
         if(!error && response.statusCode === 200) {
            console.log(':::::::YELP API:::::::');
            let yelpResults = body.businesses;
            let yelpNames = (body.businesses).map((business) => business.name);
            let prevList = req.body.previousPlaces;
            console.log('yelpNames: ', yelpNames);
            console.log('prevList: ', prevList);
            for(let i in yelpNames) {
               if(prevList.indexOf(yelpNames[i]) !== -1) {
                  console.log('::DUPLICATED DETECTED:: ' + yelpNames[i]);
                  yelpResults.splice(i, 1);
                  yelpNames.splice(i, 1);
               }
            }
            console.log('Yelp Filtered: ', yelpNames);
            taskCtrl.getTask(keyword)
              .then(tasks => {
                 console.log('::::::TASKS DB:::::::');
                 console.log("THESE ARE THE TASKS ", tasks);
                 let taskResults = tasks;
                 let taskList = tasks.map((task) => task.id);
                 let prevTasks = req.body.previousTasks;
                 console.log('taskList: ', taskList);
                 console.log('prevTasks: ', prevTasks);
                 for(let i in taskList) {
                    if(prevTasks.indexOf(taskList[i]) !== -1) {
                       console.log('::DUPLICATED DETECTED:: ' + taskList[i]);
                       taskResults.splice(i, 1);
                       taskList.splice(i,1);
                    }
                 }
                 console.log('Task Filtered: ', taskList);
                 //TODO: Randomize chosen result:
                 //THIS IS HARDCODED AND WILL NEED TO CHANGED LATER CAMERON JEEZ
                 console.log(taskResults[0]);
                 res.json({
                   businesses: yelpResults[0],
                   tasks: taskResults[0]
                  });
              })
               .catch(error => {
                  console.log(error);
                  res.status(400).json(error);
               });

         } else {
            console.log('error', error);
            res.status(400).json(error);
         }
      });
   }
};
