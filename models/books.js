var textSearch = require('mongoose-text-search');

module.exports = function ( mongoose ) {
	var schema = mongoose.Schema({

		name: {
			type: String
		},
		author: {
			type: String,
		},
		photo_url: {
			type: String,
		},
		description: {
			type: String,
		}
	});

	schema.plugin(textSearch);
	schema.index({
		name: "text",
		author: "text"
	})

	var model = mongoose.model('books', schema);

	return model;
}