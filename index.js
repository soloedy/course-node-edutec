'use strict'

var mongoose = require('mongoose');
var port = 3000;
var app = require('./app');

// Conexión al servidor de Mongo.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo') // Indica que aplicación quiero levantar y base de datos. 
    .then(() => {
        console.log('La Conexión a Mongo a Sido Exitosa');
        app.listen(port, () => {
            console.log('El servidor local del node y express esta corriendo');
        });
    })
    .catch(err => console.log(err));