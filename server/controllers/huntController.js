'use strict'

const neo = require('../db/neo.js');
const shortid = require('shortid');
const jwt = require('jwt-simple');
const config = require('../config/config.js');
const makeHunt = require('../lib/hunt/createEntireHunt.js');
const createNewHunt = require('../lib/hunt/createNewHuntID.js');
const createFeedback = require('../lib/hunt/createFeedback.js');
const imageHandling = require('../lib/image/imagePromises.js');
const singleHunt = require('../lib/hunt/returnSingleHunt.js');
const template = require('../lib/hunt/getHuntTemplate.js');

module.exports = {
  huntMaker: (req, res) => {
    let keyword = req.body.keyword;
    let geolocation = req.body.geolocation;
    let username = jwt.decode(req.body.token, config.secret).username;
    let huntID = req.body.huntID || null;
    let huntName = req.body.huntName;
    let previousPlaces = req.body.previousPlaces;
    let previousTasks = req.body.previousTasks;
    let taskNumber = req.body.taskNumber;
    let templateName = req.body.templateName;
    let huntData;
    console.log("+++++before if/else statement", huntID);
    if(!huntID) {
      createNewHunt.initializeHunt(username, huntName, taskNumber, templateName)
      .then(hunt => {
        console.log("inside initalizeHunt", hunt);
        makeHunt.createHunt(keyword, previousPlaces, previousTasks, hunt[0].huntID, geolocation, hunt[0].huntname)
        .then(resultsObj => {
          console.log("end of making hunt");
          console.log("create FIRST hunt promising here is the resulting obj", resultsObj);
          res.json(resultsObj);
        })
      })
        .catch(error => console.error(error));
    } else {
      console.log('this is the huntID in the else statement ', geolocation);
      makeHunt.createHunt(keyword, previousPlaces, previousTasks, huntID, geolocation, huntName, taskNumber)
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
    let image = req.body.image;
    let huntID = req.body.huntID;
    let id = req.body.huntID + "_" + req.body.count;
    imageHandling.sendToS3(image, id)
    .then(url => {
      imageHandling.insertURLIntoDB(huntID, url)
      .then(url => {
        res.json({url: url});
      })
    }).catch(error => console.error(error));
  },

  getHuntImages: (req, res) => {
    let huntID = req.body.huntID;
    imageHandling.getImagesBasedOnHunt(huntID)
    .then(imageURLArray => {
      res.json({urls: imageURLArray});
    }).catch(error => console.error(error));
  },

   retrieveSingleHunt: (req, res) => {
     let huntID = req.body.huntID;

     singleHunt.retrieveHunt(huntID)
     .then(huntData => {
       console.log("hunt data retrieved", huntData);
       res.json(huntData);
     })
     .catch(error => console.error(error));
   },

   retrieveTemplates: (req, res) => {
     template.retrieveTemplates(templateTitle)
     .then(templateObject => {
       console.log("template object", templateObject);
       res.json(templateObject);
     })
     .catch(error => console.error(error));
   },
   
   retrieveSingleTemplate: (req, res) => {
     let templateTitle = req.body.templateTitle;
     
     template.retrieveSingleTemplate(templateTitle)
     .then(templateObject => {
       console.log('template object', templateObject);
       res.json(templateObject);
     })
     .catch(error => console.error(error));
   }
}
