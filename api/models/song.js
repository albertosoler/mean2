'use strict'
// Cargamos el ORM Mongoose
var mongoose = require('mongoose');
// Seleccionamos el esquema
var Schema = mongoose.Schema;

// Definimos el modelo
var SongSchema = Schema({
		number: String,
		name: String,
		duration: String,
		file: String,
		album: { type: Schema.ObjectId, ref: 'Album'}
});

// Exportamos para poder contar con el modelo Song
module.exports = mongoose.model('Song', SongSchema);