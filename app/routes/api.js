var bodyParser = require('body-parser');
var Models = require('../models/models');

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

    var form = new Models.fforms();
    form.opiName = req.body.opiName;
    literals._creator = form._id;
    form.save(function(err) {
      if (err) {
        if (err.code == 11000)
          return res.json({ success: false, message: 'A form with that name already exists' });
      }

      var literals = new Models.literals();
      var lit = req.body.text.split(',');
      
      for (i=0;i< lit.length;i++) { 
        literals.text.push(lit[i]);
      }
      
      form.questions.push(literals);

        literals.save(function(err) {
          if (err) {
            console.log(literals._creator);
            console.log(form);
            return res.send(err);
          }
          
        });
      res.json({message: 'Form created!'})
    });
  })

  .get(function(req, res) {

    if (req.params.id) {

      Models.fforms.find(function(err, forms) {
      if (err) res.send(err);
      res.json(forms)
      })
    } else {

      Models.fforms.find()
      .populate()
      .exec();
    }
  });

apiRouter.route('/forms/:form_id')
  .get(function(req, res) {
    Models.fforms.findById(req.params.form_id, function(err, form) {
      if (err) res.send(err);

      // return that form
      res.json(form);
    });
  })

  .put(function(req, res) {
    Models.fforms.findById(req.params.form_id, function(err, form) {
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
