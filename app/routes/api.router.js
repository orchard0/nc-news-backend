const {
	getApiEndpoints,
	getTopics,
	deleteComment,
	getUsers,
} = require('../mcv/app.controller');
const apiRouter = require('express').Router();
const articlesRouter = require('./articles.router');

apiRouter.use('/articles', articlesRouter);
apiRouter.get('/', getApiEndpoints);

apiRouter.get('/topics', getTopics);
apiRouter.delete('/comments/:comment_id', deleteComment);
apiRouter.get('/users', getUsers);

module.exports = apiRouter;
