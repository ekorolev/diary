	var mongoose = require('mongoose').connect('mongodb://localhost/diary');

	var Books = require('./models/books')(mongoose);

	var names = [
		"Мастер и маргарита"
	];
	var description = "Также все другие известные генераторы Lorem Ipsum используют один и тот же текст, который они просто повторяют, пока не достигнут нужный объём. Это делает предлагаемый здесь генератор единственным настоящим Lorem Ipsum генератором. Он использует словарь из более чем 200 латинских слов, а также набор моделей предложений. В результате сгенерированный Lorem Ipsum выглядит правдоподобно, не имеет повторяющихся абзацей или невозможных слов."

	for (var i=0;i<20; i++) {
			console.log(description.split(" ")[ Math.round(Math.random()*description.length)])
			var nBook = new Books({
				name: "Name"+i,
				author: "Author"+i,
				description: description,
				photo_url: "/image/books/default.jpg",
			});
			nBook.save(function (err, b){
				console.log('Книга создана', b);
			});
	}