	var mongoose = require('mongoose').connect('mongodb://localhost/diary');

	var Books = require('./models/books')(mongoose);

	var array = require('./base');
	for (var i=0;i<array.length; i++) {
			var nBook = new Books(array[i]);
			nBook.save(function (err, b){
				console.log('Книга создана', b);
			});
	}