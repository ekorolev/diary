module.exports = function ( opts ) {

	var app = opts.app;

	app.get('/', function (req, res) {
		res.sendFile(__dirname+'/../public/index.html');
	});



	var books = require('./books');
	var auth = require('./auth');
	var middlewares = require('./middlewares');
	middlewares(opts);
	books(opts);
	auth(opts);

}