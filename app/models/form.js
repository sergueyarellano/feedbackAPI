'use  strict';
(function() {
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// reference http://mongoosejs.com/docs/schematypes.html
// form Schema
var StepSchema = new Schema({

	page: { type: String, required: true, index: { unique: true }},
	newPage: { type: String, default: page },
	forms: [{ type: Schema.Types.ObjectId, ref: 'FForm', required: true }]
});

var FormSchema = new Schema({
	
			opiName: { type: String, required: true, lowercase: true, index: {unique: true}},
			mustShowOpi: { type: Boolean, default: true},
			url: { type: String, default: null},
			urlPullButton: { type: String, default: null},
			urlWidget: { type: String, default: null},
			starSelected: { type: Number, min: 1, max: 5, default: null}
			/////////////////////
			questions: [{ type: Schema.Types.ObjectId, ref: 'Literal', select: false},
			saturation: { type: Number, min: 0, max: 30,  select: false},
			randomness: { type: Number, min: 0, max: 100, default: 100, select: false }

});

var LiteralSchema = new Schema({
	// usaremos _id que genera mongoDB
	literal: [{ type: String }],
	choice: { type: Number, min: 0, max: 5, default: null}, // 1 = no es sencillo, 2= no es ágil, 3= no tengo suf informacion, 4= volvere en otro momento, 5=otros
	
});

// http://stackoverflow.com/questions/26861417/set-default-values-to-mongoose-arrays-in-node-js



module.exports.formModel = mongoose.model('OpForm', FormSchema);
module.exports.stepModel = mongoose.model('OpStep', StepSchema);
module.exports.literalModel = mongoose.model('Literal', LiteralSchema);
})();

// check while developing dates are correct compared with
// local time. A must http://www.esqsoft.com/javascript_examples/date-to-epoch.htm

// return the model

// name: { type: String, required: true, index: {unique: true}},
  // type: String,
  // updated: { type: Number, default: function(){return new Date().getTime()} },
  // templatesURL: [String],
  // stars: Boolean,
  // carrys: [String],
  // imgs: [String]
