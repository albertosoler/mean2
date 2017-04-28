'use strict'

// Cargamos Path y FS para manejar ficheros
var path = require('path');
var fs = require('fs');

// Cargamos los modelos Artist, Album y Songs
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

// Función para obtener una canción: Requiere ID
function getSong(req, res){
	var songId = req.params.id;

	Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!song){
				res.status(404).send({message: 'La canción no existe !!'});
			}else{
				res.status(200).send({song});
			}
		}
	});
}

// Función para obtener varias canciones: Si se define el ID del album devuelve sus canciones, sino devuele todos
function getSongs(req, res){
	var albumId = req.params.album;

	if(!albumId){
		var find = Song.find({}).sort('number');
	}else{
		var find = Song.find({album: albumId}).sort('number');
	}

	find.populate({
		path: 'album',
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	}).exec(function(err, songs){
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!songs){
				res.status(404).send({message: 'No hay canciones !!'});
			}else{
				res.status(200).send({songs});
			}
		}
	});
}

// Función para guardar una Canción: Se debe pasar por el cuerpo de la peticion los datos de la canción
function saveSong(req, res){
	var song = new Song();

	var params = req.body;
	song.number = params.number;
	song.name  = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	song.save((err, songStored) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songStored){
				res.status(404).send({message: 'No se ha guardado la canción'});
			}else{
				res.status(200).send({song: songStored});
			}
		}
	});
}

// Función para actualizar los datos de una canción: Se deben pasar los datos de la canción por el cuerpo de la peticion y por parametro el ID
function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songUpdated){
				res.status(404).send({message: 'No se ha actualizado la canción'});
			}else{
				res.status(200).send({song: songUpdated});
			}
		}
	});
}

// Función para borrar una canción: Se debe especificar el ID de la Canción
function deleteSong(req, res){
	var songId = req.params.id;
	
	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!songRemoved){
				res.status(404).send({message: 'No se ha borrado la canción'});
			}else{
				res.status(200).send({song: songRemoved});
			}
		}
	});
}

// Función para subir una canción: Se debe enviar en el contenido del cuerpo de la peticion un archivo denominado files y de tipo file
function uploadFile(req, res){
	var songId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'mp3' || file_ext == 'ogg'){

			Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
				if(!songUpdated){
					res.status(404).send({message: 'No se ha podido actualizar la cación'});
				}else{
					res.status(200).send({song: songUpdated});
				}
			});

		}else{
			res.status(200).send({message: 'Extensión del archivo no valida'});
		}
		
	}else{
		res.status(200).send({message: 'No has subido el fichero de audio...'});
	}
}

// Función creada para mostrar un archivo: Se debe pasar por parametro el ID de la canción(De esta forma se protegen los recursos)
function getSongFile(req, res){
	var imageFile = req.params.songFile;
	var path_file = './uploads/songs/'+imageFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe el fichero de audio...'});
		}
	});
}

// Exportamos las funciones para poder ser utilizadas desde las rutas
module.exports = {
	getSong,
	getSongs,
	saveSong,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
};