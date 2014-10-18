
var BooksListView = Backbone.View.extend({
	el: "#innerContent",
	template: "bookslist_view",
	render: function (list) {
		var self = this;

		var books = $("#book").text();
		var template = $("#bookslist_view").text();
		window.BooksListViewR = new Ractive({
			el: self.$el,
			template: template,
			data: list,
			partials: {
				books: books
			},
			complete: function () {

			}
		});

		window.BooksListViewR.on("show", function (event) {
			var id = $(event.node).attr('id');
			window.location.href = '#/dashboard/'+id
		});
	},
	load: function (cb) {

		$.ajax({
			url: "/books",
			method: "get",
			success: cb,
		});

	},
	initialize: function () {
		console.log('Рисуем лист с книгами');
		var self = this;

		self.load( function (list) {
			console.log("Ответ с сервера: ", list);
			self.render(list);
		})
	}
});