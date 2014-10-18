
var LoginView = Backbone.View.extend({
	el: "body",
	template: "login",
	insert: function () {
		var self = this;
		
		window.LoginViewR = new Ractive({
			el: self.$el,
			template: self.template,
			complete: function () {

			},
		});
	},
	initialize: function () {
		console.log('route:login');
		this.insert();
	}
});

