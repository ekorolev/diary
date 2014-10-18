
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

		// token
		token: String,
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

	return m;
}