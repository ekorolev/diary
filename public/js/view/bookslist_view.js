
var BooksListView = Backbone.View.extend({
	el: "#wrapper .listData",
	template: "bookslist_view",
	data: null,
	render: function (list) {
		var self = this;

		var books = $("#book").text();
		var template = $("#bookslist_view").text();
		window.user = localStorage.user;
		window.BooksListViewR = new Ractive({
			el: self.$el,
			template: template,
			data: self.data,
			partials: {
				books: books
			},
			complete: function () {

			}
		});

		window.BooksListViewR.on("show", function (event) {
			var id = $(event.original.target).closest('.element').attr('book_id');
			window.location.href = '#/dashboard/'+id
		});

		window.BooksListViewR.on("wantToRead", function (event) {
			var evt = event.original;
			var id = $(evt.target).closest('.element').attr('book_id');
			$.ajax({
				url: "/books/planBooks/push",
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
						window.BooksListViewR.set('books', self.data.books);
						window.SidebarViewR.set("planBooksObject", JSON.parse(data.user.planBooksObject));
						window.SidebarViewR.set("planBooks", data.user.planBooks);
						// var el = $(evt.target).closest('.toggleRead');
						// var readYes = el.hasClass('readYes');
						// if (readYes) {
						// 	el.closest('.discription').html("<div class='toggleRead readNo'><button on-click='wantToRead'>Хочу прочесть</button></div>");
						// } else {
						// 	el.closest('.discription').html("<div class='toggleRead readYes'>Книга в планах к прочтению <u on-click='NoRead'>X</u></div>");
						// }						

					}
				}
			})
			console.log('Хочу прочесть книгу: ', id);
		});

		window.BooksListViewR.on('NoRead', function (event) {
			var evt = event.original;
			var id = $(evt.target).closest('.element').attr('book_id');
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
						window.BooksListViewR.set('books', self.data.books);
						
						window.SidebarViewR.set("planBooksObject", JSON.parse(data.user.planBooksObject));
						window.SidebarViewR.set("planBooks", data.user.planBooks);
						// var el = $(evt.target).closest('.toggleRead');
						// var readYes = el.hasClass('readYes');
						// if (readYes) {
						// 	el.closest('.discription').html("<div class='toggleRead readNo'><button on-click='wantToRead'>Хочу прочесть</button></div>");
						// } else {
						// 	el.closest('.discription').html("<div class='toggleRead readYes'>Книга в планах к прочтению <u on-click='NoRead'>X</u></div>");
						// }
					}
				}
			})
			console.log('Хочу прочесть книгу: ', id);
		});

		window.BooksListViewR.on("alreadyRead", function (event) {
			var evt = event.original;
			var id = $(evt.target).closest('.element').attr('book_id');
			$.ajax({
				url: "/books/readBooks/push",
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
						window.BooksListViewR.set('books', self.data.books);
						window.SidebarViewR.set("readBooksObject", JSON.parse(data.user.readBooksObject));
						window.SidebarViewR.set("readBooks", data.user.readBooks);					

					}
				}
			})
		});

		window.BooksListViewR.on('NoAlreadyRead', function (event) {
			var evt = event.original;
			var id = $(evt.target).closest('.element').attr('book_id');
			$.ajax({
				url: "/books/readBooks/delete",
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
						window.BooksListViewR.set('books', self.data.books);
						
						window.SidebarViewR.set("readBooksObject", JSON.parse(data.user.readBooksObject));
						window.SidebarViewR.set("readBooks", data.user.readBooks);

						//window.BooksListViewR = new BooksListView("mybooks");
					}
				}
			})
		})

	},
	load: function (query, cb) {

		$.ajax({
			url: query? "/books/search?query="+query+"&token="+localStorage.token : "/books",
			method: "get",
			success: cb,
		});

	},
	initialize: function (query) {
		console.log('Рисуем лист с книгами');
		var self = this;

		self.load(query, function (list) {
			console.log("Ответ с сервера: ", list);
			self.data = {
				books: list.books,
				user: JSON.parse(localStorage.user),
				isPlanBook: function (id, planBooks) {
					if ( planBooks.indexOf(id)+1 ) {
						return true;
					} else {
						return false;
					}
				},
				isReadBook: function (id, readBooks) {
					if ( readBooks.indexOf(id)+1 ) {
						return true;
					} else {
						return false;
					}
				},				
			};
			self.render(list);
		})
	}
});