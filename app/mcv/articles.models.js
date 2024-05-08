const format = require('pg-format');
const db = require('../../db/connection');
const { articleCommentCount } = require('../utils');

exports.retriveArticleById = (id) => {
	const sqlQuery =
		'SELECT articles.*,  count(comments.article_id) as comment_count from articles left join comments on articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ';
	return db.query(sqlQuery, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found.' });
		}
		return rows;
	});
};

exports.retriveArticles = (topic, sort_by = 'created_at', order = 'desc') => {
	const validSortBy = [
		'article_id',
		'title',
		'topic',
		'author',
		'body',
		'created_at',
		'votes',
	];
	if (sort_by && !validSortBy.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'Bad request.' });
	}
	const validOrder = ['desc', 'asc'];
	if (order && !validOrder.includes(order)) {
		return Promise.reject({ status: 400, msg: 'Bad request.' });
	}

	let queryValues = [];
	let queryString = `SELECT articles.*, count(comments.article_id) as comment_count from articles left join comments on articles.article_id = comments.article_id `;

	if (topic) {
		queryValues.push(topic);
		queryString += `where topic = $1 `;
	}

	queryString += 'GROUP BY articles.article_id ';

	if (sort_by) {
		queryString += `order by ${sort_by} ${order}`;
	}
	console.log(queryString);
	return db.query(queryString, queryValues).then(({ rows }) => {
		return rows.map(({ body, ...rest }) => {
			return { ...rest };
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
	const queryValues = [Number(body.inc_votes), articleID];
	const queryString = `update articles set votes = votes + $1 where article_id = $2 returning *`;
	return db.query(queryString, queryValues).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found.' });
		}
		return rows;
	});
};
