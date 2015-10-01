var bodyParser = require('body-parser');
var Models = require('../models/form');

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
    var form = new Models.fform();

    // set the form information (comes from the request)
    form.page = req.body.page
    form.newPage = req.body.page

    form.opiName = req.body.opiName
    form.mustShowOpi = req.body.mustShowOpi
    form.url = req.body.url
    form.urlPullButton = req.body.url
    form.urlWidget = req.body.
    form.starSelected = req.body.

    // form.name = req.body.name;
    // form.type = req.body.type;
    // form.stars = req.body.stars;

    // if a key has multiple values separated by commas
    // iterate over the values and push them
    // var img = req.body.imgs.split(',');
    // var tmp = req.body.templatesURL.split(',');
    // var carry = req.body.carrys.split(',');

    // for (i=0; i<img.length;i++) {
    //   form.imgs.push(img[i]);
    // }
    // for (i=0; i<tmp.length;i++) {
    //   form.templatesURL.push(tmp[i]);
    // }
    // for (i=0; i<carry.length;i++) {
    //   form.carrys.push(carry[i]);
    // }

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

    if (req.params.id) {

      Models.fforms.find(function(err, forms) {
      if (err) res.send(err);
      res.json(forms)
      })
    } else {
      Models.fforms.find(function(err, forms) {
      if (err) res.send(err);
      res.json(forms)
      })
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
