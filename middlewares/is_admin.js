'use strict'

exports.isAdmin = function(req, res, next){
    var role = req.user.role;
    if(role != 'ROLE_ADMIN'){
        return res.status(200).send({
            message: 'No cuentas con permiso para acceder a esta area.'
        });
    }
    next();
};