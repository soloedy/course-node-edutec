'use strict'

var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var app = require('./app');

// Conexión al servidor de Mongo.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test123@ds133746.mlab.com:33746/zoo-edutec'); // Indica que aplicación quiero levantar y base de datos. 
    
app.listen(port);

console.log('Edutec Backend is Running')

  