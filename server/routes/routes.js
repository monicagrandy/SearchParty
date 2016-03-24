'use strict'
const jsonParser = require('body-parser').json();
const userController = require('../controllers/userController.js');
const huntController = require('../controllers/huntController.js');

module.exports = (app, express) => {

  app.use(jsonParser);
  app.use(express.static('./client/www'));

  app.post('/feedback', jsonParser, huntController.feedback);
  app.post('/tasks', jsonParser, huntController.huntMaker);
  app.post('/signup', jsonParser, userController.signup);
  app.post('/signin', jsonParser, userController.signin);
  // app.post('/userProfile', jsonParser, userController.showUserData);
}
