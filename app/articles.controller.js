const { retriveArticleById, retriveArticles } = require('./articles.models');

exports.getArticleById = (req, res, next) => {
	const id = req.params.article_id;
	retriveArticleById(id)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getArticles = (req, res, next) => {
	retriveArticles()
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
};
