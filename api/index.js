'use strict'

// Cargamos la libreria Mongoose
var mongoose = require('mongoose');
// Cargamos el archivo central de configuración de la API
var app = require('./app');
//Asignamos un puerto para que escuche Express (El que tenga asignado desde variables o sinó el 3977)
var port = process.env.PORT || 3977;

//Realizamos la conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/mean2', (err, res) => {
	if(err){
		throw err;
	}else{
		console.log("La conexión a la base de datos está funcionando correctamente...");
		app.listen(port, function(){
			console.log("Servidor del api rest de musica escuchando en http://localhost:"+port);
		});
	}
});