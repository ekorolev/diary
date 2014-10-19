
var BookView = Backbone.View.extend({
	el: "#wrapper .listData",
	template: "book_view",
	data: null,
	render: function (book) {
		var self = this;

		var books = $("#book").text();
		var template = $("#book_view").text();
		self.data.book = book;
		window.BookViewR = new Ractive({
			el: self.$el,
			template: template,
			data: self.data,
			complete: function () {
				
			}
		});

		window.BookViewR.on("clickNote", function (event) {
			var evt = event.original;
			var def = $(evt.target).attr('default');
			if (def) {
				$(evt.target).html("");
				$(evt.target).attr("default", "");
			}
			$(evt.target).attr('contenteditable', true);
		});

		window.BookViewR.on('saveNote', function (event) {
			var el = $(event.original.target);
			var note = el.closest('.moreInfoData').find('.myComm').html();
			var id = el.closest('.moreInfoData').attr("book_id");
			
			$.ajax({
				url: "/book/"+id+"/add_note",
				method: "post",
				data: {
					token: localStorage.token,
					note: note
				},
				success: function (data) {
					self.data.user = data.user;
					localStorage.setItem("user", JSON.stringify(data.user));
					console.log('Заметка сохранена');
				}
			})
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

		self.data = {};
		self.data.user = JSON.parse( localStorage.user );
		self.data.isNote = function (id, user) {
			var notes = JSON.parse(user.notes);
			if (notes[id]) {
				return notes[id];
			} else {
				return false;
			}
		}

		self.load(id, function (book) {
			self.render(book);
		})
	}
});