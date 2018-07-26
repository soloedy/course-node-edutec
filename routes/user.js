'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

var api = express.Router(); // Router nos va a decir todas nuestras rutas.

api.get('/prueba', [md_auth.ensureAuth, md_admin.isAdmin], UserController.prueba);
api.post('/register', UserController.register);
api.post('/login', UserController.login);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.delete('/delete-user/:id',[md_auth.ensureAuth, md_admin.isAdmin], UserController.deleteUser);
api.put('/update-role/:id', [md_auth.ensureAuth, md_admin.isAdmin], UserController.updateRole);
api.put('/forgot-password', UserController.forgotPassword);

module.exports = api;