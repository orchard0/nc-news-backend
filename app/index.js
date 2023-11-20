// Bismillah ar-Rahman ar-Raheem

const express = require('express');
const { getTopics } = require('./app.controller');

const app = express();
app.use(express.json());
app.get('/api/topics', getTopics);

module.exports = app;
