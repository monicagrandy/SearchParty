'use strict'
const jsonParser = require('body-parser').json();
const userController = require('../controllers/userController.js');
const apiController = require('../controllers/apiController.js');
const mainController = require('../controllers/mainController.js');
// var path = require ('path');
// app.use(express.static(path.join(__dirname + '.../public')));

module.exports = (app, express) => {
  // app.set('view engine', 'ejs');
  // app.set('views', __dirname + '/yourViewDirectory');
  app.use(jsonParser);
  app.use(express.static('./client/www'));
  // app.get('/', (req, res) => {
  //    res.render('index');
  // });
  app.post('/tasks', jsonParser, mainController.fetchHuntTask);
  app.post('/signup', jsonParser, userController.signup);
  app.post('/signin', jsonParser, userController.signin);
}
