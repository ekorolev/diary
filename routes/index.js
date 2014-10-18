module.exports = function ( opts ) {

	var app = opts.app;

	app.get('/', function (req, res) {
		res.sendFile(__dirname+'/../public/index.html');
	});



	var books = require('./books');
	books(opts);

}