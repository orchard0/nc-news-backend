// Bismillah ar-Rahman ar-Raheem

const express = require('express');
const {
	handleCustomErrors,
	handlePostgreErrors,
	handleServerErrors,
} = require('./errors');
const apiRouter = require('./routes/api.router');

const app = express();
app.use(express.json());

app.use('/api', apiRouter);
app.use(handlePostgreErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
