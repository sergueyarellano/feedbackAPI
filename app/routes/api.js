var bodyParser = require('body-parser');
var Models = require('../models/models');
var async = require('async');

module.exports = function(app, express) {

	// get an instance of the express router
var apiRouter = express.Router();
var i = 1;
var date = new Date();
apiRouter.use(function(req, res, next) {
  console.log('» ' + i + ' connections to endpoint /api/* » ' + date)
  i++;
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

    var step = new Models.steps();
    steps.forms.opiName = req.body.opiName;
    var lit = req.body.text.split(',');

    for (i=0;i< lit.length;i++) {
      steps.questions.push(lit[i]);
    }

    form.save(function (err) {
      if (err) {
        if (err.code == 11000)
          return res.json({ success: false, message: 'A form with that name already exists' });
      }
      res.json({message: 'Form created!'})
    });
  })

  .get(function (req, res) {
    Models.fforms
      .find(function (err, forms) {
        res.json(forms);
      })

    // Models.fforms
    //   .find()
    //   .populate('questions')
    //   .exec(function (err, forms) {
    //     if (err) res.send(err);
    //     res.json(forms);
    //   })
  });
apiRouter.route('/steps')
  .post(function (req, res) {
    var step = new Models.steps();
    step.page = req.body.page;
    step.newPage = step.page;
  })

  .get(function (req, res) {
    Models.steps
      .find(function (err, steps) {
        if (err) res.send(err);
        res.json(steps);
      })
  });

apiRouter.route('/steps/:step_id')
  .put(function (req, res) {
    // var arrayForms = req.body.forms.split(',');
    async.series([
      function seriesFindStep (nextSeries) {
        Models.steps.findOne({ page: req.params.step_id })
        .exec(function (err, step) {
          if (err) {
            return res.send(err);
          }
          nextSeries(null, step);
        });
      },
      function seriesFindForms (nextSeries) {
        Models.fforms.find({ opiName: req.body.opiName })
        .exec(function (err, forms) {
          if (err) {
            return res.send(err);
          }
          nextSeries(null, forms);
        })
      }
    ],
    function endSeries(err, results) {
      console.log(results)
    }
    );


  });

apiRouter.route('/forms/:form_id')
  .get(function (req, res) {
    Models.fforms.findById(req.params.form_id, function (err, form) {
      if (err) res.send(err);

      // return that form
      res.json(form);
    });
  })

  .put(function(req, res) {
    Models.fforms.findById(req.params.form_id, function (err, form) {
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
    Models.fforms.remove({
      _id: req.params.form_id

    }, function(err, form) {
      if (err) res.send(err);

      res.json({message: 'Successfully deleted'});
    });
  });
	return apiRouter;
}
