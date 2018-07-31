'use strict'

// Modulos.
var fs = require('fs');
var path = require('path');

var Animal = require('../models/animal');
var constants = require('../utils/constants').constants;

function getAnimals(req, res){
    Animal.find({}).exec((err, animals) => {
        if(err){
            res.status(500).send({
                message: constants.Error_In_Request
            });
        }else{
            if(!animals){
                res.status(404).send({
                    message: constants.Animal_Not_Exists
                });
            }else{
                res.status(200).send({
                    animals
                });
            }
        } 
    });
}

function getAnimal(req, res){
    var animalId = req.params.id;

    Animal.findById(animalId).exec((err, animal) => {
        if(err){
            res.status(500).send({
                message: constants.Error_In_Request
            });
        }else{
            if(!animal){
                res.status(404).send({
                    message: constants.Animal_Not_Exists
                });
            }else{
                res.status(200).send({
                    animal
                });
            }
        }
    });
}

function saveAnimal(req, res){
    var animal = new Animal();
    var params = req.body;

    // Validar que parametros no estén en blanco.
    if(params.name){
        animal.name = params.name;
        animal.description = params.description;
        animal.origen.country = params.country;
        animal.origen.state = params.state;
        animal.image = null;

        // Función de guardado.
        animal.save((err, animalStored) => {
            if(err){
                res.status(500).send({
                    message: constants.Error_In_Request
                });
            }else{
                if(!animalStored){
                    res.status(404).send({
                        message: constants.Animal_Not_Saved
                    });
                }else{
                    res.status(200).send({
                        animal: animalStored
                    });
                }
            }
        });
    }else{
        res.status(200).send({
            message: 'El nombre del animal es obligatorio.'
        });
    }
}
function updateAnimal(req, res){
    var animalId = req.params.id;
    var update = req.body;

    Animal.findByIdAndUpdate(animalId, update, {new: true}, (err, animalUpdated) => {
        if(err){
            res.status(500).send({
                message: constants.Error_In_Request
            });
        }else{
            if(!animalUpdated){
                res.status(404).send({
                    message: 'No se ha actualizado el animal'
                });
            }else{
                res.status(200).send({
                    animal: animalUpdated
                });
            }
        }
    });
}
function deleteAnimal(req, res){
    var animalId = req.params.id;

    Animal.findByIdAndRemove(animalId, (err, animalRemoved) => {
        if(err){
            res.status(500).send({
                message: constants.Error_In_Request
            });
        }else{
            if(!animalRemoved){
                res.status(404).send({
                    message: constants.Animal_Not_Found
                }); 
            }else{
                res.status(200).send({
                    animal: animalRemoved
                });
            }    
        }
    });
}

function uploadImage(req, res) {
    var animalId = req.params.id;
    var file_name = 'No imagen';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];
        console.log('split-----    ' + file_split);

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg') {
            Animal.findByIdAndUpdate(animalId, {image: file_name}, {new: true}, (err, animalUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: constants.Animal_Error_Updated
                    });
                } else {
                    if (!animalUpdated) {
                        res.status(404).send({
                            message: constants.Animal_Not_Updated
                        });
                    } else {
                        res.status(200).send({
                            animal: animalUpdated,
                            image: file_name
                        });
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({
                        message: 'Extension del archivo no valida y no encontrada'
                    });
                } else {
                    res.status(200).send({
                        message: 'Extension del archivo no valida'
                    });
                }
            });
        }
    } else {
        res.status(200).send({
            message: 'No se ha subido ningun archivo'
        });
    }
}

module.exports = {
    getAnimals,
    getAnimal,
    saveAnimal,
    updateAnimal,
    deleteAnimal,
    uploadImage
}