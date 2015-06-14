var path = require('path');

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar base de datos SQLite:
var sequelize = new Sequelize(null, null, null,
	{ dialect: "sqlite", storage: "quiz.sqlite" });

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // Exportar definición de tabla Quiz

// Crear e inicializar la tabla de preguntas en la base de datos
//(Crea automáticamente el fichero quiz.sqlite y sus datos iniciales si la base de datos no existe.
// Si existe sincroniza con nuevas definiciones del modelo, siempre que sean compatibles.)
sequelize.sync().success(function() {
	// success(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count) {
		// La tabla se inicializa sólo si está vacía
		if (count === 0) {
			Quiz.create({ 
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			}).success(function() {
				console.log('Base de datos inicializada')
			});
		}
	});
});