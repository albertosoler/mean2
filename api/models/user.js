'use strict'

// Cargamos el ORM Mongoose
var mongoose = require('mongoose');
// Seleccionamos el esquema
var Schema = mongoose.Schema;

// Definimos el modelo
var UserSchema = Schema({
		name: String,
		surname: String,
		email: String,
		password: String,
		role: String,
		image: String
});

// Exportamos para poder contar con el modelo User
module.exports = mongoose.model('User', UserSchema);