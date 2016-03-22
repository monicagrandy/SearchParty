'use strict'

const taskCtrl = require('./taskController.js');
const apiConfig = require('../db/config/config.js');
const apiCtrl = require('./apiController.js');

module.exports = {
   fetchHuntTask: (req, res) => {
      let yelpResults = {};
      let yelpNames = {};
      let taskResults = {};
      let taskNames = {};
      const randomSelect = (max) => {
         return Math.floor(Math.random() * max);
      }
      apiCtrl.yelpAPI(req)
      .then((body) => {
            console.log(body);
            console.log('_____________YELP API________________');
            yelpResults = body.businesses;
            yelpNames = (body.businesses).map((business) => business.name);
            let prevList = req.body.previousPlaces;
            for(let i in prevList) {
               let nameFound = yelpNames.indexOf(prevList[i].name);
               if(nameFound !== -1) {
                  console.log(':::::::::DUPLICATE DETECTED::::::::: ' + prevList[i].name + ' @ ' + nameFound);
                  yelpResults.splice(nameFound, 1);
                  yelpNames.splice(nameFound, 1);
               }
            }
            console.log('yelpNames;', yelpNames);
            taskCtrl.getTask(req.body.keyword)
            .then(tasks => {
               console.log('_____________TASKS DB_____________');
               taskResults = tasks;
               taskNames = tasks.map((task) => task.content);
               let prevTasks = req.body.previousTasks;
               // console.log('taskNames: ', taskNames);
               // console.log('prevTasks: ', prevTasks);

               for(let i in prevTasks) {
                  let taskFound = taskNames.indexOf(prevTasks[i]);
                  if(taskFound !== -1) {
                     console.log(':::::::::DUPLICATE DETECTED::::::::: ' + prevTasks[i]);
                     taskResults.splice(taskFound, 1);
                     taskNames.splice(taskFound, 1);
                  }
               }
               console.log('YOU MADE IT ');
               res.json({
                  businesses: yelpResults[randomSelect(yelpResults.length)],
                  tasks: taskResults[0]
               });
            }).catch(error => {
               console.log(error);
               //might throw error because string in json
               res.status(400).json('taskCtrl reference error: ', error);
            });
      }).catch(error => {
         console.log(error);
         //might throw error because string in json
         res.status(400).json('apiCtrl reference error: ', error);
         });
   }
}
