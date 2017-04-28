'use strict'

// Cargamos Express
var express = require('express');

// Cargamos el controlador para Artista
var ArtistController = require('../controllers/artist');

// Cargamos la funcion de rutas de express
var api = express.Router();

// Cargamos el Middlewares para verificar quien accede
var md_auth = require('../middlewares/authenticated');

// Cargamos Multiparty (Para la subida de ficheros)
var multipart = require('connect-multiparty');
// Definimos una ruta para la subida de los archivos
var md_upload = multipart({ uploadDir: './uploads/artists' });

// Definimos las funciones que van a ser escuchada en la api del Artista
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

// Exportamos las funcionalidades configuradas
module.exports = api;