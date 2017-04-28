'use strict'

// Cargamos Express
var express = require('express');

// Cargamos el controlador para usuario
var UserController = require('../controllers/user');

// Cargamos la funcion de rutas de express
var api = express.Router();

// Cargamos el Middlewares para verificar quien accede
var md_auth = require('../middlewares/authenticated');

// Cargamos Multiparty (Para la subida de ficheros)
var multipart = require('connect-multiparty');
// Definimos una ruta para la subida de los archivos
var md_upload = multipart({ uploadDir: './uploads/users' });

// Definimos las funciones que van a ser escuchada en la api del Usuario
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

// Exportamos las funcionalidades configuradas
module.exports = api;