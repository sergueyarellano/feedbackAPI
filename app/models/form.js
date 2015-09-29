var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// reference http://mongoosejs.com/docs/schematypes.html
// form Schema
var FormSchema = new Schema({
  name: { type: String, required: true, index: {unique: true}},
  type: String,
  updated: { type: Number, default: function(){return new Date().getTime()} },
  templatesURL: [String],
  stars: Boolean,
  carrys: [String],
  imgs: [String]
});
// check while developing dates are correct compared with
// local time. A must http://www.esqsoft.com/javascript_examples/date-to-epoch.htm

// return the model
module.exports = mongoose.model('FForm', FormSchema);
