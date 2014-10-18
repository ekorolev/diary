
var SidebarView = Backbone.View.extend({
	el: ".sideBar",
	template: "sidebar",
	render: function () {
		var self = this;
		
		var template = $("#sidebar").text();

		window.SidebarViewR = new Ractive({
			el: self.$el,
			template: template,
			complete: function () {

			}
		});
	},
	initialize: function (id) {
		this.render();
	}
});

