var mongoose = require('mongoose').connect('mongodb://localhost/diary');
var Users = require('./models/users')(mongoose);

var user = new Users({
	login: "admin",
	password: "admin",
	usePassword: true,
	crypePassword: false
});

user.save( function (err, user) {
	if (!err) {
		console.log('Админ создан');
	}
})