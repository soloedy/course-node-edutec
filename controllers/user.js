'use strict'

// Modulos.
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

var User = require('../models/user');

function prueba(req, res){
    res.status(200).send({
        message: 'Probando el Usuario'
    })
}

function register(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.lastname && params.email && params.password){
        
        user.name = params.name;
        user.lastname = params.lastname;
        user.email = params.email;
        // Constantes en node se definen con mayusculas y guíon bajo.
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
            if(err){
                res.status(500).send({
                    message: 'Error en el servidor'
                });
            }else{
                if(!issetUser){
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        user.save((err, userStored) => {
                            if(err){
                                res.status(500).send({
                                    message: 'Error al guardar el usario'
                                });
                            }else{
                                if(!userStored){
                                    res.status(404).send({
                                        message: 'No se ha registrado el usuario'
                                    });
                                }else{
                                    res.status(200).send({
                                        user: userStored
                                    });
                                }
                            }
                        });
                    });
                }else{
                    res.status(200).send({
                        message: 'El usuario no se pudo registrar'
                    })
                }
            }
        });
    }else{
        res.status(200).send({
            message: 'Parametros erroneos'
        });
    }
}

function login(req, res){
    var params = req.body;   
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, issetUser) => {
        if(err){
            res.status(500).send({
                message: 'Error al buscar usuario.'
            });
        }else{
            if(issetUser){
                bcrypt.compare(password, issetUser.password, (err, check) =>{
                    if(check){
                        if(params.gettoken){
                            res.status(200).send({
                                token: jwt.createToken(issetUser)
                            });
                        }else{
                            res.status(200).send({
                                issetUser
                            });
                        }
                    }else{
                        res.status(200).send({
                            message: 'Usuario no se ha logueado correctamente.'
                        });
                    }
                });
            }else{
                res.status(404).send({
                    message: 'El usuario no ha podido loguearse.'
                });
            }
        }
    });
}

function updateUser(req, res){
    var userID = req.params.id;
    var updateData = req.body;

    // Datos que no quiero modificar.
    delete updateData.password;
     
    if(userID != req.user.sub){
        return res.status(401).send({
            message: 'No tiene permiso para modificar este usuario.'
        });
    }
    User.findByIdAndUpdate(userID, updateData, {new: true}, (err, userUpdated) => {
        if (err){
            res.status(500).send({
                message: 'Error al actualizar el usuario.'
            });
        }else{
            if(!userUpdated){
                res.status(404).send({
                    message: 'No se ha podido actualizar el usuario.'
                });
            }else{
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    });
}

function deleteUser(req, res){
    var userID = req.params.id;

    User.findByIdAndRemove(userID, (err, userRemoved) => {
        if(err){
            res.status(500).send({
                message: 'Error en la petición.'
            });
        }else{
            if(!userRemoved){
                res.status(404).send({
                    message: 'No se ha borrado el usuario.'
                });
            }else{
                res.status(400).send({
                    message: `El usuario ${userRemoved.email} se ha eliminado exitosamente`
                });
            }
        }
    });
}
function updateRole(req, res){
    var userID = req.params.id;
    var roleUser = 'ROLE_ADMIN';

    User.findByIdAndUpdate(userID, {role: roleUser}, {new: true}, (err, userUpdated) => {
        if (err){
            res.status(500).send({
                message: 'Error al actualizar el usuario.'
            });
        }else{
            if(!userUpdated){
                res.status(404).send({
                    message: 'No se ha podido actualizar el usuario.'
                });
            }else{
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    });
}
function forgotPassword(req, res){
    var updateData = req.body;

    if(updateData.email && updateData.password){   
        var userEmail = udateData.email.toLowerCase();
        var password = udateData.password;

        User.findOne({password: updateData.password}, (err, issetUser) => {
            if(err){
                res.status(500).send({
                    message: 'Error en el servidor'
                });
            }else{
                if(issetUser){
                    bcrypt.hash(password, null, null, (err, hash) => {
                        var newPassword = hash;

                        user.findByIdAndUpdate(issetUser.id, {password: newPassword}, {new: true}, (err, userUpdated) => {
                            if(err){
                                res.status(500).send({
                                    message: 'Error al guardar el usario'
                                });
                            }else{
                                if(!userUpdated){
                                    res.status(404).send({
                                        message: 'No se ha registrado el usuario'
                                    });
                                }else{
                                    res.status(200).send({
                                        user: userUpdated
                                    });
                                }
                            }
                        });
                    });
                }else{
                    res.status(200).send({
                        message: 'El usuario no se pudo actualizar.'
                    })
                }
            }
        });
    }else{
        res.status(200).send({
            message: 'Parametros erroneos'
        });
    }
}

module.exports = {
    prueba,
    register,
    login,
    updateUser,
    deleteUser,
    updateRole,
    forgotPassword
}