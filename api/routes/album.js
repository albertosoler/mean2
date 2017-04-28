'use strict'

// Cargamos Express
var express = require('express');

// Cargamos el controlador para Album
var AlbumController = require('../controllers/album');

// Cargamos la funcion de rutas de express
var api = express.Router();

// Cargamos el Middlewares para verificar quien accede
var md_auth = require('../middlewares/authenticated');

// Cargamos Multiparty (Para la subida de ficheros)
var multipart = require('connect-multiparty');
// Definimos una ruta para la subida de los archivos
var md_upload = multipart({ uploadDir: './uploads/albums' });

// Definimos las funciones que van a ser escuchada en la api del Usuario
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

// Exportamos las funcionalidades configuradas
module.exports = api;