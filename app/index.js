// Bismillah ar-Rahman ar-Raheem

const express = require('express');
const { apiReady, getTopics } = require('./app.controller');

const app = express();
app.use(express.json());

module.exports = app;

app.get('/api', apiReady);
app.get('/api/topics', getTopics);
