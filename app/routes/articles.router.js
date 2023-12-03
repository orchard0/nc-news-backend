const {
	getArticles,
	updateArticle,
	getArticleById,
	getCommentsByArticleId,
	postCommentOnArticle,
} = require('../mcv/articles.controller');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:article_id').get(getArticleById).patch(updateArticle);
articlesRouter
	.route('/:article_id/comments')
	.get(getCommentsByArticleId)
	.post(postCommentOnArticle);

module.exports = articlesRouter;
