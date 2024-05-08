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
	test('400: responds with an error if the article id is not vaild', () => {
		const article_id = '3n';
		return request(app)
			.get(`/api/articles/${article_id}`)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
	test('200: return an article with a comment_count', () => {
		const article_id = 2;
		return request(app)
			.get(`/api/articles/${article_id}`)
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles.length).toBe(1);
				expect(articles[0]).toHaveProperty('comment_count');
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
				expect(articles.length).not.toBe(0);
				for (const article of articles) {
					expect(article).not.toHaveProperty('body');
					expect(article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
					});
				}
				expect(articles).toBeSortedBy('created_at', {
					descending: true,
				});
			});
	});
	test('200: return all articles with the specified topic', () => {
		return request(app)
			.get(`/api/articles/?topic=mitch`)
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles.length).toBe(12);
				for (const article of articles) {
					expect(article).not.toHaveProperty('body');
					expect(article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: 'mitch',
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
					});
				}
				expect(articles).toBeSortedBy('created_at', {
					descending: true,
				});
			});
	});
	test('200: respond with any empty array for a valid topic without articles', () => {
		return request(app)
			.get(`/api/articles/?topic=paper`)
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles).toEqual([]);
			});
	});
	test('404: return not found if topic is invalid', () => {
		return request(app)
			.get(`/api/articles/?topic=invaild`)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found.');
			});
	});
	test('200: return all articles using sort_by being created_at', () => {
		return request(app)
			.get(`/api/articles/?sort_by=title`)
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles.length).toBe(13);
				expect(articles).toBeSortedBy('title', {
					descending: true,
				});
				for (const article of articles) {
					expect(article).not.toHaveProperty('body');
					expect(article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
					});
				}
			});
	});
	test('200: return all articles in asc order ', () => {
		return request(app)
			.get('/api/articles?order=asc')
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles.length).toBe(13);
				expect(articles).toBeSortedBy('created_at', {
					descending: false,
				});
			});
	});
	test('200: return all articles sorted by author in asc order (combined use of sort_by and order query)', () => {
		return request(app)
			.get(`/api/articles/?sort_by=author&order=asc`)
			.expect(200)
			.then(({ body }) => {
				const { articles } = body;
				expect(articles.length).toBe(13);
				expect(articles).toBeSortedBy('author', {
					descending: false,
				});
				for (const article of articles) {
					expect(article).not.toHaveProperty('body');
					expect(article).toMatchObject({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
					});
				}
			});
	});
	test('400: return bad request if sort_by query is invalid', () => {
		return request(app)
			.get(`/api/articles/?sort_by=invalid`)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
	test('400: return bad request if order query is invalid', () => {
		return request(app)
			.get(`/api/articles/?order=invalid`)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
});

describe('GET /api/articles/:article_id/comments', () => {
	test('200: respond with all the comments for the specified article_id', () => {
		const article_id = 1;
		return request(app)
			.get(`/api/articles/${article_id}/comments`)
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments.length).not.toBe(0);

				for (const comment of comments) {
					expect(comment).toMatchObject({
						article_id: article_id,
						body: expect.any(String),
						author: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_id: expect.any(Number),
					});
				}

				expect(comments).toBeSortedBy('created_at', {
					descending: true,
				});
			});
	});

	test('200: respond with any empty array for a valid article without comments', () => {
		const article_id = 2; // does not have any comments
		return request(app)
			.get(`/api/articles/${article_id}/comments`)
			.expect(200)
			.then(({ body }) => {
				const { comments } = body;
				expect(comments).toEqual([]);
			});
	});
	test('404: respond with not found for a vaild non-existent article_id', () => {
		const article_id = 9999;
		return request(app)
			.get(`/api/articles/${article_id}/comments`)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found.');
			});
	});
	test('400: respond with bad request for an invalid article_id', () => {
		const article_id = 't33';
		return request(app)
			.get(`/api/articles/${article_id}/comments`)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
});

