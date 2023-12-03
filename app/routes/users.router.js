const { getUsers } = require('../mcv/app.controller');

const usersRouter = require('express').Router();

usersRouter.route('/').get(getUsers);

module.exports = usersRouter;
