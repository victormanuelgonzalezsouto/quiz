var path = require('path');

// Postgres DATABASE_URL = postgres://spihbkuwwnucaq:dICNnJ-9UGuGENPQPY0ky6y6g8@ec2-54-247-79-142.eu-west-1.compute.amazonaws.com:5432/d2fc4pupba2fgl
// SQLite 	DATABASE_URL = sqlie://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user	= (url[2] || null);
var pwd		= (url[3] || null);
var protocol= (url[1] || null);
var dialect = (url[1] || null);
var port 	= (url[5] || null);
var host 	= (url[4] || null);
var storage = process.env.DATABASE_STORAGE; 

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar base de datos SQLite o Postgres:
var sequelize = new Sequelize(DB_name, user, pwd,
	{ 
		dialect: dialect,
		protocol: protocol,
		port: port,
		host: host,  
		storage: storage, 	// Sólo SQLite (.env)
		omitNull: true		// Sólo Postgres
	});

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla Comment en comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Relaciones
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // Exportar definición de tabla Quiz
exports.Comment = Comment; // Exportar definición de tabla Comment

// Crear e inicializar la tabla de preguntas en la base de datos
//(Crea automáticamente el fichero quiz.sqlite y sus datos iniciales si la base de datos no existe.
// Si existe sincroniza con nuevas definiciones del modelo, siempre que sean compatibles.)
sequelize.sync().then(function() {
	// then(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count) {
		// La tabla se inicializa sólo si está vacía
		if (count === 0) {
			Quiz.create({ 
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: "otro"
			});
			Quiz.create({ 
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: "otro"
			})
			.then(function() {
				console.log('Base de datos inicializada')
			});
		}
	});
});