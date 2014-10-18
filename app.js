var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// Подключаем express-приложение.
var express = require('express');
var app = express();

// Настройка базы данных и моделей
var mongoose = require('mongoose').connect('mongodb://localhost/diary');
var models = require('./models')(mongoose);

// Настройка express-приложения
app.use( bodyParser() );
app.use( cookieParser() );
app.use( express.static( __dirname + '/public' ) );

// Подключаем роуты приложения
var routes = require('./routes');
routes({
	models: models,
	app: app
});

// Запускаем сервер.
app.listen(3000, function () {
	console.log('Сервер работает.');
});