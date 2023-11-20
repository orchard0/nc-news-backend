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
				for (const route in body) {
					expect(body[route]).toMatchObject({
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
				for (const item of body) {
					expect(item).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				}
				expect(body.length).toBe(3);
			});
	});
});

describe.only('GET /api/articles/:article_id', () => {
	test('200: return an article when a valid id is supplied', () => {
		const article_id = 3;
		return request(app)
			.get(`/api/articles/${article_id}`)
			.expect(200)
			.then(({ body }) => {
				for (const article of body) {
					expect(article).toMatchObject({
						article_id: expect.any(Number),
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

// not found id, wrong type,

// [
// 	{
// 		article_id: 3,
// 		title: 'Eight pug gifs that remind me of mitch',
// 		topic: 'mitch',
// 		author: 'icellusedkars',
// 		body: 'some gifs',
// 		created_at: '2020-11-03T09:12:00.000Z',
// 		votes: 0,
// 		article_img_url:
// 			'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
// 	},
// ];
