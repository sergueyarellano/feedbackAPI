'use  strict';
(function() {
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// reference http://mongoosejs.com/docs/schematypes.html
// form Schema
var Literal = new Schema({
	// usaremos _id que genera mongoDB
	literal: {type: String, select: false},
	choice: Number, // 1 = no es sencillo, 2= no es ágil, 3= no tengo suf informacion, 4= volvere en otro momento, 5=otros
	textareaOtros: String,
	textareaMas: String
});

// http://stackoverflow.com/questions/26861417/set-default-values-to-mongoose-arrays-in-node-js

var FormSchema = new Schema({

	page: String, //nombre de los pasos donde aparace formulario
	newPage: String, // lo mismo
	forms: [
		{
			opiName: { type: String, required: true, index: {unique: true}},
			questions: [Literal],
			saturation: Number,
			mustShowOpi: { type: Boolean, default: true},
			url: { type: String, default: null},
			urlPullButton: { type: String, default: null},
			urlWidget: { type: String, default: null},
			starSelected: Number,
			starLiteral: [String] // MUY MAL, MAL, NORAML, BIEN, EXCELENTE

		}
	]
});

module.exports = mongoose.model('FForm', FormSchema);

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
