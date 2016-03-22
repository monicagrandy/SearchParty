'use strict'

const oauth = require('oauth');
const oauthSig = require('oauth-signature');
const request = require('request');
const qs = require('querystring');
const taskCtrl = require('./taskController.js');
const apiConfig = require('../db/config/config.js');

//Other users will have to go into the config/config.js and insert their own
//credentials to access the Yelp API.

//I don't think that this is necassary; by default, the first option is chosen
//if it's a truthy value; else, the second is chosen. Added above.
// if(!process.env.OAUTHTOKEN) {
//   let apiConfig = require('../db/config/config.js');
// }

const consumerSecret = process.env.YELPCONSUMERSECRET || apiConfig.yelpConsumerSecret;
const tokenSecret = process.env.YELPTOKENSECRET || apiConfig.yelpTokenSecret;
const oAuthConsumerKey = process.env.OAUTHCONSUMERKEY || apiConfig.oAuthConsumerKey;
const oAuthToken = process.env.OAUTHTOKEN || apiConfig.oAuthToken;

module.exports = {
   yelpAPI: (req, res) => {
      console.log('inside yelpAPI');
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
         if(!error && response.statusCode === 200) {
            //Might throw error (json obj);
            console.log('200');
            console.log(res);
            return res.response.body;
         } else {
            console.log('error', error);
            res.status(400).json(error);
         }
      });

   }
};
   //       if(!error && response.statusCode === 200) {
   //          console.log('_____________YELP API________________');
   //          let yelpResults = body.businesses;
   //          let yelpNames = (body.businesses).map((business) => business.name);
   //          let prevList = req.body.previousPlaces;
   //          for(let i in prevList) {
   //             let nameFound = yelpNames.indexOf(prevList[i].name);
   //             if(nameFound !== -1) {
   //                console.log(':::::::::DUPLICATE DETECTED::::::::: ' + prevList[i].name + ' @ ' + nameFound);
   //                yelpResults.splice(nameFound, 1);
   //                yelpNames.splice(nameFound, 1);
   //             }
   //          }
   //
   //          taskCtrl.getTask(keyword)
   //            .then(tasks => {
   //               console.log('_____________TASKS DB_____________');
   //               let taskResults = tasks;
   //               let taskList = tasks.map((task) => task.content);
   //               let prevTasks = req.body.previousTasks;
   //               console.log('taskList: ', taskList);
   //               console.log('prevTasks: ', prevTasks);
   //
   //               for(let i in prevTasks) {
   //                  let taskFound = taskList.indexOf(prevTasks[i]);
   //                  if(taskFound !== -1) {
   //                     console.log(':::::::::DUPLICATE DETECTED::::::::: ' + prevTasks[i]);
   //                     taskResults.splice(taskFound, 1);
   //                     taskList.splice(taskFound, 1);
   //                  }
   //               }
   //               console.log('Task Filtered: ', taskList);
   //               const randomChoice = (max) => {
   //                  return Math.floor(Math.random() * max);
   //               }
   //             //   console.log(taskResults[0]);
   //               res.json({
   //                 businesses: yelpResults[randomChoice(yelpResults.length)],
   //                 tasks: taskResults[0]
   //                });
   //            })
   //             .catch(error => {
   //                console.log(error);
   //                res.status(400).json(error);
   //             });
   //
   //       } else {
   //          console.log('error', error);
   //          res.status(400).json(error);
   //       }
   //    });
   // }
// };