describe('POST /api/articles/:article_id/comments', () => {
	test('201: returns the comment added to the database', () => {
		const input = {
			username: 'icellusedkars',
			body: 'this is a new comment',
		};
		const article_id = 2;
		return request(app)
			.post(`/api/articles/${article_id}/comments`)
			.send(input)
			.expect(201)
			.then(({ body }) => {
				const { comment } = body;
				expect(comment.length).toBe(1);
				expect(comment[0]).toMatchObject({
					article_id: article_id,
					body: expect.any(String),
					author: expect.any(String),
					created_at: expect.any(String),
					votes: expect.any(Number),
					comment_id: expect.any(Number),
				});
			});
	});
	test('404: responds with not found if the username is invaild', () => {
		const input = {
			username: 'invaliduser',
			body: 'this is a new comment',
		};
		const article_id = 2;
		return request(app)
			.post(`/api/articles/${article_id}/comments`)
			.send(input)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found.');
			});
	});
	test('400: responds with a bad request if the article_id is invaild', () => {
		const input = {
			username: 'icellusedkars',
			body: 'this is a new comment',
		};
		const article_id = 'notvaild';
		return request(app)
			.post(`/api/articles/${article_id}/comments`)
			.send(input)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
	test('400: responds with a bad request if the body was empty', () => {
		const input = {
			username: 'icellusedkars',
			body: '',
		};
		const article_id = 1;
		return request(app)
			.post(`/api/articles/${article_id}/comments`)
			.send(input)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
	test('400: responds with a bad request if the body is missing', () => {
		const input = {
			username: 'icellusedkars',
		};
		const article_id = 1;
		return request(app)
			.post(`/api/articles/${article_id}/comments`)
			.send(input)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
});

describe('PATCH /api/articles/:article_id', () => {
	test('200: responds with the updated article', () => {
		const input = { inc_votes: 100 };
		const article_id = 1;
		return request(app)
			.patch(`/api/articles/${article_id}`)
			.send(input)
			.expect(200)
			.then(({ body }) => {
				const { article } = body;
				expect(article.length).toBe(1);
				expect(article[0]).toMatchObject({
					article_id: article_id,
					title: expect.any(String),
					topic: expect.any(String),
					author: expect.any(String),
					created_at: expect.any(String),
					votes: 200,
					article_img_url: expect.any(String),
				});
			});
	});
	test('400: responds with a bad request if the patch is invaild', () => {
		const input = { inc_votes: 'invaild' };
		const article_id = 1;
		return request(app)
			.patch(`/api/articles/${article_id}`)
			.send(input)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
	test('404: responds with not found if the article_id does not exist', () => {
		const input = { inc_votes: 100 };
		const article_id = 9999;
		return request(app)
			.patch(`/api/articles/${article_id}`)
			.send(input)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found.');
			});
	});
	test('400: responds with bad request if the article_id is not vaild', () => {
		const input = { inc_votes: 100 };
		const article_id = 'invalid';
		return request(app)
			.patch(`/api/articles/${article_id}`)
			.send(input)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
});

describe('DELETE /api/comments/:comment_id', () => {
	test('204: responds with no content', () => {
		const comment_id = 1;
		return request(app).delete(`/api/comments/${comment_id}`).expect(204);
	});
	test('404: responds not found for non-existent comment_id', () => {
		const comment_id = 9999;
		return request(app)
			.delete(`/api/comments/${comment_id}`)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found.');
			});
	});
	test('400: responds bad request for invalid comment_id', () => {
		const comment_id = 'invaild';
		return request(app)
			.delete(`/api/comments/${comment_id}`)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});
});

describe('GET /api/users', () => {
	test('200: respond with all users', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body }) => {
				const { users } = body;

				expect(users.length).not.toBe(0);

				for (const user of users) {
					expect(user).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					});
				}
			});
	});
});

describe('PATCH /api/comments/:comment_id', () => {
	test('200: respond updated comment', () => {
		const comment_id = 3;
		const body = { inc_votes: 1 };
		return request(app)
			.patch(`/api/comments/${comment_id}`)
			.send(body)
			.expect(200)
			.then(({ body }) => {
				const { comment } = body;
				expect(comment.length).toBe(1);
				expect(comment[0]).toMatchObject({
					comment_id: comment_id,
					article_id: 1,
					author: 'icellusedkars',
					created_at: '2020-03-01T01:13:00.000Z',
					votes: 101,
				});
			});
	});

	test('400: responds with a bad request if the patch is invaild', () => {
		const comment_id = 3;
		const body = { inc_votes: 'invalid' };
		return request(app)
			.patch(`/api/comments/${comment_id}`)
			.send(body)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});

	test('400: responds with bad request if the comment_id is not vaild', () => {
		const comment_id = 'invalid';
		const body = { inc_votes: 1 };
		return request(app)
			.patch(`/api/comments/${comment_id}`)
			.send(body)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request.');
			});
	});

	test('404: responds with not found if the comment_id does not exist', () => {
		const comment_id = 999999;
		const body = { inc_votes: 1 };
		return request(app)
			.patch(`/api/comments/${comment_id}`)
			.send(body)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Not found.');
			});
	});
});
