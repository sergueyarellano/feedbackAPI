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
apiRouter.route('/steps')
  .post(function(req, res) {
    var step = new Models.steps();

    step.page = 'cuentas_transferencias_paso2_destinatario_transferencia';
    step.newPage = 'cuentas_transferencias_paso2_destinatario_transferencia';
    step.forms.push({opiName: req.body.opiName});

    var text = req.body.text.split(',');
    for (i=0;i< text.length;i++) {
      step.forms[0].questions.push(text[i]);
    }
    step.forms[0].url = "//localhost:3000/opi/" + req.body.opiName + "?carry_formulario="+ req.body.opiName + "&carry_lang=en&lang=en&carry_channel=net_web";
    step.forms[0].urlPullButton = "//localhost:3000/opi/" + req.body.opiName + + "?carry_formulario="+ req.body.opiName + "&carry_lang=en&lang=en&carry_channel=net_web";

    step.save(function (err) {
      if (err) {
        if (err.code == 11000)
          return res.json({ success: false, message: 'You cannot push a step that already exists' });
      }
      res.json({message: 'Form created!'})
    });
  })

  .get(function (req, res) {
    Models.steps
      .find(function (err, steps) {
        res.json({
          "responseObject": steps, 
          "responseMsg": "SUCCESS",
          "responseMessage": null
        });
      });
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
  .delete(function(req, res) {
    Models.steps
      .remove({
      _id: req.params.step_id
      }, 
      function(err, form) {
        if (err) {
          res.send(err)
        }
      res.json({message: 'Successfully deleted'});
    });
  })

  .put(function (req, res) {
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

apiRouter.route('/submits')
  .post(function (req, res) {

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
  });


	return apiRouter;
}

