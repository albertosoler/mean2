'use strict'

// Cargamos el ORM Mongoose
var mongoose = require('mongoose');
// Seleccionamos el esquema
var Schema = mongoose.Schema;

// Definimos el modelo
var AlbumSchema = Schema({
		title: String,
		description: String,
		year: Number,
		image: String,
		artist: { type: Schema.ObjectId, ref: 'Artist'}
});

// Exportamos para poder contar con el modelo Album
module.exports = mongoose.model('Album', AlbumSchema);