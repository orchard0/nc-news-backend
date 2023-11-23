const {
	retriveArticleById,
	retriveArticles,
	retriveCommentsbyArticleId,
} = require('./articles.models');

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

exports.getCommentsByArticleId = (req, res, next) => {
	const articleId = req.params.article_id;
	retriveArticleById(articleId)
		.then(() => {
			return retriveCommentsbyArticleId(articleId);
		})
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};
