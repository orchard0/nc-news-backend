const { getApiEndpoints } = require('../mcv/app.controller');
const apiRouter = require('express').Router();
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.get('/', getApiEndpoints);

module.exports = apiRouter;
