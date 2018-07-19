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

module.exports = {
    prueba,
    register,
    login
}