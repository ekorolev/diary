
/*
	Модель пользователя.
*/

var bcrypt = require('bcrypt');

module.exports = function ( mongoose ) {
	
	// Описываем модель пользователя
	var s = mongoose.Schema({
		login: String,

		// Password
		password: String,
		usePassword: Boolean,
		cryptPassword: Boolean,

		// social auth
		social_auth: { type: Array, deafult: [] },

		// vk options
		first_name: String,
		last_name: String,
		screen_name: String,
		photo_url: String,

		printName: String,

		firstVisit: { type: Boolean, default: true },

		// token
		token: String,

		// books
		readBooks: { type: Array, default: [] },
		planBooks: { type: Array, default: [] },
		planBooksObject: { type: String, default: "{}"},
		readBooksObject: { type: String, default: "{}"},

		notes: { type: String, default: "{}" },
	});

	s.methods.comparePassword = function (candidate, cb) {
		bcrypt.compare(candidate, this.password, cb);
	}

	var m = mongoose.model('users', s);

	// Криптование пароля
	s.pre('save', function (next) {
		var self = this;
		// Если пароль используется, но он не закриптован - криптуем его
		if ( self.usePassword && !self.cryptPassword ) {
			bcrypt.hash( self.password, 8, function (err, hash) {

				if (err) next(err); else {

					// Ошибок не было. Перезапись пароля и настроек пароля
					self.password = hash;
					self.cryptPassword = true;
					next();
				}
			});
		} else {
			next();
		}
	})

	s.pre('save', function (next) {
		var self = this;
		self.printName = self.login || self.first_name || self.screen_name;
		next();
	})

	return m;
}