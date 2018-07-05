'use strict'

var express = require('express'); //const es una constante, se puede usar var o const
var bodyParser = require('body-parser');

var app = express(); //se debe desempaquetar el express para poder declarar el app.

var animalRoutes = require('./routes/animal');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api', animalRoutes);

app.get ('/test', (req, res) => {
    res.status(200).send({
        message: 'Mi primer endpoint'
    });
});

module.exports = app; // Si no se hace un export no se puede acceder desde ningún otro lado, es necesario hacerlo.

