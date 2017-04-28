'use strict'
// Cargamos el ORM Mongoose
var mongoose = require('mongoose');
// Seleccionamos el esquema
var Schema = mongoose.Schema;

// Definimos el modelo
var ArtistSchema = Schema({
		name: String,
		description: String,
		image: String
});

// Exportamos para poder contar con el modelo Artist
module.exports = mongoose.model('Artist', ArtistSchema);