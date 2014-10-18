
var LoginView = Backbone.View.extend({
	el: "body",
	template: "login",
	insert: function () {
		var self = this;
		
		var template = $('#'+self.template).text();
		window.LoginViewR = new Ractive({
			el: self.$el,
			template: template,
			complete: function () {

			},
		});

		window.LoginViewR.on("auth", function (event) {
			var login = $(".loginInput").val();
			var password = $(".passwordInput").val();
			console.log('Пытаемся авторизоваться', login, password);

			$.ajax({
				url: "/signin",
				method: "post",
				data: {
					login: login,
					password: password
				},
				success: function (data) {
					console.log('Ответ на попытку авторизации: ', data);

					if (data.token) {
						console.log(data.user);
						localStorage.setItem("token", data.token);
						localStorage.setItem("user", JSON.stringify(data.user));
					}

					location.href='#dashboard'
				}
			})
		})
	},
	initialize: function () {
		console.log('route:login');
		this.insert();
	}
});

