
module.exports = function ( mongoose ) {
	var books = require('./books');
	var users = require('./users');

	return {
		books: books(mongoose),
		users: users(mongoose)
	}
}