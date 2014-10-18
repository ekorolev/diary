
module.exports = function (opts) {
	var app = opts.app;
	var Users = opts.models.users;

	app.use( function (req, res, next) {
		var token = req.body.token || req.query.token;
		if (token) {
			Users.findOne({
				token: token
			}, function (err, user) {
				if (user) {
					req.user = user;
				}
				next();
			})
		} else {
			next();
		}
	});
}