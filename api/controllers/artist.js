'use strict'

// Cargamos Path y FS para manejar ficheros
var path = require('path');
var fs = require('fs');

// Cargamos "Mongoose Pagination" para crear una paginación con la lista de albums 
var mongoosePaginate = require('mongoose-pagination');

// Cargamos los modelos Artist, Album y Songs
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


// Función para obtener un artista: Requiere ID
function getArtist(req, res){
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!artist){
				res.status(404).send({message: 'El artista no existe'});
			}else{
				res.status(200).send({artist});
			}
		}
	});

}

// Función para obtener varios artistas: Es opcional pasar la pagina 
function getArtists(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}

	// Definimos los items por paginas
	var itemsPerPage = 4;	

	Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!artists){
				res.status(404).send({message: 'No hay artistas !!'});
			}else{
				return res.status(200).send({
					total_items: total,
					artists: artists
				});
			}
		}
	});
}

// Función para guardar un Artist: Se debe pasar por el cuerpo de la peticion los datos del artista
function saveArtist(req, res){
	var artist = new Artist();

	var params = req.body;
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	artist.save((err, artistStored) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistStored){
				res.status(404).send({message: 'El artista no ha sido guardado'});
			}else{
				res.status(200).send({artist: artistStored});
			}
		}
	});
}

// Función para actualizar un artista: Se deben pasar los datos del artista por el cuerpo de la peticion y por parametro el ID del artista
function updateArtist(req, res){
	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if(!artistUpdated){
				res.status(404).send({message: 'El artista no ha sido actualizado'});
			}else{
				res.status(200).send({artist: artistUpdated});
			}
		}
	});
}

// Función para borrar un artista: Se debe especificar el ID del Artista (Si se elimina un artista tambien se borran las canciones y los albums que contenga)
function deleteArtist(req, res){
	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if(err){
			res.status(500).send({message: 'Error al eliminar el artista'});
		}else{
			if(!artistRemoved){
				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
					if(err){
						res.status(500).send({message: 'Error al eliminar el album'});
					}else{
						if(!albumRemoved){
							res.status(404).send({message: 'El album no ha sido eliminado'});
						}else{

							Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
								if(err){
									res.status(500).send({message: 'Error al eliminar la canción'});
								}else{
									if(!songRemoved){
										res.status(404).send({message: 'La canción no ha sido eliminada'});
									}else{
										res.status(200).send({artist: artistRemoved});
									}
								}
							});
						}
					}
				});

			}
		}
	});
}


// Función para subir una imagen: Se debe enviar en el contenido del cuerpo de la peticion un archivo denominado files y de tipo file
function uploadImage(req, res){
	var artistId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
				if(!artistId){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({artist: artistUpdated});
				}
			});

		}else{
			res.status(200).send({message: 'Extensión del archivo no valida'});
		}
		
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}
}

// Función creada para mostrar una imagen: Se debe pasar por parametro el ID del artista(De esta forma se protegen los recursos)
function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artists/'+imageFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

// Exportamos las funciones para poder ser utilizadas desde las rutas
module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};