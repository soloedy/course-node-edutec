'use strict'

var mongoose = require('mongoose');
var port = 3000;
var app = require('./app');

// Conexión al servidor de Mongo.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:Edutec.1@ds133746.mlab.com:33746/zoo-edutec') // Indica que aplicación quiero levantar y base de datos. 
    .then(() => {
        console.log('La Conexión a Mongo a Sido Exitosa');
        app.listen(port, () => {
            console.log('El servidor local del node y express esta corriendo');
        });
    })
    .catch(err => console.log(err));

  