'use strict';
(function(){
var bodyParser  = require('body-parser'),
    Models      = require('../models/models'),
    async       = require('async'),
    path        = require('path'),
    fs          = require('fs');

module.exports = function(app, express) {

var apiRouter = express.Router();

/* Accessed at get GET http://localhost:3000/api */
apiRouter.get('/', function(req,res) {
  res.json({ message: 'welcome to our API!'});
});

apiRouter.route('/forms')
  .post(function(req, res) {

    // Instantiate Form model,
    // grab values from body request
    var fform = new Models.fforms();
    fform.opiName = req.body.opiName;
    fform.url = "//localhost:3000/api/opi/" + req.body.opiName + "\?carry_formulario="+ req.body.opiName + "&carry_lang=en&lang=en&carry_channel=net_web";
    fform.urlPullButton = "//localhost:3000/api/opi/" + req.body.opiName + "\?carry_formulario="+ req.body.opiName + "&carry_lang=en&lang=en&carry_channel=net_web";

    var text = req.body.text.split(',');
    for (var i = 0;i< text.length;i++) {
      fform.questions.push(text[i]);
    }

    // Prepare asynchronous callbacks,
    // First series: save the form.
    // End series: copy the template file form and write in new data.
    async.series([
      function seriesSaveForm(nextSeries) {
        fform.save(function (err) {
          if (err) {
            if (err.code == 11000)
              return res.json({status: 409, success: false, message: 'You cannot push a form with the same name' });
          }
          res.json({message: 'Form created!'});
          nextSeries(null);
        });
      }
    ],
      function endSeriesGenerateHTML (err, results) {
        var pathToTmpl = path.join(__dirname + '/../../public/app/views/formstmpl/'+ fform.opiName + '.html');
        fs.createReadStream(path.join(__dirname +'/../../public/app/views/formstmpl/form.tpl.html')).pipe(fs.createWriteStream(pathToTmpl));
        var i = 0;
          fs.readFile(pathToTmpl, 'utf8', function (err,data) {
            
            if (err) {
              return console.log(err);
            }
          
            for (i = 0; i < fform.questions.length; i++) {
              console.log(i);
              var pattern = new RegExp("regExpQ" + i);
              var result = data.replace(pattern, fform.questions[i]);
              console.log(result);
              
              fs.writeFileSync(pathToTmpl, result, 'utf8', function (err) {
                if (err) {
                  return res.send(err);
                }
              });    
              // update the data for the next iteration
              var data = result;
            }
          });
        }
      );
  })

  .get(function (req, res) {

    // Return all the forms
    Models.fforms
      .find(function (err, forms) {
        if (err) {
          return res.send(err);
        }
        res.json(forms);
      });
  });

apiRouter.route('/forms/:form_name')
  .get(function (req, res) {

    // Return one form
    Models.fforms
      .findOne({ opiName: req.params.form_name}, function (err, form) {
        if (err) {
          res.send(err);
        }
        res.json(form);
      });
  })

  .delete(function(req, res) {

    // Prepare asynchronous callbacks,
    // First series: Remove the html template for a specific form.
    // End series: Remove the form from the DB.
    async.series([
      function seriesRemoveTmpl (nextSeries) {
        Models.fforms
          .findOne({ opiName: req.params.form_name}, function (err, form) {
            var pathToTmpl = path.join(__dirname + '/../../public/app/views/formstmpl/'+ form.opiName + '.html');
            fs.unlink(pathToTmpl);

            nextSeries(null);
          });
      }
    ],
      function endSeriesRemoveForms (err, results) {
        Models.fforms
          .remove({
            opiName: req.params.form_name
          },
            function(err, step) {
              if (err) {
                res.send(err)
              }
              res.json({message: 'Successfully deleted'});
            }
          );
      }
    );
  });

apiRouter.route('/steps')
  .post(function(req, res) {

    // Instantiate Step model,
    // grab values from the request
    var step = new Models.steps();
    step.page = req.body.page;
    step.newPage = req.body.page;

    // save the step to the db
    step.save(function (err) {
      if (err) {
        if (err.code == 11000)
          res.statusCode = 404;
          return res.json({status: 404, success: false, message: 'You cannot push a step with the same name' });
      }
      res.json({message: 'step created!'})
    });
  })

  .get(function (req, res) {

    // Return all the steps wrapped in opinator form
    Models.steps
      .find(function (err, steps) {
        res.json({
          "responseObject": steps,
          "responseMsg": "SUCCESS",
          "responseMessage": null
        });
      });
  });

apiRouter.route('/steps/:step_name')
  
  .get(function (req, res) {

    // Return a single step with the name as a param
    Models.steps
      .findOne({
        page: req.params.step_name
      }, 
        function (err, step) {
          if (err) {
            return res.send(err);
          } 
          res.json(step);
        }
      );
  })

  .put(function (req, res) {

    // Prepare asynchronous callbacks,
    // First series: Finds a step and pass it
    // Second series: find the form and pass it
    // End series: Push the form to the step and save step
    async.series([
      function seriesFindSteps (nextSeries) {
        Models.steps.find({ page: req.params.step_name })
        .exec(function (err, step) {
          if (err) {
            return res.send(err);
          }
          nextSeries(null, step);
        })
      },
      function seriesFindForms (nextSeries) {
        Models.fforms.find({ opiName: req.body.opiName })
        .exec(function (err, forms) {
          if (err) {
            return res.send(err);
          }
          if (!forms.length) {
            res.statusCode = 404;
            return res.json({message: 'There is no form with that name'});
          }
          nextSeries(null, forms);
        })
      }
    ],
      function endSeries(err, results) {
        console.log(results[0][1]);
       results[0][0].forms.push(results[1][0]);

       results[0][0].save(function(err) {
        if (err) {
          return res.send(err);
        }
        res.json({message: 'step updated'});
       });
      }
    );
  })

  .delete(function(req, res) {

    // Remove a single step with the name as a param
    Models.steps
      .remove({
        page: req.params.step_name
      },
        function(err, step) {
          if (err) {
            res.send(err)
          }
        res.json({message: 'Successfully deleted'});
        }
      );
  });

apiRouter.route('/records')
  .get(function (req,res) {

    // return all the records available
    Models.records.find(function (err, records) {
      if (err) {
        return res.send(err)
      }
      res.json(records)
    });
  })

  .post(function (req, res) {

    // Instantiate records model,
    // grab values from request
    var record = new Models.records();
    record.opiName = req.body.opiName;
    arrAnswers = req.body.answers.split(',');
    for (i = 0; i < arrAnswers.length; i++) {
      record.answers.push(arrAnswers[i]);
          console.log(i);
    }
    
    record.starSelected = req.body.starSelected;
    record.freeText = req.body.freeText;


    record.save(function(err) {
      if (err) {
        return res.send(err)
      }
      console.log('Form data recorded!');
      var pathToTmpl = path.join(__dirname + '/../../public/app/views/formstmpl/form.exito.tpl.html');
      res.sendFile(pathToTmpl);
    });
    
  });

apiRouter.route('/opi/:opi_name')
  .get(function (req, res) {
    var pathToTmpl = path.join(__dirname + '/../../public/app/views/formstmpl/'+ req.params.opi_name + '.html');
    res.sendFile(pathToTmpl);
  });

/* Simple log, number of connections to api */
var init = 1;
var date = new Date();
apiRouter.use(function(req, res, next) {
  console.log('» ' + init + ' connections to endpoint /api/* » ' + date)
  init++;
  next();
});

return apiRouter;
}
})();
