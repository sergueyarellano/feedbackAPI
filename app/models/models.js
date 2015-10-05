'use strict';
(function() {
var mongoose  = require('mongoose'), // if problems with mongo 2.6 remove, and install mongoose 3.8.35
    Schema    = mongoose.Schema,
// reference http://mongoosejs.com/docs/schematypes.html
// form Schema
  StepSchema = new Schema({

	page: { type: String, required: true, index: { unique: true } },
	newPage: String,
	forms: [FormSchema]
  }),

  FormSchema = new Schema({

		opiName: { type: String, required: true, lowercase: true, index: { unique: true } },
		mustShowOpi: { type: Boolean, default: true },
		url: { type: String, default: null },
		urlPullButton: { type: String, default: null },
		urlWidget: { type: String, default: null },
		starSelected: { type: Number, min: 1, max: 5, default: null },

		questions: [String],
		saturation: { type: Number, min: 0, max: 30,  select: false , default: 30 },
		randomness: { type: Number, min: 0, max: 100, default: 100, select: false }

  });

// http://stackoverflow.com/questions/26861417/set-default-values-to-mongoose-arrays-in-node-js
// module.exports.fforms = mongoose.model('OpForm', FormSchema);
module.exports.steps = mongoose.model('OpStep', StepSchema);
})();
