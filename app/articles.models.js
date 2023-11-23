const format = require('pg-format');
const db = require('../db/connection');
const { articleCommentCount } = require('./utils');
const { getArticleById } = require('./articles.controller');

exports.retriveArticleById = (id) => {
	const sqlQuery = `select * from articles where article_id = $1`;
	return db.query(sqlQuery, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found.' });
		}
		return rows;
	});
};

exports.retriveArticles = (topic, sort_by = 'created_at', order = 'desc') => {
	let results;
	let queryValues = [];
	let queryString = `select * from articles `;

	if (topic) {
		queryValues.push(topic);
		queryString += `where topic = $1 `;
	}

	if (sort_by) {
		queryString += `order by ${sort_by} ${order}`;
	}
	return db
		.query(queryString, queryValues)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, msg: 'Not found.' });
			}
			results = rows;
			return db.query('select article_id from comments');
		})
		.then(({ rows }) => {
			const commentCount = articleCommentCount(rows);
			return results.map(({ body, article_id, ...rest }) => {
				return {
					article_id,
					comment_count: commentCount[article_id] || 0,
					...rest,
				};
			});
		});
};

exports.retriveCommentsbyArticleId = (articleId) => {
	let queryString = `select * from comments where article_id = $1 order by created_at desc`;
	return db.query(queryString, [articleId]).then(({ rows }) => {
		return rows;
	});
};

exports.addCommentOnArticle = (article_id, { body, username }) => {
	try {
		if (!body.length) {
			return Promise.reject({ status: 400, msg: 'Bad request.' });
		}
	} catch {
		return Promise.reject({ status: 400, msg: 'Bad request.' });
	}

	let queryString = format(
		'insert into comments (body, article_id, author, votes) values %L returning *',
		[[body, article_id, username, 0]]
	);

	return db.query(queryString).then(({ rows }) => {
		return rows;
	});
};

exports.updateArticleOnDatabase = (articleID, body) => {
	return this.retriveArticleById(articleID)
		.then((articles) => {
			const article = articles[0];
			const updatedVotes = article.votes + Number(body.inc_votes);
			const queryValues = [updatedVotes, articleID];
			const queryString = `update articles set votes = $1 where article_id = $2 returning *`;
			return db.query(queryString, queryValues);
		})
		.then(({ rows }) => {
			return rows;
		});
};
