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
		console.log('Показываем книгу: ', id);
		var token = localStorage.getItem('token');
		var user = JSON.parse(localStorage.getItem('user'));
		window.dashboard_view = new DashboardView({
			id: id,
			token: token,
			user: user,
		});
		if (id) {
			var book_view = new BookView(id);
		} else {

			var bookslist_view = new BooksListView();
		}
	},
	initialize: function () {
		console.log('start app');
		var auth = localStorage.getItem('user');
		if (!auth) {
			window.location.href='/#login';
		}

	}
});

