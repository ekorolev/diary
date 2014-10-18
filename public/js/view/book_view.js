
var BookView = Backbone.View.extend({
	el: "#innerContent",
	template: "book_view",
	render: function (book) {
		var self = this;

		var books = $("#book").text();
		var template = $("#book_view").text();
		window.BookViewR = new Ractive({
			el: self.$el,
			template: template,
			data: book,
			complete: function () {
				
			}
		})
	},
	load: function (id, cb) {

		$.ajax({
			url: "/book/"+id,
			method: "get",
			success: cb,
		});

	},
	initialize: function (id) {
		console.log('Рисуем книгу');
		var self = this;

		self.load(id, function (book) {
			self.render(book);
		})
	}
});