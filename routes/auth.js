
module.exports = function ( opts ) {
	var app = opts.app;
	var Users = opts.models.users;

	app.post('/singin', function (req, res) {
		var login = req.body.login;
		var password = req.body.password;

		Users.findOne({
			login: login
		}, function (err, user) {

			if (err) {
				res.send({
					error: "db_error"
				});
			} else {

				if (!user) {
					res.send({
						error: "signin_error"
					});
				} else {

					user.comparePassword(password, function (isMatch) {
						if (!isMatch) {
							res.send({
								error: "signin_error"
							});
						} else {

							user.token = uniqueToken();
							user.save(function (err, user) {

								if (err) {
									res.send({
										error: "db_error"
									});
								} else {

									res.send({
										token: user.token
									});
								}
							})
						}
					})
				}
			}
		})
	});

	app.post('/signout', function (req, res) {
		var user = req.user;
		if (user) {
			user.token = undefined;
			user.save( function (err, user) {
				if (err) res.send({error: "db_error"}); else {

					res.send({success: true});
				}
			})
			delete req.user;
		}
	});
}

function uniqueToken () {
	var number = Math.ceil(Math.random()*1000);
	var date = Date().getDate();
	return "" + number + date + "";
}