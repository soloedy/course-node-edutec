'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'desencriptar-el-token';

// Validar que el token esté bien y si está bien salta al proceso. 
exports.ensureAuth = function(req, res, next){
    var authorizationHeader = req.headers.authorization;
    // Validar si tiene header.
    if(!authorizationHeader){
        return res.status(403).send({
            message: 'La petición debe de contener un header de autenticación.'
        });
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try{
        var payload = jwt.decode(token, secret);
        // Validar que el token no esté expirado.
        var expiredDate = payload.exp;
        var currentDate = moment().unix();
        if(expiredDate <= currentDate){
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        }
    }catch(exception){
        return res.status(404).send({
            message: 'Token invalido'
        });
    }
    
    req.user = payload;
    next();
};