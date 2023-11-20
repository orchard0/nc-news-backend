const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');
const request = require('supertest');
const app = require('../app/index.js');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('API ready', () => {
	test('200: responds with a msg that the api is available', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body }) => {
				expect(body.msg).toBe('Ready!');
			});
	});
});

describe('Invalid API path', () => {
	test('404: invalid path not found', () => {
		return request(app).get('/api/invalid').expect(404);
	});
});

describe('GET /api/topics', () => {
	test('200: responds with all topics', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				expect(body.length).toBe(3);
			});
	});
});
