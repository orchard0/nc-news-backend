const db = require('../db/connection');
const { articleCommentCount } = require('./utils');

exports.retriveArticleById = (id) => {
	const sqlQuery = `select * from articles where article_id = $1`;
	return db.query(sqlQuery, [id]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Not found.' });
		}
		return rows;
	});
};

exports.retriveArticles = (sort_by = 'created_at', order = 'desc') => {
	let results;
	let queryString = `select * from articles `;

	if (sort_by) {
		queryString += `order by ${sort_by} ${order}`;
	}
	return db
		.query(queryString)
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
