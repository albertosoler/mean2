'use strict'

// Cargamos Express
var express = require('express');

// Cargamos el controlador para Canción
var SongController = require('../controllers/song');

// Cargamos la funcion de rutas de express
var api = express.Router();

// Cargamos el Middlewares para verificar quien accede
var md_auth = require('../middlewares/authenticated');

// Cargamos Multiparty (Para la subida de ficheros)
var multipart = require('connect-multiparty');
// Definimos una ruta para la subida de los archivos
var md_upload = multipart({ uploadDir: './uploads/songs' });

// Definimos las funciones que van a ser escuchada en la api de canción
api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);

// Exportamos las funcionalidades configuradas
module.exports = api;