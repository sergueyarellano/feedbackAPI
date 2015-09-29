// CALL THE PACKAGES ---------------------
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var config = require('./config');
var FForm = require('./app/models/form');
//   NOTES:
// - express is the Node framework.
// - morgan allows us to log all requests to the console so we can see exactly what is going on.
// - mongoose is the ODM we will use to communicate with our MongoDB database.
// - body-parser will let us pull POST content from our HTTP request so that we can do things
//   like create a user.

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

// get an instance of the express router
var apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
  console.log('Somebody just came to our app!')
  next();
});
// test route to make sure everything is working
// accessed at get GET http://localhost:3000/api
apiRouter.get('/', function(req,res) {
  res.json({ message: 'welcome to our API!'});
});

// on routes tha end in /forms
apiRouter.route('/forms')
  .post(function(req, res) {
    var form = new FForm();

    // set the form information (comes from the request)
    form.name = req.body.name;
    form.type = req.body.type;
    form.stars = req.body.stars;

    // if a key has multiple values separated by commas
    // iterate over the values and push them
    var img = req.body.imgs.split(',');
    var tmp = req.body.templatesURL.split(',');
    var carry = req.body.carrys.split(',');

    for (i=0; i<img.length;i++) {
      form.imgs.push(img[i]);
    }
    for (i=0; i<tmp.length;i++) {
      form.templatesURL.push(tmp[i]);
    }
    for (i=0; i<carry.length;i++) {
      form.carrys.push(carry[i]);
    }

    // save the form and check for errors
    form.save(function(err) {
      if (err) {
        if (err.code == 11000)
          return res.json({ success: false, message: 'A form with that name already exists'});
        else
          return res.send(err)
      }
      res.json({message: 'Form created!'})
    });
  })

  .get(function(req, res) {
    FForm.find(function(err, forms) {
      if (err) res.send(err);

      // return all the forms
      res.json(forms);
    });
  });

apiRouter.route('/forms/:form_id')
  .get(function(req, res) {
    FForm.findById(req.params.form_id, function(err, form) {
      if (err) res.send(err);

      // return that form
      res.json(form);
    });
  })

  .put(function(req, res) {
    FForm.findById(req.params.form_id, function(err, form) {
      if (err) res.send(err);
// MUST REMAKE THE REQUESTS HERE AS I DID ON POST METHOD
      // update the form only if it's new
      if(req.body.name) form.name = req.body.name;
      if(req.body.type) form.type = req.body.type;
      if(req.body.updated) form.updated = req.body.updated;
      if(req.body.templatesURL) form.templatesURL = req.body.templatesURL;
      if(req.body.stars) form.stars = req.body.stars;
      if(req.body.carrys) form.carrys = req.body.carrys;
      if(req.body.imgs) form.imgs = req.body.imgs;

      // save the form
      form.save(function(err) {
        if (err) res.send(err);

        res.json({message: 'Form updated!'});
      });
    });
  })

  .delete(function(req, res) {
    FForm.remove({
      _id: req.params.form_id

    }, function(err, form) {
      if (err) res.send(err);

      res.json({message: 'Successfully deleted'});
    });
  });


// REGISTER OUR ROUTES
// All of our routes will be prefixed with /api
app.use('/api', apiRouter);


// START THE SERVER
// ========================================
app.listen(config.port);
console.log('» Magic happens on port ' + config.port);


