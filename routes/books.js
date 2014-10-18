
module.exports = function (opts) {

	var app = opts.app;
	var Books = opts.models.books;

	app.post('/books/create', function (req, res) {

		var body = req.body;
		var book = new Books(body);
		book.save( function( err, book ) {

			if (err) res.send({ error: "db_error" }); else {

				res.send({
					book: book
				})
			}
		})
	});

	app.get('/book/:id', function (req, res) {
		var id = req.params.id;

		Books.findById( id, function (err, book) {
			if (err) res.send({ error: 'db_error' }); else {

				res.send(book);
			}
		})
	});

	app.get('/books', function (req, res) {

		var r = Books.find({});
		r.exec( function (err, books) {
			if (err) res.send({ error: 'db_error' }); else {

				res.send({
					books: books
				});
			}
		});

	})

	app.get('/books/search', function (req, res) {

		
		var r = Books.find({
			$or: [
				{
					name: req.query.query
				},
				{
					author: req.query.query
				}
			]
		});
		r.exec(function (err, books) {
			if (err) {
				console.log('Ошибка при поиске книги: ', err);
				res.send({ error: 'db_error' }); 
			} else {

				res.send({
					books: books
				})
			}
		})
	})
}