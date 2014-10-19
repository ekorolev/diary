
var DashboardView = Backbone.View.extend({
	el: "body",
	template: "dashboard",
	insert: function (opts) {
		var id = opts.id
		var self = this;
		var user = JSON.parse(localStorage.user);
		console.log(user);
		var template = $("#dashboard").text();
		console.log('Это первое посещение пользователя? ', user.firstVisit);
		window.DashboardViewR = new Ractive({
			el: self.$el,
			template: template,
			data: {
				user: opts.user,
			},
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
			window.BooksListViewR = new BooksListView();
			window.location.href='#';
		});

		window.DashboardViewR.on('closeHelp', function (event) {
			var el = $(event.original.target);
			el.remove();

			$.ajax({
				url: "/disableFirst",
				method: "post",
				data: {
					token: localStorage.token
				},
				success: function (data) {
					if (data.success) {
						console.log(data);
						localStorage.setItem("user", JSON.stringify(data.user));
					}
				}
			})
		})
	},
	initialize: function (opts) {
		console.log('route:dashboard');
		this.insert(opts);
	}
});

