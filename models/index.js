
module.exports = function ( mongoose ) {
	var books = require('./books');

	return {
		books: books(mongoose)
	}
}