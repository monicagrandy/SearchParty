'use strict'

const neo = require('../db/neo.js');
const shortid = require('shortid');
const jwt = require('jwt-simple');
const config = require('../config/config.js');
const makeHunt = require('../lib/hunt/createEntireHunt.js');
const createNewHunt = require('../lib/hunt/createNewHuntID.js');
const createFeedback = require('../lib/hunt/createFeedback.js');
const uploadImage = require('../lib/image/s3Upload.js');
const singleHunt = require('../lib/hunt/returnSingleHunt.js');

module.exports = {
  huntMaker: (req, res) => {
    let keyword = req.body.keyword;
    let geolocation = req.body.geolocation;
    let username = jwt.decode(req.body.token, config.secret).username;
    let huntID = req.body.huntID || null;
    let previousPlaces = req.body.previousPlaces;
    let previousTasks = req.body.previousTasks;
    let huntData;
    console.log("+++++before if/else statement", huntID);
    if(!huntID) {
      createNewHunt.initializeHunt(username)
      .then(hunt => {
        console.log("inside initalieHunt", hunt);
        makeHunt.createHunt(keyword, previousPlaces, previousTasks, hunt[0].huntID, geolocation)
        .then(resultsObj => {
          console.log("end of making hunt");
          console.log("create hunt done promising", resultsObj);
          res.json(resultsObj);
        })
      })
        .catch(error => console.error(error));
    } else {
      console.log('this is the huntID in the else statement ', huntID);
      makeHunt.createHunt(keyword, previousPlaces, previousTasks, huntID, geolocation)
        .then(resultsObj => {
          res.json(resultsObj);
        })
          .catch(error => console.error(error));
    }
   },

   feedback: (req, res) => {
      console.log('FEEDBACK: ',req.body);
      let username = jwt.decode(req.body.token, config.secret).username;
      let feedback = req.body.feedback;
      let huntID = req.body.huntID;
      let endtime = req.body.endTime;
      let distance = req.body.distance;

      createFeedback.initializeFeedback(username, feedback, huntID, endtime, distance)
      .then(feedbackHunt => {
         console.log('Response from DB: ', feedbackHunt);
         res.json(feedbackHunt)
      })
      .catch(error => {
         console.log('Error with creating feedback: ', error);
      });
   },


   upload: (req, res) => {
    let image = req.body.image
    let id = req.body.huntID + "_" + req.body.count
    uploadImage.sendToS3(image, id)
  },

   retrieveSingleHunt: (req, res) => {
     let huntID = req.body.huntID;

     singleHunt.retrieveHunt(huntID)
     .then(huntData => {
       console.log("hunt data retrieved", huntData);
       res.json(huntData);
     })
     .catch(error => console.error(error));
   }
}
