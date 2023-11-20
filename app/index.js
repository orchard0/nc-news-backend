// Bismillah ar-Rahman ar-Raheem

const express = require('express');
const { getApiEndpoints, getTopics } = require('./app.controller');

const app = express();
app.use(express.json());

app.get('/api', getApiEndpoints);
app.get('/api/topics', getTopics);

module.exports = app;
