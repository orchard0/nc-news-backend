const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index.js');
const request = require('supertest');
const app = require('../app/index.js');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('GET /api', () => {
	test('200: responds with a description of all other endpoints available', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body }) => {
				const { routes } = body;
				for (const route in routes) {
					expect(route).toMatchObject({
						description: expect.any(String),
						queries: expect.any(Array),
						body: expect.any(String),
						exampleResponse: expect.any(Object),
					});
				}
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
				const { topics } = body;
				expect(topics.length).toBe(3);
				for (const topic of topics) {
					expect(topic).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				}
			});
	});
});

describe('GET /api/articles/:article_id', () => {
	test('200: return an article when a valid id is supplied', () => {
		const article_id = 3;
		return request(app)
			.get(`/api/articles/${article_id}`)
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				for (const article of articles) {
					expect(article).toMatchObject({
						article_id: article_id,
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
					});
				}
			});
	});
	test('404: responds with an error if the article does not exist', () => {
		const article_id = 30;
		return request(app)
			.get(`/api/articles/${article_id}`)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found.');
			});
	});
	test('404: responds with an error if the article id is not vaild', () => {
		const article_id = '3n';
		return request(app)
			.get(`/api/articles/${article_id}`)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
});

describe('GET /api/articles/', () => {
	test('200: return all articles', () => {
		return request(app)
			.get(`/api/articles/`)
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				console.log(typeof articles);
				for (const article of articles) {
					expect(article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(Number),
					});
				}
				expect(articles).toBeSortedBy('created_at', {
					descending: true,
				});
			});
	});
});
