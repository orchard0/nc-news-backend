const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');
const request = require('supertest');
const app = require('../app/index.js');

beforeAll(() => seed(data));
afterAll(() => db.end());

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
				for (item of body) {
					expect(item).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				}
				expect(body.length).toBe(3);
			});
	});
});
