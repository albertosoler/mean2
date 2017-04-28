'use strict'

// Cargamos JWT (encriptación)
var jwt = require('jwt-simple');
// Cargamos Moment (gestionar fecha y hora)
var moment = require('moment');
// Creamos una clave secreta: Dicha clave es utilizada a la hora de generar los tokens
var secret = 'clave_secreta_curso';

// Exportamos la funcionalidad de creación de tokens.
exports.createToken = function(user){
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
	};
	return jwt.encode(payload, secret);
};