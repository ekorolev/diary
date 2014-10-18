var AppRouter = Backbone.Router.extend({
	routes: {
		"": "dashboard",
		"login": "login",
		"dashboard": "dashboard",
		"dashboard/:id": "dashboard",
	},
	login: function () {
		var login_view = new LoginView();

	},
	dashboard: function (id) {
		console.log(id);
		window.dashboard_view = new DashboardView();
		window.sidebar_view = new SidebarView();
		if (id) {
			var book_view = new BookView(id);
		} else {
			var bookslist_view = new BooksListView();
		}
	},
	initialize: function () {
		console.log('start app');

	}
});

