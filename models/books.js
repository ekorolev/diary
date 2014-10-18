
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

	var model = mongoose('books', schema);

	return model;
}