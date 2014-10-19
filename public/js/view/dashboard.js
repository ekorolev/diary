
var DashboardView = Backbone.View.extend({
	el: "body",
	template: "dashboard",
	insert: function (opts) {
		var id = opts.id
		var self = this;
		
		var template = $("#dashboard").text();

		window.DashboardViewR = new Ractive({
			el: self.$el,
			template: template,
			complete: function () {
				window.sidebar_view = new SidebarView();
				console.log('Инициализация сайдбара');

			}
		});

		window.DashboardViewR.on("search", function (event) {
			var keyCode = event.original.keyCode;
			var isEl = $(event.original.target).hasClass('searchImage');
			if (keyCode==13 || isEl) {
				var query = $(".searchDesign").val();

				window.BooksListViewR = new BooksListView(query);
			}
		});

		window.DashboardViewR.on("main", function (event) {
			window.location.href='#';
		})
	},
	initialize: function (opts) {
		console.log('route:dashboard');
		this.insert(opts);
	}
});

