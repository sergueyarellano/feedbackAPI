'use strict';
(function() {
// CALL THE PACKAGES ---------------------
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    mongoose    = require('mongoose'),
    config      = require('./config');

//   NOTES:
// - express is the Node framework.
// - morgan allows us to log all requests to the console so we can see exactly what is going on.
// - mongoose is the ODM we will use to communicate with our MongoDB database.
// - body-parser will let us pull POST content from our HTTP request so that we can do things
//   like create a user.
// https://github.com/mongolab/mongodb-driver-examples/blob/master/nodejs/mongooseSimpleExample.js
// Connect to the db
mongoose.connect(config.database);

// APP CONFIGURATION ----------------------
// use body-parser (middleware) so we can grab information from POST requests.
// it injects a new 'body' object containing the parsed data into the requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// log all the requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
// ========================================
// basic route for the home page
app.get('/', function(req, res) {
  res.send('Welcome to the homepage');
});

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// START THE SERVER
// ========================================
app.listen(config.port);
console.log('» Magic happens on port ' + config.port);

})();
