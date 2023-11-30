const { retriveTopicbyName } = require('./app.models');
const {
	retriveArticleById,
	retriveArticles,
	retriveCommentsbyArticleId,
	addCommentOnArticle,
	updateArticleOnDatabase,
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
	const { topic, sort_by, order } = req.query;

	articlePromises = [retriveArticles(topic, sort_by, order)];

	if (topic) {
		articlePromises.push(retriveTopicbyName(topic));
	}

	Promise.all(articlePromises)
		.then((resolved) => {
			const articles = resolved[0];
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

exports.updateArticle = (req, res, next) => {
	const body = req.body;
	const articleId = req.params.article_id;
	updateArticleOnDatabase(articleId, body)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};
