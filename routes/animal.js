'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadir: './uploads/animals'});
var md_auth = require('../middlewares/authenticated');

var api = express.Router(); // Router nos va a decir todas nuestras rutas.

api.get('/animals', md_auth.ensureAuth, AnimalController.getAnimals);
api.get('/animal/:id', md_auth.ensureAuth, AnimalController.getAnimal);
api.post('/animal', md_auth.ensureAuth, AnimalController.saveAnimal);
api.post('/animals');
api.put('/animal/:id', md_auth.ensureAuth, AnimalController.updateAnimal);
api.delete('/animal/:id', md_auth.ensureAuth, AnimalController.deleteAnimal);
api.post('/animal-upload-image/:id',[md_upload, md_auth.ensureAuth], AnimalController.uploadImage);

module.exports = api;
