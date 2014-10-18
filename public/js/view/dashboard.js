
var DashboardView = Backbone.View.extend({
	el: "body",
	template: "dashboard",
	insert: function (id) {
		var self = this;
		
		var template = $("#dashboard").text();

		window.DashboardViewR = new Ractive({
			el: self.$el,
			template: template,
			complete: function () {

			}
		});
	},
	initialize: function (id) {
		console.log('route:dashboard');
		this.insert(id);
	}
});

