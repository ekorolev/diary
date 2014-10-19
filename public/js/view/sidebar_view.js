
var SidebarView = Backbone.View.extend({
	el: "#wrapper .sideBar",
	template: "sidebar",
	data: null,
	render: function (opts) {
		var self = this;
		
		var template = $("#sidebar").text();
		console.log('Данные отрисовки sidebar: ', self.data);
		window.SidebarViewR = new Ractive({
			el: self.$el,
			template: template,
			data: self.data,
			complete: function () {
				console.log('Sidebar инициализирован');
			},
		});

		window.SidebarViewR.on('signout', function (event) {
			window.user = {};
			localStorage.setItem("token", "");
			localStorage.setItem("user", "");
			window.location.href='#login';
		})


		window.SidebarViewR.on('NoReadP', function (event) {
			var evt = event.original;
			var id = $(evt.target).attr('book_id');
			console.log("no: ",id);
			$.ajax({
				url: "/books/planBooks/delete",
				method: "post",
				data: {
					token: localStorage.token,
					book_id: id,
				},
				success: function (data) {
					if (data.success) {
						localStorage.setItem("user", JSON.stringify(data.user));
						console.log('Результат операции: ', data);

						window.BooksListViewR.set("user", data.user);
						window.BooksListViewR.set('books', window.BooksListViewR.data.books);
						window.SidebarViewR.set("planBooks", data.user.planBooks);

					}
				}
			})
			console.log('Хочу прочесть книгу: ', id);
		})

		window.SidebarViewR.on('iAmReaded', function (event) {
			window.inMyReadedBooks = true;
			window.BooksListViewR = new BooksListView('mybooks');
		})



		window.SidebarViewR.on("show", function (event) {
			var el = $(event.original.target);
			var id = el.closest('li').attr('book_id');
			console.log('id книги: ', id);
			window.location.href = '#/dashboard/'+id;
			window.BooksViewR = new BookView(id);
		})
	},
	initialize: function (opts) {
		var token = localStorage.token;
		if (token) {
			this.data = {
				token: true
			};
		} else {
			this.data = {
				token: false
			};
		}
		this.data.user = JSON.parse( localStorage.user );
		this.data.planBooks = JSON.parse(localStorage.user).planBooks;
		var user = JSON.parse( localStorage.user );
		this.data.planBooksObject = JSON.parse(user.planBooksObject);
		this.render(opts);
	}
});

