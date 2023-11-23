const {
	retriveArticleById,
	retriveArticles,
	retriveCommentsbyArticleId,
	addCommentOnArticle,
} = require('./articles.models');
const { retriveAuthors } = require('./authors.models');

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
	retriveCommentsbyArticleId(articleId)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postCommentOnArticle = (req, res, next) => {
	const comment = req.body;
	const articleId = req.params.article_id;

	const promises = [
		retriveArticleById(articleId),
		retriveAuthors(comment.username),
	];

	Promise.all(promises)
		.then(() => {
			return addCommentOnArticle(articleId, comment);
		})
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch((err) => {
			next(err);
		});
};
