'use strict'

var express = require('express'); //const es una constante, se puede usar var o const
var bodyParser = require('body-parser');

var app = express(); //se debe desempaquetar el express para poder declarar el app.

var animalRoutes = require('./routes/animal');
var userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use('/api', animalRoutes);
app.use('/api', userRoutes);

app.get ('/test', (req, res) => {
    res.status(200).send({
        message: 'Mi primer endpoint'
    });
});

module.exports = app; // Si no se hace un export no se puede acceder desde ningún otro lado, es necesario hacerlo.

