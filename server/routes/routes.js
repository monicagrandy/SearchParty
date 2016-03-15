'use strict'
const jsonParser = require('body-parser').json();
const userController = require('../controllers/userController.js');

module.exports = (app, express) => {
  app.use(jsonParser);
  app.use('/', express.static(__dirname + '/../../client'));

  app.post('/signup', jsonParser, userController.signup);
  app.post('/signin', jsonParser, userController.signin);
  app.post('/signout', jsonParser, userController.signout);
}
