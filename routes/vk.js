var request = require('request');


module.exports = function ( opts ) {
	var config = require('../config');
	var app = opts.app;
	var vk = {
		key: config.key,
		secret: config.secret,
	};
	var return_uri = config.redirect;
	var Users = opts.models.users;

	app.get('/auth/vk', function (req, res) {
		var redirect_uri = [
			"http://oauth.vk.com/authorize",
			"?client_id=", vk.key,
			"&scope=PERMISSIONS",
			"&redirect_uri=", return_uri,
			"&v=5.24",
			"&response_type=code"
		].join("");

		console.log('vk-auth');
		res.send({
			redirect: redirect_uri
		});
	})

	app.post("/vk/return", function (req, res) {
		var code = req.body.code;

		if (!code) {
			console.log('code');
			error(res);
		} else {

			request.get([
				"https://oauth.vk.com/access_token",
				"?client_id=", vk.key,
				"&client_secret=", vk.secret,
				"&code=", code,
				"&redirect_uri=", return_uri
				].join(""), function (err, resp, body) {
					body = JSON.parse(body);
					console.log(body);

					var user_id = body.user_id;
					var access_token = body.access_token;

					request([
						"https://api.vk.com/method/users.get",
						"?user_id=", user_id,
						"&v=5.24",
						"&fields=screen_name,first_name,last_name,id",
						"&access_token=", access_token].join(""), function (err, resp, body) {
						body = JSON.parse(body).response[0];

						console.log('Авторизация пользователя: ', body.screen_name, "id: ", body.id);

						Users.findOne({ social_auth: "vk+"+body.id }, function (err, user) {
							if (err) res.send({error: "db_error"}); else {
								console.log('Есть пользователь?: ', user);
								if (!user) {

									// Пользователя не существует, перед созданием
									// запрашиваем доп.данные о пользователе.
									request("https://api.vk.com/method/users.get?access_token="+access_token+"&fields="+
										"screen_name,first_name,last_name,country,city,bdate,photo,sex",
									function (err, resp, body) {

										if (err) {
											app.error('request_error', req, res);
										} else {

											// В боди - все, что нам нужно.
											body = JSON.parse(body);

											// Смотрим, что нам прислал вконтакте.
											console.log(body);
											
											if (body.error) {
												res.send({
													error: "db_error"
												})
											} else {

												// Если оошибок не было, значит создаем пользователя.
												// Для начала вытягиваем его из поля response возвращаемого объекта
												var nuser = body.response[0];

												var new_user = {
													social_auth: ["vk+"+nuser.uid],
													sex: nuser.sex,
													first_name: nuser.first_name,
													last_name: nuser.last_name,
													screen_name: nuser.screen_name,
													usePassword: false,
													type: "user",
													access_level: 10,
													vk: {
														city: nuser.city,
														country: nuser.country,
														bdate: nuser.bdate
													},
													photo_url: nuser.photo
												};

												var user = new Users(new_user);
												user.token = uniqueToken();
												user.save( function (err, user) {
													if (err) {
														res.send({
															error: "db_error"
														})
													} else {

														// Ошибок не было, авторизуем пользователя и кидаем его на страницу
														// приветствия.
														res.send({
															user: user,
															token: user.token,
														})
													}
												})
											}
										}
									});

								} else {
									
									user.token = uniqueToken();
									user.save( function (err, user) {
										if (err) {
											res.send({
												error: "db_error"
											});
										} else {

											res.send({
												token: user.token,
												user: user
											})
										}
									})
								}
							}
						})
					})

				});
		}
	})
}

function error( res ) {
	res.send("Invalid request. Error.");
}

function uniqueToken () {
	var number = Math.ceil(Math.random()*1000);
	var date = new Date().getTime();
	return "" + number + date + "";
}