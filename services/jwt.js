'use strict'


var jwt = require('jwt-simple');
// Se utiliza para experirar los token. 
var moment = require('moment');
// Funciona para desencriptar los tokens.
var secret = 'desencriptar-el-token';

exports.createToken = function(user){
    // Payload es lo que devuelve o recibe el webService.
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
};