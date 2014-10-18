
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
		var data = req.query;
		
		var regex = new RegExp(data.query);

		var r = Books.find({
			$or: [
				{
					name: regex
				},
				{
					author: regex
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
	});

	app.post('/books/planBooks/push', function (req, res) {
		var user = req.user;
		var id = req.body.book_id;
		if (!user) {
			res.send({ error: "not_auth" });
		} else {

			Books.findById(id, function (err, book) {
				if (err) {
					res.send({ error: "db_error" });
				} else {

					if (!book) {
						res.send({ error: "book_not_found" });
					} else {

						if ( user.planBooks.indexOf(book._id.toString() )+1 ) {
							res.send({ error: "already_plan" });
						} else {

							user.planBooks.push(book._id.toString());
							
							var planBooksObject = JSON.parse( user.planBooksObject );
							planBooksObject[book._id.toString()] = {
								name: book.name,
								author: book.author
							};
							var planBooksObject = JSON.stringify(planBooksObject);
							user.planBooksObject = planBooksObject;

							console.log(user);
							user.save( function (err, user) {
								if (err) res.send({ error: "db_error" }); else {
									console.log(user);
									res.send({
										success: true,
										user: user,
									});
								}
							});
						}
					}
				}
			})
		}
	})

	app.post('/books/planBooks/delete', function (req, res) {
		var user = req.user;
		var id = req.body.book_id;
		if (!user) {
			res.send({ error: "not_auth" });
		} else {
			var isPlanBook = user.planBooks.indexOf(id);
			if ( isPlanBook+1 ) {

				var book_id = user.planBooks[isPlanBook];
				user.planBooks.splice( isPlanBook, 1);
				var planBooksObject = JSON.parse(user.planBooksObject);
				delete planBooksObject[book_id];
				planBooksObject = JSON.stringify(planBooksObject);
				user.planBooksObject = planBooksObject;
				user.save(function (err, user) {
					if (err) {
						res.send({error: "db_error"});
					} else {

						res.send({
							user: user,
							success: true,
						})
					}
				})

			} else {
				res.send({
					error: "no_plan_book"
				});
			}
		}
	})
}