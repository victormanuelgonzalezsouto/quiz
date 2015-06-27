var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res, next) {
	var statistics = {};
	
	// Contar número de comentarios
	models.Comment.count().then(function(commentCount) {

		// Número de comentarios
		statistics.commentCount = commentCount;

		// Buscar todas las preguntas incluyendo los comentarios
		models.Quiz.findAll({
			include: [{ model: models.Comment }]
		}).then(function(quizes) {

			// Número de preguntas
			statistics.quizCount = quizes.length;

			// Número medio de comentarios por pregunta
			if (statistics.quizCount > 0) {
				statistics.commentsPerQuiz = statistics.commentCount / statistics.quizCount;
			} else {
				statistics.commentsPerQuiz = 0;
			}

			// Número de preguntas con comentarios
			var quizesWithComments = 0;
			for (var i in quizes) {
				if (quizes[i].comments.length > 0) {
					quizesWithComments++;
				}
			}
			statistics.quizesWithComments = quizesWithComments;

			// Número de preguntas sin comentarios
			statistics.quizesWithoutComments = quizes.length - quizesWithComments;

			// Renderizar vistar de estadísticas
			res.render('statistics/show', { statistics: statistics, errors: [] });
		}).catch(function(error) { next(error); });
	}).catch(function(error) { next(error); });
};